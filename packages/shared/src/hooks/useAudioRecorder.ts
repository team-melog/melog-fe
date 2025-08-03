import { useState, useRef, useCallback, useEffect } from 'react'

export interface AudioRecorderState {
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  audioBlob: Blob | null
  error: string | null
  // 실시간 음성 인식 상태
  realtimeText: string
  isListening: boolean
  interimText: string
}

export interface AudioRecorderControls {
  startRecording: () => Promise<void>
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  resetRecording: () => void
  playRecording: () => Promise<void>
  // 실시간 음성 인식 제어
  updateRealtimeText: (text: string) => void
}

const MAX_RECORDING_TIME = 60 // 60초 제한

export const useAudioRecorder = (): AudioRecorderState & AudioRecorderControls => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // 실시간 음성 인식 상태
  const [realtimeText, setRealtimeText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  
  // 실시간 음성 인식 refs
  const recognitionRef = useRef<any>(null)
  const isRecognitionSupported = useRef<boolean>(false)

  // 타이머 시작
  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= MAX_RECORDING_TIME) {
          // 60초 도달 시 자동 정지
          stopRecording()
          return MAX_RECORDING_TIME
        }
        return prev + 1
      })
    }, 1000)
  }, [])

  // 타이머 정지
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 실시간 음성 인식 초기화
  const initializeSpeechRecognition = useCallback(() => {
    // Web Speech API 지원 확인
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      isRecognitionSupported.current = false
      return
    }
    
    isRecognitionSupported.current = true
    recognitionRef.current = new SpeechRecognition()
    
    const recognition = recognitionRef.current
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'ko-KR'
    
    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }
    
    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }
      
      // 최종 결과가 있으면 기존 텍스트에 추가
      if (finalTranscript) {
        setRealtimeText(prev => {
          const newText = prev ? `${prev} ${finalTranscript}` : finalTranscript
          return newText.trim()
        })
        setInterimText('')
      }
      
      // 중간 결과 업데이트
      if (interimTranscript) {
        setInterimText(interimTranscript)
      }
    }
    
    recognition.onerror = (event: any) => {
      console.error('음성 인식 오류:', event.error)
      if (event.error !== 'no-speech' && event.error !== 'audio-capture') {
        setError(`음성 인식 오류: ${event.error}`)
      }
    }
    
    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
      
      // 녹음 중이면 다시 시작
      if (isRecording && !isPaused && isRecognitionSupported.current) {
        try {
          recognition.start()
        } catch (err) {
          console.warn('음성 인식 재시작 실패:', err)
        }
      }
    }
  }, [isRecording, isPaused])
  
  // 음성 인식 시작
  const startSpeechRecognition = useCallback(() => {
    if (recognitionRef.current && isRecognitionSupported.current) {
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.warn('음성 인식 시작 실패:', err)
      }
    }
  }, [])
  
  // 음성 인식 정지
  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current && isRecognitionSupported.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.warn('음성 인식 정지 실패:', err)
      }
    }
    setIsListening(false)
    setInterimText('')
  }, [])

  // 녹음 시작
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setRealtimeText('')
      setInterimText('')
      
      // 음성 인식 초기화
      initializeSpeechRecognition()
      
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      })
      
      streamRef.current = stream
      audioChunksRef.current = []

      // MediaRecorder 설정
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' })
        setAudioBlob(audioBlob)
        
        // 실시간 음성 인식 정지
        stopSpeechRecognition()
        
        // 스트림 정리
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      startTimer()
      
      // 실시간 음성 인식 시작
      setTimeout(() => {
        startSpeechRecognition()
      }, 500) // 녹음 시작 후 약간의 지연

    } catch (err) {
      console.error('녹음 시작 오류:', err)
      setError('마이크 접근 권한이 필요합니다.')
    }
  }, [startTimer, initializeSpeechRecognition, startSpeechRecognition, stopSpeechRecognition])

  // 녹음 정지
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    // 실시간 음성 인식 정지
    stopSpeechRecognition()
    
    setIsRecording(false)
    setIsPaused(false)
    stopTimer()
  }, [stopTimer, stopSpeechRecognition])

  // 녹음 일시정지
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      stopTimer()
      
      // 음성 인식도 일시정지
      stopSpeechRecognition()
    }
  }, [stopTimer, stopSpeechRecognition])

  // 녹음 재개
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      startTimer()
      
      // 음성 인식도 재개
      setTimeout(() => {
        startSpeechRecognition()
      }, 200)
    }
  }, [startTimer, startSpeechRecognition])

  // 녹음 초기화
  const resetRecording = useCallback(() => {
    stopRecording()
    setRecordingTime(0)
    setAudioBlob(null)
    setError(null)
    setRealtimeText('')
    setInterimText('')
    audioChunksRef.current = []
  }, [stopRecording])
  
  // 실시간 텍스트 수동 업데이트
  const updateRealtimeText = useCallback((text: string) => {
    setRealtimeText(text)
  }, [])

  // 녹음 재생
  const playRecording = useCallback(async () => {
    if (!audioBlob) return

    try {
      const audio = new Audio()
      audio.src = URL.createObjectURL(audioBlob)
      await audio.play()
    } catch (err) {
      console.error('재생 오류:', err)
      setError('오디오 재생에 실패했습니다.')
    }
  }, [audioBlob])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopTimer()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [stopTimer])

  return {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    error,
    realtimeText,
    isListening,
    interimText,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    playRecording,
    updateRealtimeText,
  }
}
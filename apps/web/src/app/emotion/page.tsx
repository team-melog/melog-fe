'use client'

import { useState } from 'react'
import { Layout, Button, EmotionSelector, AudioRecorder, AIAnalysisResult } from '@melog/ui'
import { useEmotionStore } from '@melog/shared'
import { useRouter } from 'next/navigation'
import type { EmotionSelection } from '@melog/shared'

export default function EmotionPage() {
  const router = useRouter()
  const { currentEntry, addEntry, setCurrentEntry } = useEmotionStore()
  const [voiceNote, setVoiceNote] = useState<string>('')
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSaveEmotion = () => {
    if (currentEntry?.emotion && currentEntry?.intensity) {
      addEntry({
        emotion: currentEntry.emotion,
        intensity: currentEntry.intensity,
        ...(voiceNote && { voiceNote }),
      })
      router.push('/')
    }
  }
  
  // AI 분석 실행 (더미 데이터)
  const handleAIAnalysis = () => {
    setIsAnalyzing(true)
    setShowAIAnalysis(true)
    
    // 2초 후 더미 분석 결과 표시
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }
  
  // 더미 AI 분석 데이터
  const dummyAnalysis = {
    summary: `선택하신 ${currentEntry?.emotion ? currentEntry.emotion : '감정'}(강도 ${currentEntry?.intensity || 1})${voiceNote ? '과 음성 메모' : ''}를 분석한 결과, 현재 감정 상태는 일시적인 것으로 보입니다. 이러한 감정은 자연스러운 것이며, 적절한 대처를 통해 개선할 수 있습니다.`,
    suggestions: [
      '깊게 숨을 들이마시고 천천히 내쉬는 호흡 운동을 5분간 해보세요',
      '좋아하는 음악을 들으며 10분간 산책해보세요',
      '감사한 일 3가지를 종이에 적어보세요',
      '가까운 사람과 따뜻한 대화를 나눠보세요'
    ],
    emotionScore: currentEntry?.emotion === 'joy' ? 85 : 
                  currentEntry?.emotion === 'sadness' ? 25 :
                  currentEntry?.emotion === 'anger' ? 15 :
                  currentEntry?.emotion === 'fear' ? 30 :
                  currentEntry?.emotion === 'surprise' ? 70 :
                  currentEntry?.emotion === 'disgust' ? 20 : 50
  }

  const handleSelectionChange = (selection: EmotionSelection | null) => {
    console.log('감정 선택 변경:', selection)
  }

  const handleTranscriptionComplete = (text: string) => {
    setVoiceNote(text)
    // 음성 메모를 현재 기록에 추가
    setCurrentEntry({
      ...currentEntry,
      voiceNote: text,
    })
  }

  const handleAudioError = (error: string) => {
    console.error('음성 인식 오류:', error)
    // 사용자에게 에러 알림 (toast 등으로 대체 가능)
  }

  return (
    <Layout showTabBar={false}>
      {/* Mobile-first emotion recording */}
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            감정 기록하기
          </h1>
          <p className="text-sm text-gray-600">
            지금 느끼는 감정과 강도를 선택해주세요
          </p>
        </header>

        <main className="space-y-6">
          {/* 감정 선택 */}
          <EmotionSelector onSelectionChange={handleSelectionChange} />

          {/* 음성 메모 섹션 */}
          {currentEntry?.emotion && currentEntry?.intensity && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-blue-800">
                  음성 메모 (선택사항)
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAudioRecorder(!showAudioRecorder)}
                  className="text-blue-600"
                >
                  {showAudioRecorder ? '숨기기' : '🎤 추가'}
                </Button>
              </div>
              
              {showAudioRecorder && (
                <AudioRecorder
                  onTranscriptionComplete={handleTranscriptionComplete}
                  onError={handleAudioError}
                  maxDuration={60}
                />
              )}
              
              {voiceNote && !showAudioRecorder && (
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>음성 메모:</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    {voiceNote}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAudioRecorder(true)}
                    className="mt-2 text-blue-600"
                  >
                    ✏️ 수정
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* AI 분석 버튼 */}
          {currentEntry?.emotion && currentEntry?.intensity && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-purple-800">
                  🤖 AI 감정 분석 (선택사항)
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                  className="text-purple-600"
                >
                  {showAIAnalysis ? '숨기기' : '📊 분석하기'}
                </Button>
              </div>
              
              {showAIAnalysis && (
                <div className="space-y-3">
                  {!isAnalyzing && (
                    <Button
                      onClick={handleAIAnalysis}
                      variant="outline"
                      className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      🔮 AI로 감정 분석하기
                    </Button>
                  )}
                  
                  <AIAnalysisResult
                    analysis={dummyAnalysis}
                    isLoading={isAnalyzing}
                    onRetry={handleAIAnalysis}
                  />
                </div>
              )}
            </div>
          )}

          {/* 저장 버튼 */}
          <div className="space-y-3">
            <Button
              onClick={handleSaveEmotion}
              disabled={!currentEntry?.emotion || !currentEntry?.intensity}
              className="w-full"
            >
              💾 감정 저장하기
              {voiceNote && <span className="ml-1">(음성 메모 포함)</span>}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              ← 취소
            </Button>
          </div>

          {/* 저장 안내 */}
          {currentEntry?.emotion && currentEntry?.intensity && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-sm text-green-800">
                💡 {voiceNote ? '음성 메모와 함께 ' : ''}저장 버튼을 눌러 감정을 기록하세요!
              </p>
            </div>
          )}
        </main>
      </div>
    </Layout>
  )
}
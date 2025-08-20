'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout, LeftIcon, MicrophoneIcon } from '@melog/ui';
import { useAppStore } from '@/features/store';
import {
  emotionColorsByStep,
  emotionIconsByStep,
} from '@/entities/emotion/types';
import {
  useDeleteEmotionDetail,
  useEmotionDetail,
} from '@/features/emotion/hooks/useEmotionApi';
import { svgComponents } from '@/assets/svgs/emotions/EmotionSvg';
import { EmotionDetailResponse } from '@/features/emotion/api/types';
import GradientIcon from '@/assets/svgs/common/GradientIcon';
import MoreDotIcon from '@/assets/svgs/common/MoreDotIcon';
import ArrowDownIcon from '@/assets/svgs/common/ArrowDownIcon';
import PlayIcon from '@/assets/svgs/common/PlayIcon';
import PlayingIcon from '@/assets/svgs/common/PlayingIcon';
import { CheckIcon } from '@melog/ui';
import { intensityLabels } from '@melog/shared';
import LottiePlayLoadingBar from '@/components/lotties/LottiePlayLoadingBar';
import {
  useGetConvertedVoice,
  useGetVoiceTypes,
} from '@/features/voice/hooks/useVoiceApi';
import { ConvertedVoiceType, VoiceType } from '@/features/voice/api/types';

export default function FeedDetailPage() {
  const router = useRouter();
  const params = useParams();
  const emotionId = params.id as string;

  const { user } = useAppStore();
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'record'>('ai');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingRecord, setIsPlayingRecord] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTimeRecord, setCurrentTimeRecord] = useState(0);
  const [durationRecord, setDurationRecord] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRecordRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRecordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('ARA');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isLoadTSS, setIsLoadTSS] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const { mutate: getConvertedVoice } = useGetConvertedVoice();

  // 오디오 재생 관련 함수들
  const setupAudioEvents = (audio: HTMLAudioElement, isMyRecord: boolean) => {
    audio.addEventListener('loadedmetadata', () => {
      if (isMyRecord) {
        setDurationRecord(audio.duration || 0);
      } else {
        setDuration(audio.duration || 0);
      }
    });

    audio.addEventListener('ended', () => {
      if (isMyRecord) {
        setIsPlayingRecord(false);
        setIsLoadTSS(false);
        setCurrentTimeRecord(0);
        if (progressRecordIntervalRef.current) {
          clearInterval(progressRecordIntervalRef.current);
        }
      } else {
        setIsPlaying(false);
        setIsLoadTSS(false);
        setCurrentTime(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    });
  };

  const startAudioPlayback = (audio: HTMLAudioElement, isMyRecord: boolean) => {
    audio.play();
    setIsPlaying(true);

    // 프로그레스 업데이트 시작
    if (isMyRecord) {
      progressRecordIntervalRef.current = setInterval(() => {
        if (audioRecordRef.current) {
          setCurrentTimeRecord(audioRecordRef.current.currentTime);
        }
      }, 100);
    } else {
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    }
  };

  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const startRecordAudioPlayback = (audio: HTMLAudioElement) => {
    audio.play();
    setIsPlayingRecord(true);

    // 프로그레스 업데이트 시작
    progressRecordIntervalRef.current = setInterval(() => {
      if (audioRecordRef.current) {
        setCurrentTimeRecord(audioRecordRef.current.currentTime);
      }
    }, 100);
  };

  const stopRecordAudioPlayback = () => {
    if (audioRecordRef.current) {
      audioRecordRef.current.pause();
    }
    setIsPlayingRecord(false);
    if (progressRecordIntervalRef.current) {
      clearInterval(progressRecordIntervalRef.current);
    }
  };

  const createAndPlayAudio = (audioUrl: string, isMyRecord: boolean) => {
    // 기존 오디오 객체가 있다면 src만 변경
    const target = isMyRecord ? audioRecordRef : audioRef;
    if (target.current) {
      target.current.pause();
      target.current.src = audioUrl;
      target.current.load(); // 새로운 src 로드
    } else {
      // 새로운 오디오 객체 생성
      target.current = new Audio(audioUrl);
      setupAudioEvents(target.current, isMyRecord);
    }

    startAudioPlayback(target.current, isMyRecord);
  };

  const toggleAIPlayBtn = () => {
    setIsLoadTSS(true);
    togglePlay();
  };

  const { data: voiceTypes, isLoading: isLoadingVoiceTypes } =
    useGetVoiceTypes();
  const { data: emotionDetail, isLoading } = useEmotionDetail(
    user.name,
    emotionId
  );

  const { mutate: deleteEmotion } = useDeleteEmotionDetail();

  // 바텀시트 애니메이션 효과
  useEffect(() => {
    if (showVoiceSelector) {
      // 바텀시트를 먼저 렌더링한 후 애니메이션 시작
      const timer = setTimeout(() => {
        setIsBottomSheetVisible(true);
      }, 10);
      // 음성 선택기가 열릴 때 에러 초기화
      setVoiceError(null);
      return () => clearTimeout(timer);
    } else {
      setIsBottomSheetVisible(false);
    }
  }, [showVoiceSelector]);

  // 상태 변화 추적
  useEffect(() => {
    if (isLoading && isLoadingVoiceTypes) return;
    // console.log('emotionDetail', emotionDetail);
    // console.log('voiceTypes', voiceTypes);
  }, [isLoading, emotionDetail, voiceTypes, isLoadingVoiceTypes]);

  // AI 오디오 초기화 함수
  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoadTSS(false);
    setCurrentTime(0);
    setDuration(0);
  };

  // 녹음 오디오 초기화 함수
  const resetRecordAudio = () => {
    if (audioRecordRef.current) {
      audioRecordRef.current.pause();
      if (progressRecordIntervalRef.current) {
        clearInterval(progressRecordIntervalRef.current);
      }
      audioRecordRef.current = null;
    }
    setIsPlayingRecord(false);
    setCurrentTimeRecord(0);
    setDurationRecord(0);
  };

  // 음성 타입 변경 함수
  const changeVoiceType = (voiceType: string) => {
    resetAudio();
    resetRecordAudio();
    setSelectedVoice(voiceType);
    setVoiceError(null); // 에러도 함께 초기화
  };

  // 가장 높은 percentage를 가진 감정을 메인 감정으로 선택
  const mainEmotion =
    (emotionDetail as unknown as EmotionDetailResponse) &&
    (emotionDetail as unknown as EmotionDetailResponse)?.emotions &&
    (emotionDetail as unknown as EmotionDetailResponse)?.emotions.length &&
    (emotionDetail as unknown as EmotionDetailResponse)?.emotions?.reduce(
      (prev, current) => (prev.percentage > current.percentage ? prev : current)
    );

  const date = (emotionDetail as unknown as EmotionDetailResponse)?.date;
  const formattedDate =
    date &&
    new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
    })
      .format(new Date(date))
      .replaceAll(' ', '')
      .replace(/\.([월화수목금토일]요일)/, ' $1');

  const aiSummary = `${(emotionDetail as unknown as EmotionDetailResponse) && (emotionDetail as unknown as EmotionDetailResponse)?.summary}\n`;

  const handleDelete = () => {
    if (deletedId) {
      deleteEmotion({ nickname: user.name, id: deletedId.toString() });
      setDeletedId(null);
      router.push('/feed');
    }
  };

  const handleBack = () => {
    router.back();
  };

  // [AI] 재생 버튼 핸들러
  const togglePlay = () => {
    if (isPlaying) {
      // 일시정지
      setIsLoadTSS(false);
      return stopAudioPlayback();
    }

    // 재생 상태가 아닐 때 (일시정지 상태)
    if (audioRef.current) {
      // 기존 오디오가 있으면 그대로 재생
      startAudioPlayback(audioRef.current, true);
      return;
    }

    getConvertedVoice(
      {
        nickname: user.name,
        emotionId,
        payload: {
          isUserUploadRequst: false,
          isRequiredUserAudio:
            (emotionDetail as unknown as EmotionDetailResponse)?.text.length ===
            0,
          voiceType: selectedVoice === 'MY' ? null : selectedVoice,
        },
      },
      {
        onSuccess: (data: unknown | ConvertedVoiceType) => {
          // console.log('음성 변환 성공0:', data);
          setVoiceError(null);
          setIsLoadTSS(false);

          // 성공 시 audioUrl로 오디오 재생
          if ((data as unknown as ConvertedVoiceType)?.audioUrl) {
            createAndPlayAudio(
              (data as unknown as ConvertedVoiceType).audioUrl,
              false
            );
          }
        },
        onError: error => {
          console.error(error);
          setVoiceError(error.message);
          setIsLoadTSS(false);
        },
      }
    );
  };

  // [나의 기록 탭] 재생 버튼 핸들러
  const toggleMyPlayBtn = () => {
    if (isPlayingRecord) {
      // 일시정지
      return stopRecordAudioPlayback();
    }

    // 재생 상태가 아닐 때 (일시정지 상태)
    if (audioRecordRef.current) {
      // 기존 오디오가 있으면 그대로 재생
      startRecordAudioPlayback(audioRecordRef.current);
      return;
    }

    setIsLoadTSS(true);

    // audioRef.current가 없을 때 새로운 오디오 생성
    if (
      selectedVoice === 'MY' &&
      (emotionDetail as unknown as EmotionDetailResponse)?.audioFilePath
    ) {
      const audioPath =
        (emotionDetail as unknown as EmotionDetailResponse)?.audioFilePath ||
        '/static/audio/test.wav';
      audioRecordRef.current = new Audio(audioPath);
      setupAudioEvents(audioRecordRef.current, true);
      startRecordAudioPlayback(audioRecordRef.current);
      setIsLoadTSS(false);
    } else {
      // AI 목소리
      // console.log('de', emotionDetail);
      getConvertedVoice(
        {
          nickname: user.name,
          emotionId,
          payload: {
            isUserUploadRequst: true,
            isRequiredUserAudio: true,
            voiceType: selectedVoice === 'MY' ? null : selectedVoice,
          },
        },
        {
          onSuccess: (data: unknown | ConvertedVoiceType) => {
            // console.log('my 음성성공:', data);
            setVoiceError(null);
            setIsLoadTSS(false);

            // 성공 시 audioUrl로 오디오 재생
            if ((data as unknown as ConvertedVoiceType)?.audioUrl) {
              createAndPlayAudio(
                (data as unknown as ConvertedVoiceType).audioUrl,
                true
              );
            }
          },
          onError: error => {
            console.error(error);
            setVoiceError(error.message);
            setIsLoadTSS(false);
          },
        }
      );
    }
  };

  // 보이스 선택 바텀시트 토글
  const toggleVoiceSelector = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowVoiceSelector(!showVoiceSelector);
  };

  // 확인 버튼 클릭
  const handleConfirmVoice = () => {
    setShowVoiceSelector(false);
  };

  // 현재 선택된 보이스 텍스트
  const getCurrentVoiceText = () => {
    const defaultVoiceName = '나의 목소리';
    if (selectedVoice === 'MY') {
      return defaultVoiceName;
    }

    if (voiceTypes) {
      const matchedVoice = (voiceTypes as unknown as VoiceType[]).find(
        voice => voice.name === selectedVoice
      );
      if (matchedVoice) {
        return matchedVoice.voiceName;
      }
    }

    return defaultVoiceName;
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioRecordRef.current) {
        audioRecordRef.current.pause();
        audioRecordRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (progressRecordIntervalRef.current) {
        clearInterval(progressRecordIntervalRef.current);
      }
    };
  }, []);

  // 시간 포맷팅 함수 추가
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Layout showTabBar={true} nickname={user?.name}>
      <div className="font-meetme min-h-screen bg-[#f8f8f7]">
        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={handleBack}
              className="w-6 h-6 flex items-center justify-center"
            >
              <LeftIcon />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col pb-[59px]">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#060607]"></div>
            </div>
          )}

          {/* Content */}
          {!isLoading && (
            <div className="space-y-4">
              {/* Current Feed */}
              <div className="bg-white">
                {/* Date */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[22px] font-normal text-black tracking-[-0.22px] leading-[26.4px]">
                      {formattedDate}
                    </h2>

                    <button onClick={() => setDeletedId(Number(emotionId))}>
                      <MoreDotIcon width={24} height={24} />
                    </button>
                  </div>
                </div>

                {/* Emotion Display */}
                <div className="px-4 pb-4">
                  {/* Emotion Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="relative flex items-center justify-center">
                      {(emotionDetail as unknown as EmotionDetailResponse)
                        ?.emotions[0] &&
                        (() => {
                          const iconId =
                            emotionIconsByStep[
                              (
                                emotionDetail as unknown as EmotionDetailResponse
                              )?.emotions[0]
                                .type as keyof typeof emotionIconsByStep
                            ]?.[
                              (
                                emotionDetail as unknown as EmotionDetailResponse
                              )?.emotions[0].step - 1
                            ];
                          const SvgComponent = iconId
                            ? svgComponents[iconId]
                            : null;

                          if (!SvgComponent) return null;

                          return <SvgComponent width={220} height={220} />;
                        })()}
                    </div>
                  </div>

                  {/* Emotion Name and Tags */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-[26px] font-normal text-[#060607] tracking-[-0.26px] leading-[31.2px]">
                        {mainEmotion && intensityLabels[mainEmotion.step - 1]}
                        &nbsp;
                        {mainEmotion && mainEmotion.type}
                      </h3>
                      <div className="flex space-x-2 font-pretendard">
                        {(emotionDetail as unknown as EmotionDetailResponse)
                          ?.emotions?.length > 1 ? (
                          <span className="px-1 py-1 bg-[#6BFCC1] text-black text-xs font-semibold rounded">
                            AI
                          </span>
                        ) : (
                          <span className="px-1 py-1 bg-[#fff399] text-black text-xs font-semibold rounded">
                            Me
                          </span>
                        )}

                        {(emotionDetail as unknown as EmotionDetailResponse)
                          ?.hasAudioFile && (
                          <span className="px-1 py-1 bg-[#b7daf9] text-black text-xs font-semibold rounded">
                            음성녹음
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 감정 뱃지 */}
                  <div className="flex justify-center space-x-2">
                    {(
                      emotionDetail as unknown as EmotionDetailResponse
                    ).emotions.map((result, index) => {
                      const colors =
                        emotionColorsByStep[
                          result.type as keyof typeof emotionColorsByStep
                        ];
                      const backgroundColor = colors ? colors[0] : '#cccccc';
                      const borderColor = colors ? colors[2] : '#cccccc';
                      const textColor = colors ? colors[4] : '#1f2024';

                      return (
                        <div
                          key={index}
                          className="w-[78px] h-[40px] rounded-xl border flex items-center justify-center"
                          style={{
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                          }}
                        >
                          <span
                            className="text-lg font-meetme"
                            style={{
                              color: textColor,
                            }}
                          >
                            {result.type} {result.percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-4 pb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setActiveTab('ai');
                        setSelectedVoice('ARA');
                        setIsPlaying(false);
                        setIsPlayingRecord(false);
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium text-lg tracking-[-0.18px] leading-[21.6px] transition-colors ${
                        activeTab === 'ai'
                          ? 'bg-[#060607] text-white'
                          : 'bg-white text-[#060607] border border-[#ecedef]'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <GradientIcon width={14} height={14} />
                        <span>AI 감정진단</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('record');
                        setSelectedVoice(
                          (emotionDetail as unknown as EmotionDetailResponse)
                            ?.hasAudioFile
                            ? 'MY'
                            : 'ARA'
                        );
                        setIsPlaying(false);
                        setIsPlayingRecord(false);
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium text-lg tracking-[-0.18px] leading-[21.6px] transition-colors ${
                        activeTab === 'record'
                          ? 'bg-[#060607] text-white'
                          : 'bg-white text-[#060607] border border-[#ecedef]'
                      }`}
                    >
                      나의 기록
                    </button>
                  </div>
                </div>

                {/* AI 감정진단 */}
                {activeTab === 'ai' && (
                  <div className="px-4 pb-4 space-y-4 font-pretendard">
                    {/* Voice Player */}
                    <div className="bg-gradient-to-r from-[#587efc] to-[#6bfcc1] rounded-lg p-3">
                      <div className="font-pretendard flex items-center justify-between mb-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center space-x-2">
                            <MicrophoneIcon
                              width={15}
                              height={15}
                              color="white"
                            />
                            <span className="text-white text-base font-semibold">
                              보이스 재생
                            </span>
                          </div>
                          <button
                            type="button"
                            className="flex items-center mb-2"
                            onClick={toggleVoiceSelector}
                          >
                            <span className="text-white text-sm font-medium">
                              {getCurrentVoiceText()}
                            </span>
                            <div className="ml-1 flex items-center justify-center">
                              <ArrowDownIcon
                                color="white"
                                width={12}
                                height={10}
                              />
                            </div>
                          </button>
                        </div>
                        <button
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isPlaying
                              ? 'bg-white bg-opacity-20'
                              : isLoadTSS
                                ? ''
                                : 'bg-white bg-opacity-20'
                          }`}
                          onClick={toggleAIPlayBtn}
                        >
                          {isPlaying ? (
                            <PlayingIcon color="white" width={12} height={12} />
                          ) : isLoadTSS ? (
                            <LottiePlayLoadingBar />
                          ) : (
                            <PlayIcon color="white" width={12} height={12} />
                          )}
                        </button>
                      </div>

                      <div>
                        <div className="w-full bg-white bg-opacity-80 rounded-sm h-1 relative cursor-pointer">
                          <div
                            className="bg-[#1f2024] h-1 rounded-sm transition-all duration-100"
                            style={{
                              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                            }}
                          ></div>
                          {/* 재생 지점 표시 동그라미 */}
                          <div
                            className="absolute top-1/2 w-2 h-2 bg-[#1f2024] rounded-full shadow-sm"
                            style={{
                              left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 cursor-pointer"
                            onClick={e => {
                              if (audioRef.current && duration > 0) {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const clickPercent = clickX / rect.width;
                                const newTime = clickPercent * duration;

                                audioRef.current.currentTime = newTime;
                                setCurrentTime(newTime);
                              }
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-end items-center mt-2">
                          <span className="text-white text-xs font-medium opacity-90">
                            {formatTime(currentTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis Result */}
                    <div className="bg-white rounded-[10px] p-4">
                      <p className="text-[15px] font-medium text-[#1f2024] leading-6 tracking-[-0.15px] whitespace-pre-line">
                        {aiSummary}
                        {(emotionDetail as unknown as EmotionDetailResponse) &&
                          (emotionDetail as unknown as EmotionDetailResponse)
                            ?.comment}
                      </p>
                    </div>
                  </div>
                )}

                {/* 나의 기록 */}
                {activeTab === 'record' && (
                  <div className="px-4 pb-4 space-y-4 font-pretendard">
                    {/* Voice Player */}
                    <div className="bg-gradient-to-r from-[#587efc] to-[#6bfcc1] rounded-lg p-3">
                      <div className="font-pretendard flex items-center justify-between mb-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center space-x-2">
                            <MicrophoneIcon
                              width={15}
                              height={15}
                              color="white"
                            />
                            <span className="text-white text-base font-semibold">
                              보이스 재생
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={toggleVoiceSelector}
                            className={`flex items-center mb-2 ${
                              !(
                                emotionDetail as unknown as EmotionDetailResponse
                              )?.text
                                ? 'text-slate-300'
                                : 'text-white'
                            }`}
                            disabled={
                              !(
                                emotionDetail as unknown as EmotionDetailResponse
                              )?.text
                            }
                          >
                            <span className=" text-sm font-medium">
                              {getCurrentVoiceText()}
                            </span>
                            <div className="ml-1 flex items-center justify-center">
                              <ArrowDownIcon
                                color={
                                  !(
                                    emotionDetail as unknown as EmotionDetailResponse
                                  )?.text
                                    ? '#B5B8C0'
                                    : 'white'
                                }
                                width={12}
                                height={10}
                              />
                            </div>
                          </button>
                        </div>
                        <button
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            !(emotionDetail as unknown as EmotionDetailResponse)
                              ?.text
                              ? 'bg-gray-300 bg-opacity-50'
                              : isPlayingRecord
                                ? 'bg-white bg-opacity-20'
                                : isLoadTSS
                                  ? ''
                                  : 'bg-white bg-opacity-20'
                          }`}
                          disabled={
                            !(emotionDetail as unknown as EmotionDetailResponse)
                              ?.text
                          }
                          onClick={toggleMyPlayBtn}
                        >
                          {isPlayingRecord ? (
                            <PlayingIcon color="white" width={12} height={12} />
                          ) : isLoadTSS ? (
                            <LottiePlayLoadingBar />
                          ) : (
                            <PlayIcon color="white" width={12} height={12} />
                          )}
                        </button>
                      </div>

                      <div>
                        <div className="w-full bg-white bg-opacity-80 rounded-sm h-1 relative cursor-pointer">
                          <div
                            className="bg-[#1f2024] h-1 rounded-sm transition-all duration-100"
                            style={{
                              width: `${durationRecord > 0 ? (currentTimeRecord / durationRecord) * 100 : 0}%`,
                            }}
                          ></div>
                          {/* 재생 지점 표시 동그라미 */}
                          <div
                            className="absolute top-1/2 w-2 h-2 bg-[#1f2024] rounded-full shadow-sm"
                            style={{
                              left: `${durationRecord > 0 ? (currentTimeRecord / durationRecord) * 100 : 0}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 cursor-pointer"
                            onClick={e => {
                              if (
                                audioRecordRef.current &&
                                durationRecord > 0
                              ) {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const clickPercent = clickX / rect.width;
                                const newTime = clickPercent * durationRecord;

                                audioRecordRef.current.currentTime = newTime;
                                setCurrentTimeRecord(newTime);
                              }
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-end items-center mt-2">
                          <span className="text-white text-xs font-medium opacity-90">
                            {formatTime(currentTimeRecord)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Record */}
                    <div className="bg-white rounded-[10px] p-4">
                      <p className="text-[15px] font-medium text-[#1f2024] leading-6 tracking-[-0.15px] whitespace-pre-line">
                        {(emotionDetail as unknown as EmotionDetailResponse) &&
                          (emotionDetail as unknown as EmotionDetailResponse)
                            .text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 보이스 선택 바텀시트 */}
        {showVoiceSelector && (
          <div
            className="w-full sm:w-[360px] left-1/2 transform -translate-x-1/2 fixed inset-0 bg-black bg-opacity-30 flex items-end justify-center z-[51] transition-opacity duration-300 ease-out"
            onClick={toggleVoiceSelector}
          >
            <div
              className={`w-full sm:w-[360px] bg-white rounded-t-[20px] transform transition-transform duration-300 ease-out ${
                isBottomSheetVisible ? 'translate-y-0' : 'translate-y-full'
              }`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4">
                <h3 className="text-[22px] font-normal text-[#060607] tracking-[-0.22px] leading-[26.4px] text-center">
                  보이스 선택
                </h3>
              </div>

              {/* Voice Options */}
              <div className="px-6 pb-4 font-pretendard">
                <div className="space-y-3">
                  {/* 나의 목소리 [나의 기록 탭 에서만 출력] */}
                  {activeTab === 'record' ? (
                    <button
                      onClick={() => changeVoiceType('MY')}
                      className={`flex items-center space-x-3 w-full text-left ${
                        !(emotionDetail as unknown as EmotionDetailResponse)
                          ?.hasAudioFile
                          ? 'text-[#B5B8C0]'
                          : 'text-[#060607]'
                      }`}
                      disabled={
                        !(emotionDetail as unknown as EmotionDetailResponse)
                          ?.hasAudioFile
                      }
                    >
                      <div className="w-5 h-5">
                        {selectedVoice === 'MY' ? (
                          <CheckIcon width={20} height={20} color="#587efc" />
                        ) : (
                          <div
                            className={`w-5 h-5 border-2 rounded-full ${
                              !(
                                emotionDetail as unknown as EmotionDetailResponse
                              )?.hasAudioFile
                                ? 'bg-[#ECEDEF] border-[#D0D2D7]'
                                : 'border-[#d0d2d7]'
                            }`}
                          ></div>
                        )}
                      </div>
                      <span className="text-[15px] font-medium tracking-[-0.15px] leading-[24px]">
                        나의 목소리
                      </span>
                    </button>
                  ) : null}

                  {voiceTypes &&
                    (voiceTypes as unknown as VoiceType[])?.map(
                      (voice: VoiceType) => (
                        <button
                          key={voice.voiceKey}
                          onClick={() => changeVoiceType(voice.name)}
                          className="flex items-center space-x-3 w-full text-left"
                        >
                          <div className="w-5 h-5">
                            {selectedVoice === voice.name ? (
                              <CheckIcon
                                width={20}
                                height={20}
                                color="#587efc"
                              />
                            ) : (
                              <div className="w-5 h-5 border-2 border-[#d0d2d7] rounded-full"></div>
                            )}
                          </div>
                          <span className="text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-[24px]">
                            {voice.voiceName}
                          </span>
                        </button>
                      )
                    )}

                  {/* <button
                    onClick={() => setSelectedVoice('teacher')}
                    className="flex items-center space-x-3 w-full text-left"
                  >
                    <div className="w-5 h-5">
                      {selectedVoice === 'teacher' ? (
                        <CheckIcon width={20} height={20} color="#587efc" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-[#d0d2d7] rounded-full"></div>
                      )}
                    </div>
                    <span className="text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-[24px]">
                      오은영 선생님
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedVoice('ai1')}
                    className="flex items-center space-x-3 w-full text-left"
                  >
                    <div className="w-5 h-5">
                      {selectedVoice === 'ai1' ? (
                        <CheckIcon width={20} height={20} color="#587efc" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-[#d0d2d7] rounded-full"></div>
                      )}
                    </div>
                    <span className="text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-[24px]">
                      AI 보이스 1
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedVoice('ai2')}
                    className="flex items-center space-x-3 w-full text-left"
                  >
                    <div className="w-5 h-5">
                      {selectedVoice === 'ai2' ? (
                        <CheckIcon width={20} height={20} color="#587efc" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-[#d0d2d7] rounded-full"></div>
                      )}
                    </div>
                    <span className="text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-[24px]">
                      AI 보이스 2
                    </span>
                  </button>

                  <button
                    onClick={() => changeVoiceType('ai3')}
                    className="flex items-center space-x-3 w-full text-left"
                  >
                    <div className="w-5 h-5">
                      {selectedVoice === 'ai3' ? (
                        <CheckIcon width={20} height={20} color="#587efc" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-[#d0d2d7] rounded-full"></div>
                      )}
                    </div>
                    <span className="text-[15px] font-medium text-[#060607] tracking-[-0.15px] leading-[24px]">
                      AI 보이스 3
                    </span>
                  </button> */}
                </div>
              </div>

              {/* Error Message */}
              {voiceError && (
                <div className="px-6 py-2">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm mb-2">{voiceError}</p>
                    <button
                      onClick={() => {
                        setVoiceError(null);
                        // 재시도 로직 - 현재 선택된 음성으로 다시 시도
                        if (selectedVoice !== 'MY') {
                          getConvertedVoice(
                            {
                              nickname: user.name,
                              emotionId,
                              payload: {
                                isUserUploadRequst: false,
                                isRequiredUserAudio: false,
                                voiceType: selectedVoice,
                              },
                            },
                            {
                              onSuccess: data => {
                                // console.log('음성 변환 재시도 성공:', data);
                                setVoiceError(null);

                                // 재시도 성공 시에도 audioUrl로 오디오 재생
                                if (data?.data?.audioUrl) {
                                  createAndPlayAudio(data.data.audioUrl, false);
                                }
                              },
                              onError: error => {
                                console.error('음성 변환 재시도 실패:', error);
                                const errorMessage =
                                  error?.message || '음성 변환에 실패했습니다.';
                                setVoiceError(errorMessage);
                              },
                            }
                          );
                        }
                      }}
                      className="text-red-600 text-xs underline"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <div className="px-6 py-4">
                <button
                  onClick={handleConfirmVoice}
                  className="w-full py-3 bg-[#060607] text-white rounded-[30px] font-normal text-[20px] tracking-[-0.2px] leading-[24px] transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {deletedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[51]">
            <div className="bg-white rounded-xl p-6 mx-10 max-w-sm w-full">
              <h3 className="text-2xl text-black">삭제하시겠습니까?</h3>
              <p className="text-base text-gray-600 mb-6">
                게시물이 삭제됩니다.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletedId(null)}
                  className="py-1 px-6 border-[1px] border-[#060607] rounded-3xl text-[#060607] transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="py-1 px-6 bg-[#060607] text-white rounded-3xl"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

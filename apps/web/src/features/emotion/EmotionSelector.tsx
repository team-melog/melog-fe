'use client'

import { useState } from 'react'
import { EMOTIONS, INTENSITY_LEVELS, getEmotionConfig, getIntensityOpacity } from '@/entities/emotion'
import { useEmotionStore } from '@/features/store'
import type { EmotionType, IntensityLevel, EmotionSelection } from '@/entities/emotion'

interface EmotionCircleProps {
  emotion: EmotionType
  intensity: IntensityLevel
  isSelected: boolean
  onClick: () => void
}

function EmotionCircle({ emotion, intensity, isSelected, onClick }: EmotionCircleProps) {
  const config = getEmotionConfig(emotion)
  const opacity = getIntensityOpacity(intensity)
  
  return (
    <button
      onClick={onClick}
      className={`
        relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
        rounded-full transition-all duration-200 
        border-2 border-transparent
        hover:scale-110 hover:border-gray-300
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isSelected ? 'scale-110 border-gray-400 shadow-lg' : ''}
      `}
      style={{
        backgroundColor: config.color,
        opacity: opacity,
      }}
      aria-label={`${config.name} 강도 ${intensity}`}
    >
      <span className="text-lg sm:text-xl md:text-2xl" role="img" aria-hidden="true">
        {config.icon}
      </span>
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
      )}
    </button>
  )
}

interface EmotionSelectorProps {
  onSelectionChange?: (selection: EmotionSelection | null) => void
  className?: string
}

export default function EmotionSelector({ onSelectionChange, className = '' }: EmotionSelectorProps) {
  const { setCurrentEntry } = useEmotionStore()
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null)
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel | null>(null)

  const handleCircleClick = (emotion: EmotionType, intensity: IntensityLevel) => {
    const isSameSelection = selectedEmotion === emotion && selectedIntensity === intensity
    
    if (isSameSelection) {
      setSelectedEmotion(null)
      setSelectedIntensity(null)
      setCurrentEntry(null)
      onSelectionChange?.(null)
    } else {
      setSelectedEmotion(emotion)
      setSelectedIntensity(intensity)
      
      const selection: EmotionSelection = { emotion, intensity }
      setCurrentEntry(selection)
      onSelectionChange?.(selection)
    }
  }

  const isSelected = (emotion: EmotionType, intensity: IntensityLevel) => {
    return selectedEmotion === emotion && selectedIntensity === intensity
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          지금 느끼는 감정을 선택해주세요
        </h3>
        <p className="text-sm text-gray-600">
          감정과 강도를 함께 선택할 수 있습니다
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {Object.keys(EMOTIONS).map((emotionKey) => {
          const emotion = emotionKey as EmotionType
          const config = getEmotionConfig(emotion)
          
          return (
            <div key={emotion} className="flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="text-xs sm:text-sm font-medium text-gray-700 text-center mb-1">
                {config.name}
              </div>
              <div className="flex flex-col space-y-2">
                {INTENSITY_LEVELS.map((intensity) => (
                  <EmotionCircle
                    key={`${emotion}-${intensity}`}
                    emotion={emotion}
                    intensity={intensity}
                    isSelected={isSelected(emotion, intensity)}
                    onClick={() => handleCircleClick(emotion, intensity)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selectedEmotion && selectedIntensity && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-lg font-medium text-gray-800">
            선택된 감정: {getEmotionConfig(selectedEmotion).name} (강도: {selectedIntensity})
          </p>
        </div>
      )}
    </div>
  )
}
'use client';

import { useState } from 'react';
import {
  EMOTIONS,
  INTENSITY_LEVELS,
  getEmotionConfig,
  getIntensityOpacity,
  useEmotionStore,
} from '@melog/shared';
import type {
  EmotionType,
  IntensityLevel,
  EmotionSelection,
} from '@melog/shared';

interface EmotionCircleProps {
  emotion: EmotionType;
  intensity: IntensityLevel;
  isSelected: boolean;
  onClick: () => void;
}

function EmotionCircle({
  emotion,
  intensity,
  isSelected,
  onClick,
}: EmotionCircleProps) {
  const config = getEmotionConfig(emotion);
  const opacity = getIntensityOpacity(intensity);

  return (
    <button
      onClick={onClick}
      className={`
        relative w-9 h-9 
        rounded-full transition-all duration-200 
        border-2 border-transparent
        active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isSelected ? 'scale-105 border-gray-400 shadow-lg' : ''}
      `}
      style={{
        backgroundColor: config.color,
        opacity: opacity,
      }}
      aria-label={`${config.name} 강도 ${intensity}`}
    >
      <span className="text-sm" role="img" aria-hidden="true">
        {config.icon}
      </span>
      {isSelected && (
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border border-white" />
      )}
    </button>
  );
}

interface EmotionSelectorProps {
  onSelectionChange?: (selection: EmotionSelection | null) => void;
  className?: string;
}

export default function EmotionSelector({
  onSelectionChange,
  className = '',
}: EmotionSelectorProps) {
  const { setCurrentEntry } = useEmotionStore();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(
    null
  );
  const [selectedIntensity, setSelectedIntensity] =
    useState<IntensityLevel | null>(null);

  const handleCircleClick = (
    emotion: EmotionType,
    intensity: IntensityLevel
  ) => {
    const isSameSelection =
      selectedEmotion === emotion && selectedIntensity === intensity;

    if (isSameSelection) {
      setSelectedEmotion(null);
      setSelectedIntensity(null);
      setCurrentEntry(null);
      onSelectionChange?.(null);
    } else {
      setSelectedEmotion(emotion);
      setSelectedIntensity(intensity);

      const selection: EmotionSelection = { emotion, intensity };
      setCurrentEntry(selection);
      onSelectionChange?.(selection);
    }
  };

  const isSelected = (emotion: EmotionType, intensity: IntensityLevel) => {
    return selectedEmotion === emotion && selectedIntensity === intensity;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 text-center">
        <h3 className="text-base font-semibold text-gray-800 mb-2">
          감정을 선택해주세요
        </h3>
        <p className="text-xs text-gray-600">
          각 감정별로 5단계 강도를 선택할 수 있어요
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {Object.keys(EMOTIONS).map(emotionKey => {
          const emotion = emotionKey as EmotionType;
          const config = getEmotionConfig(emotion);

          return (
            <div key={emotion} className="flex flex-col items-center space-y-1">
              <div className="text-xs font-medium text-gray-700 text-center mb-1">
                {config.name}
              </div>
              <div className="flex flex-col space-y-1">
                {INTENSITY_LEVELS.map(intensity => (
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
          );
        })}
      </div>

      {selectedEmotion && selectedIntensity && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm font-medium text-gray-800">
            {getEmotionConfig(selectedEmotion).icon}{' '}
            {getEmotionConfig(selectedEmotion).name} (강도: {selectedIntensity})
          </p>
        </div>
      )}
    </div>
  );
}

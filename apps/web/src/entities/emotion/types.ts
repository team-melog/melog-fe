export const EMOTIONS = {
  joy: {
    name: '기쁨',
    color: '#FFD700',
    icon: '😊',
    darkColor: '#FFA500',
  },
  sadness: {
    name: '슬픔',
    color: '#4169E1',
    icon: '😢',
    darkColor: '#1E90FF',
  },
  anger: {
    name: '분노',
    color: '#DC143C',
    icon: '😠',
    darkColor: '#FF6347',
  },
  fear: {
    name: '두려움',
    color: '#8A2BE2',
    icon: '😨',
    darkColor: '#9370DB',
  },
  surprise: {
    name: '놀람',
    color: '#FF69B4',
    icon: '😲',
    darkColor: '#FF1493',
  },
  disgust: {
    name: '혐오',
    color: '#32CD32',
    icon: '🤢',
    darkColor: '#228B22',
  },
} as const;

export type EmotionType = keyof typeof EMOTIONS;

export const INTENSITY_LEVELS = [1, 2, 3, 4, 5] as const;
export type IntensityLevel = (typeof INTENSITY_LEVELS)[number];

// 감정과 강도에 따른 아이콘 ID 매핑
export const emotionIconsByStep = {
  기쁨: ['Yellow1', 'Yellow2', 'Yellow3', 'Yellow4', 'Yellow5'],
  설렘: ['Pink1', 'Pink2', 'Pink3', 'Pink4', 'Pink5'],
  평온: ['Green1', 'Green2', 'Green3', 'Green4', 'Green5'],
  분노: ['Red1', 'Red2', 'Red3', 'Red4', 'Red5'],
  슬픔: ['Blue1', 'Blue2', 'Blue3', 'Blue4', 'Blue5'],
  지침: ['Grey1', 'Grey2', 'Grey3', 'Grey4', 'Grey5'],
} as const;

export interface EmotionSelection {
  emotion: EmotionType;
  intensity: IntensityLevel;
}

export interface EmotionConfig {
  name: string;
  color: string;
  icon: string;
  darkColor: string;
}

export const getEmotionConfig = (emotion: EmotionType): EmotionConfig => {
  return EMOTIONS[emotion];
};

export const getIntensityOpacity = (intensity: IntensityLevel): number => {
  return 0.2 + (intensity - 1) * 0.2;
};

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
};
export const INTENSITY_LEVELS = [1, 2, 3, 4, 5];
export const getEmotionConfig = (emotion) => {
    return EMOTIONS[emotion];
};
export const getIntensityOpacity = (intensity) => {
    return 0.2 + (intensity - 1) * 0.2;
};

export declare const EMOTIONS: {
    readonly joy: {
        readonly name: "기쁨";
        readonly color: "#FFD700";
        readonly icon: "😊";
        readonly darkColor: "#FFA500";
    };
    readonly sadness: {
        readonly name: "슬픔";
        readonly color: "#4169E1";
        readonly icon: "😢";
        readonly darkColor: "#1E90FF";
    };
    readonly anger: {
        readonly name: "분노";
        readonly color: "#DC143C";
        readonly icon: "😠";
        readonly darkColor: "#FF6347";
    };
    readonly fear: {
        readonly name: "두려움";
        readonly color: "#8A2BE2";
        readonly icon: "😨";
        readonly darkColor: "#9370DB";
    };
    readonly surprise: {
        readonly name: "놀람";
        readonly color: "#FF69B4";
        readonly icon: "😲";
        readonly darkColor: "#FF1493";
    };
    readonly disgust: {
        readonly name: "혐오";
        readonly color: "#32CD32";
        readonly icon: "🤢";
        readonly darkColor: "#228B22";
    };
};
export type EmotionType = keyof typeof EMOTIONS;
export declare const INTENSITY_LEVELS: readonly [1, 2, 3, 4, 5];
export type IntensityLevel = typeof INTENSITY_LEVELS[number];
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
export declare const getEmotionConfig: (emotion: EmotionType) => EmotionConfig;
export declare const getIntensityOpacity: (intensity: IntensityLevel) => number;

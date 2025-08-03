'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { EMOTIONS, INTENSITY_LEVELS, getEmotionConfig, getIntensityOpacity, useEmotionStore } from '@melog/shared';
function EmotionCircle({ emotion, intensity, isSelected, onClick }) {
    const config = getEmotionConfig(emotion);
    const opacity = getIntensityOpacity(intensity);
    return (_jsxs("button", { onClick: onClick, className: `
        relative w-9 h-9 
        rounded-full transition-all duration-200 
        border-2 border-transparent
        active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isSelected ? 'scale-105 border-gray-400 shadow-lg' : ''}
      `, style: {
            backgroundColor: config.color,
            opacity: opacity,
        }, "aria-label": `${config.name} 강도 ${intensity}`, children: [_jsx("span", { className: "text-sm", role: "img", "aria-hidden": "true", children: config.icon }), isSelected && (_jsx("div", { className: "absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border border-white" }))] }));
}
export default function EmotionSelector({ onSelectionChange, className = '' }) {
    const { setCurrentEntry } = useEmotionStore();
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [selectedIntensity, setSelectedIntensity] = useState(null);
    const handleCircleClick = (emotion, intensity) => {
        const isSameSelection = selectedEmotion === emotion && selectedIntensity === intensity;
        if (isSameSelection) {
            setSelectedEmotion(null);
            setSelectedIntensity(null);
            setCurrentEntry(null);
            onSelectionChange?.(null);
        }
        else {
            setSelectedEmotion(emotion);
            setSelectedIntensity(intensity);
            const selection = { emotion, intensity };
            setCurrentEntry(selection);
            onSelectionChange?.(selection);
        }
    };
    const isSelected = (emotion, intensity) => {
        return selectedEmotion === emotion && selectedIntensity === intensity;
    };
    return (_jsxs("div", { className: `w-full ${className}`, children: [_jsxs("div", { className: "mb-4 text-center", children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-2", children: "\uAC10\uC815\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694" }), _jsx("p", { className: "text-xs text-gray-600", children: "\uAC01 \uAC10\uC815\uBCC4\uB85C 5\uB2E8\uACC4 \uAC15\uB3C4\uB97C \uC120\uD0DD\uD560 \uC218 \uC788\uC5B4\uC694" })] }), _jsx("div", { className: "grid grid-cols-6 gap-2", children: Object.keys(EMOTIONS).map((emotionKey) => {
                    const emotion = emotionKey;
                    const config = getEmotionConfig(emotion);
                    return (_jsxs("div", { className: "flex flex-col items-center space-y-1", children: [_jsx("div", { className: "text-xs font-medium text-gray-700 text-center mb-1", children: config.name }), _jsx("div", { className: "flex flex-col space-y-1", children: INTENSITY_LEVELS.map((intensity) => (_jsx(EmotionCircle, { emotion: emotion, intensity: intensity, isSelected: isSelected(emotion, intensity), onClick: () => handleCircleClick(emotion, intensity) }, `${emotion}-${intensity}`))) })] }, emotion));
                }) }), selectedEmotion && selectedIntensity && (_jsx("div", { className: "mt-4 p-3 bg-blue-50 rounded-lg text-center", children: _jsxs("p", { className: "text-sm font-medium text-gray-800", children: [getEmotionConfig(selectedEmotion).icon, " ", getEmotionConfig(selectedEmotion).name, " (\uAC15\uB3C4: ", selectedIntensity, ")"] }) }))] }));
}

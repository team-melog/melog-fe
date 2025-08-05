'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Button from './Button';
export default function AIAnalysisResult({ analysis, isLoading = false, onRetry, className = '', }) {
    const [isExpanded, setIsExpanded] = useState(true);
    // 감정 점수에 따른 색상과 상태 텍스트
    const getScoreStyle = (score) => {
        if (score >= 80)
            return {
                color: 'text-green-700',
                bg: 'bg-green-50',
                border: 'border-green-200',
                emoji: '😊',
                label: '매우 긍정적',
            };
        if (score >= 60)
            return {
                color: 'text-blue-700',
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                emoji: '🙂',
                label: '긍정적',
            };
        if (score >= 40)
            return {
                color: 'text-yellow-700',
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                emoji: '😐',
                label: '보통',
            };
        if (score >= 20)
            return {
                color: 'text-orange-700',
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                emoji: '😔',
                label: '부정적',
            };
        return {
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
            emoji: '😢',
            label: '매우 부정적',
        };
    };
    const scoreStyle = getScoreStyle(analysis.emotionScore);
    if (isLoading) {
        return (_jsx("div", { className: `bg-purple-50 border border-purple-200 rounded-xl p-4 ${className}`, children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-purple-800", children: "AI \uAC10\uC815 \uBD84\uC11D \uC911..." }), _jsx("p", { className: "text-xs text-purple-600", children: "\uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694" })] })] }) }));
    }
    return (_jsxs("div", { className: `bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl overflow-hidden ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-purple-200 bg-white/50", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-lg", children: "\uD83E\uDD16" }), _jsx("h3", { className: "text-sm font-semibold text-purple-800", children: "AI \uAC10\uC815 \uBD84\uC11D" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [onRetry && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onRetry, className: "text-purple-600 hover:text-purple-700", children: "\uD83D\uDD04 \uC7AC\uBD84\uC11D" })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsExpanded(!isExpanded), className: "text-purple-600 hover:text-purple-700", children: isExpanded ? '▼' : '▶' })] })] }), isExpanded && (_jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: `${scoreStyle.bg} ${scoreStyle.border} border rounded-lg p-3`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-xs font-medium text-gray-600", children: "\uAC10\uC815 \uC6F0\uBE59 \uC810\uC218" }), _jsxs("span", { className: `text-xs font-medium ${scoreStyle.color}`, children: [scoreStyle.emoji, " ", scoreStyle.label] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mb-2", children: _jsx("div", { className: `h-2 rounded-full transition-all duration-500 ${analysis.emotionScore >= 60
                                        ? 'bg-green-500'
                                        : analysis.emotionScore >= 40
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'}`, style: { width: `${analysis.emotionScore}%` } }) }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: `text-lg font-bold ${scoreStyle.color}`, children: [analysis.emotionScore, "/100"] }), _jsx("span", { className: "text-xs text-gray-500", children: "0 \uC6B0\uC6B8 \u2190\u2192 100 \uD589\uBCF5" })] })] }), _jsxs("div", { className: "bg-white rounded-lg p-3 border border-purple-100", children: [_jsx("h4", { className: "text-xs font-medium text-purple-700 mb-2 flex items-center", children: "\uD83D\uDCAD \uAC10\uC815 \uBD84\uC11D \uC694\uC57D" }), _jsx("p", { className: "text-sm text-gray-700 leading-relaxed", children: analysis.summary })] }), analysis.suggestions.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg p-3 border border-purple-100", children: [_jsx("h4", { className: "text-xs font-medium text-purple-700 mb-3 flex items-center", children: "\uD83D\uDCA1 \uCD94\uCC9C \uD65C\uB3D9" }), _jsx("div", { className: "space-y-2", children: analysis.suggestions.map((suggestion, index) => (_jsxs("div", { className: "flex items-start space-x-2 p-2 bg-purple-25 rounded-lg", children: [_jsxs("span", { className: "text-xs text-purple-600 font-medium min-w-4", children: [index + 1, "."] }), _jsx("span", { className: "text-xs text-gray-700 leading-relaxed", children: suggestion })] }, index))) })] })), _jsx("div", { className: "bg-purple-25 rounded-lg p-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-purple-600", children: "\uD83D\uDD2E AI \uBD84\uC11D \uC644\uB8CC" }), _jsx("span", { className: "text-xs text-purple-500", children: new Date().toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }) })] }) })] }))] }));
}

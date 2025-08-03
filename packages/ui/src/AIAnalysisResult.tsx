'use client'

import { useState } from 'react'
import Button from './Button'

interface AIAnalysisData {
  summary: string
  suggestions: string[]
  emotionScore: number
}

interface AIAnalysisResultProps {
  analysis: AIAnalysisData
  isLoading?: boolean
  onRetry?: () => void
  className?: string
}

export default function AIAnalysisResult({
  analysis,
  isLoading = false,
  onRetry,
  className = '',
}: AIAnalysisResultProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // 감정 점수에 따른 색상과 상태 텍스트
  const getScoreStyle = (score: number) => {
    if (score >= 80) return { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', emoji: '😊', label: '매우 긍정적' }
    if (score >= 60) return { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', emoji: '🙂', label: '긍정적' }
    if (score >= 40) return { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '😐', label: '보통' }
    if (score >= 20) return { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '😔', label: '부정적' }
    return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', emoji: '😢', label: '매우 부정적' }
  }

  const scoreStyle = getScoreStyle(analysis.emotionScore)

  if (isLoading) {
    return (
      <div className={`bg-purple-50 border border-purple-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <div>
            <h3 className="text-sm font-semibold text-purple-800">AI 감정 분석 중...</h3>
            <p className="text-xs text-purple-600">잠시만 기다려주세요</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-white/50">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🤖</span>
          <h3 className="text-sm font-semibold text-purple-800">AI 감정 분석</h3>
        </div>
        <div className="flex items-center space-x-2">
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="text-purple-600 hover:text-purple-700"
            >
              🔄 재분석
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 hover:text-purple-700"
          >
            {isExpanded ? '▼' : '▶'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 감정 점수 */}
          <div className={`${scoreStyle.bg} ${scoreStyle.border} border rounded-lg p-3`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">감정 웰빙 점수</span>
              <span className={`text-xs font-medium ${scoreStyle.color}`}>
                {scoreStyle.emoji} {scoreStyle.label}
              </span>
            </div>
            
            {/* 점수 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis.emotionScore >= 60 ? 'bg-green-500' :
                  analysis.emotionScore >= 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${analysis.emotionScore}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-lg font-bold ${scoreStyle.color}`}>
                {analysis.emotionScore}/100
              </span>
              <span className="text-xs text-gray-500">
                0 우울 ←→ 100 행복
              </span>
            </div>
          </div>

          {/* 분석 요약 */}
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <h4 className="text-xs font-medium text-purple-700 mb-2 flex items-center">
              💭 감정 분석 요약
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* 추천 사항 */}
          {analysis.suggestions.length > 0 && (
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <h4 className="text-xs font-medium text-purple-700 mb-3 flex items-center">
                💡 추천 활동
              </h4>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-2 bg-purple-25 rounded-lg"
                  >
                    <span className="text-xs text-purple-600 font-medium min-w-4">
                      {index + 1}.
                    </span>
                    <span className="text-xs text-gray-700 leading-relaxed">
                      {suggestion}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 분석 정보 */}
          <div className="bg-purple-25 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-600">
                🔮 AI 분석 완료
              </span>
              <span className="text-xs text-purple-500">
                {new Date().toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { Layout } from '@melog/ui'

export default function FeedPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📊 감정 피드
          </h1>
          <p className="text-sm text-gray-600">
            모든 사용자들의 감정 기록을 확인해보세요
          </p>
        </header>

        <main className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">전체 피드</h2>
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🚧</div>
              <p className="text-sm text-gray-500">피드 기능을 준비 중입니다</p>
              <p className="text-xs text-gray-400 mt-1">곧 만나보실 수 있어요!</p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}
import { ReactNode } from 'react'
import { useAppStore } from '@/features/store'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export default function Layout({ children, className = '' }: LayoutProps) {
  const { theme } = useAppStore()

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
// components/PageLoader.js
import React, { useEffect, useState } from 'react'
import CircularProgress from './CircularProgress'

export default function PageLoader () {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let interval
    if (!isComplete) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 16) // ~60fps smooth progress (100 * 16ms = ~1.6s)
    }

    return () => clearInterval(interval)
  }, [isComplete])

  // Simulate page render finishing
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setProgress(100), 100)
      return () => clearTimeout(timer)
    }
  }, [isComplete])

  useEffect(() => {
    const handleLoad = () => setIsComplete(true)
    window.addEventListener('load', handleLoad)

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-4'>
        <CircularProgress
          value={progress}
          size={120}
          strokeWidth={6}
          circleStrokeWidth={6}
          progressStrokeWidth={10}
          showLabel
          labelClassName='text-xl font-bold text-primary'
          renderLabel={value => `${Math.min(value, 100)}%`}
        />
        {/* <span className='text-sm text-muted-foreground'>Loading...</span> */}
      </div>
    </div>
  )
}

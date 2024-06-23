import { useState, useRef } from 'react'

export const useDraggableBackground = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: '50%', y: '50%' })
  const startPosition = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    startPosition.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = `calc(50% + ${e.clientX - startPosition.current.x}px)`
      const newY = `calc(50% + ${e.clientY - startPosition.current.y}px)`
      setBackgroundPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return {
    backgroundPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}

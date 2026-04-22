import React from 'react'
import './card.css'

interface CardProps {
  children: React.ReactNode
  variant?: 'low' | 'base' | 'high' | 'highest' | 'glass'
  padding?: boolean
  className?: string
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'base',
  padding = true,
  className = '',
  style
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'low':
        return 'surface-low'
      case 'high':
        return 'surface-high'
      case 'highest':
        return 'surface-highest'
      case 'glass':
        return 'glass ds-card-floating'
      default:
        return 'surface-base'
    }
  }

  return (
    <div
      className={`ds-card ${getVariantClass()} ${padding ? 'ds-card-padding' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

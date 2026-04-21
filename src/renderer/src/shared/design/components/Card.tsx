import React from 'react'

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
      <style>{`
        .ds-card {
          border-radius: var(--ds-radius-lg);
          transition: background-color 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .ds-card-padding {
          padding: var(--ds-spacing-6);
        }

        .ds-card-floating {
          box-shadow: var(--ds-shadow-ambient);
          border: 1px solid rgba(255, 255, 255, 0.05); /* Ghost border fallback */
        }
      `}</style>
      {children}
    </div>
  )
}

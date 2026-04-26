import React from 'react'
import './style.css'

interface TextProps {
  children: React.ReactNode
  variant?: 'display' | 'headline' | 'title' | 'body' | 'label'
  color?: 'primary' | 'secondary' | 'tertiary' | 'dim' | 'on-surface'
  className?: string
  style?: React.CSSProperties
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'on-surface',
  className = '',
  style
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'display':
        return 'ds-text-display'
      case 'headline':
        return 'ds-text-headline'
      case 'title':
        return 'ds-text-title'
      case 'label':
        return 'ds-text-label'
      default:
        return 'ds-text-body'
    }
  }

  const getColorStyle = () => {
    switch (color) {
      case 'primary':
        return 'var(--ds-color-primary)'
      case 'secondary':
        return 'var(--ds-color-secondary)'
      case 'tertiary':
        return 'var(--ds-color-tertiary)'
      case 'dim':
        return 'var(--ds-color-on-surface-variant)'
      default:
        return 'var(--ds-color-on-surface)'
    }
  }

  return (
    <span
      className={`${getVariantClass()} ${className}`}
      style={{ color: getColorStyle(), ...style }}
    >
      {children}
    </span>
  )
}

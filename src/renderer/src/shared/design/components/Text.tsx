import React from 'react'

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
      <style>{`
        .ds-text-display { font-family: var(--ds-font-headline); font-size: var(--ds-font-size-display-lg); font-weight: 700; line-height: 1.1; }
        .ds-text-headline { font-family: var(--ds-font-headline); font-size: var(--ds-font-size-headline-sm); font-weight: 500; }
        .ds-text-title { font-family: var(--ds-font-body); font-size: var(--ds-font-size-title-md); font-weight: 600; }
        .ds-text-body { font-family: var(--ds-font-body); font-size: var(--ds-font-size-body-md); font-weight: 400; line-height: 1.5; }
        .ds-text-label { font-family: var(--ds-font-body); font-size: var(--ds-font-size-label-sm); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>
      {children}
    </span>
  )
}

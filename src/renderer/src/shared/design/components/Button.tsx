import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <button className={`ds-button ds-button-${variant} ds-button-${size} ${className}`} {...props}>
      <style>{`
        .ds-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          font-family: var(--ds-font-body);
          font-weight: 600;
          border-radius: var(--ds-radius-md);
          user-select: none;
        }

        .ds-button:active {
          transform: scale(0.98);
        }

        .ds-button-primary {
          background: linear-gradient(135deg, var(--ds-color-primary), var(--ds-color-primary-container));
          color: var(--ds-color-on-primary);
        }

        .ds-button-primary:hover {
          box-shadow: 0 0 20px rgba(184, 159, 255, 0.4);
        }

        .ds-button-secondary {
          background-color: var(--ds-color-surface-container-high);
          color: var(--ds-color-on-surface);
        }

        .ds-button-secondary:hover {
          background-color: var(--ds-color-surface-container-highest);
        }

        .ds-button-ghost {
          background: transparent;
          color: var(--ds-color-on-surface-variant);
        }

        .ds-button-ghost:hover {
          color: var(--ds-color-on-surface);
          background-color: rgba(255, 255, 255, 0.05);
        }

        .ds-button-sm { padding: 0.5rem 1rem; font-size: 0.75rem; }
        .ds-button-md { padding: 0.75rem 1.5rem; font-size: 0.875rem; }
        .ds-button-lg { padding: 1rem 2rem; font-size: 1rem; }
        
        .ds-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }
      `}</style>
      {children}
    </button>
  )
}

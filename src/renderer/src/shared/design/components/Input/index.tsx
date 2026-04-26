import React from 'react'
import './style.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`ds-input-container ${className}`}>
      {label && <label className="ds-input-label">{label}</label>}
      <div className="ds-input-wrapper">
        <input className={`ds-input ${error ? 'ds-input-error' : ''}`} {...props} />
        <div className="ds-input-focus-bar" />
      </div>
      {error && <span className="ds-input-error-text">{error}</span>}
    </div>
  )
}

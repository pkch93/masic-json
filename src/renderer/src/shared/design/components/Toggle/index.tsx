import React from 'react'
import './style.css'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  row?: boolean
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, row }) => {
  return (
    <label className={`ds-toggle ${row ? 'ds-toggle--row' : ''}`}>
      {label && <span className="ds-toggle__label">{label}</span>}
      <div
        className={`ds-toggle__track ${checked ? 'ds-toggle__track--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <div className="ds-toggle__thumb" />
      </div>
    </label>
  )
}

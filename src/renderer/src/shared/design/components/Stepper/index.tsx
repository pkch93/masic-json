import React from 'react'
import './stepper.css'

interface StepperProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  min = 1,
  max = 8,
  step = 1,
  onChange
}) => {
  return (
    <div className="ds-stepper">
      <button
        className="ds-stepper__btn"
        onClick={() => onChange(value - step)}
        disabled={value - step < min}
      >
        −
      </button>
      <span className="ds-stepper__value">{value}</span>
      <button
        className="ds-stepper__btn"
        onClick={() => onChange(value + step)}
        disabled={value + step > max}
      >
        +
      </button>
    </div>
  )
}

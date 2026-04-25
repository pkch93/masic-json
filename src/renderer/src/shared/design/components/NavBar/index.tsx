import React from 'react'
import './navbar.css'

export interface NavTab {
  id: string
  label: string
}

interface NavBarProps {
  title?: string
  tabs?: NavTab[]
  activeTab?: string
  onTabChange?: (id: string) => void
  darkMode?: boolean
  onToggleDarkMode?: () => void
}

export const NavBar: React.FC<NavBarProps> = ({
  tabs = [],
  activeTab,
  onTabChange,
  darkMode = true,
  onToggleDarkMode
}) => {
  return (
    <nav className="ds-navbar">
      <div className="ds-navbar__title">
        <span className="ds-navbar__logo">{'{ }'}</span>
      </div>
      <div className="ds-navbar__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`ds-navbar__tab ${activeTab === tab.id ? 'ds-navbar__tab--active' : ''}`}
            onClick={() => onTabChange?.(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ds-navbar__actions">
        <button
          className="ds-navbar__theme-btn"
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀' : '☾'}
        </button>
      </div>
    </nav>
  )
}

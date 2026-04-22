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
}

export const NavBar: React.FC<NavBarProps> = ({
  title = 'magic-json',
  tabs = [],
  activeTab,
  onTabChange
}) => {
  return (
    <nav className="ds-navbar">
      <span className="ds-navbar__title">{title}</span>
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
    </nav>
  )
}

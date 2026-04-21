import { NavLink, useLocation } from 'react-router-dom'
import { BookOpen, MessageCircle, ShieldAlert, Clock, Zap } from 'lucide-react'
import { useNetwork } from '../hooks/useNetwork'
import './Sidebar.css'

const navItems = [
  { to: '/', icon: BookOpen, label: 'Home' },
  { to: '/chat', icon: MessageCircle, label: 'Ask AI' },
  { to: '/deepfake', icon: ShieldAlert, label: 'Deepfake Check' },
  { to: '/history', icon: Clock, label: 'History' },
]

export default function Sidebar() {
  const isOnline = useNetwork()
  const location = useLocation()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Zap size={20} />
          </div>
          <div>
            <div className="logo-title">EduAI</div>
            <div className="logo-sub">Smart Learning</div>
          </div>
        </div>

        <div className="network-badge" data-online={isOnline}>
          <span className="network-dot" />
          {isOnline ? 'Online — AI Active' : 'Offline — Local Mode'}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              end={to === '/'}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-text">Class 5 — 12 Coverage</div>
          <div className="footer-sub">Math · Science · English · SST</div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'active' : ''}`
            }
            end={to === '/'}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

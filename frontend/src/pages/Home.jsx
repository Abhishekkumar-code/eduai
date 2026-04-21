import { useNavigate } from 'react-router-dom'
import { MessageCircle, ShieldAlert, Wifi, WifiOff, BookOpen, ArrowRight } from 'lucide-react'
import { useNetwork } from '../hooks/useNetwork'
import './Home.css'

const features = [
  {
    icon: Wifi,
    title: 'Online AI Mode',
    desc: 'Powered by Gemini 2.5 Flash. Ask anything — get detailed, class-appropriate answers instantly.',
    color: '#7c6af7',
    tag: 'Internet Required',
  },
  {
    icon: WifiOff,
    title: 'Offline Mode',
    desc: 'No internet? No problem. Local JSON database covers Class 5–12 Math, Science, English & SST.',
    color: '#6af7c4',
    tag: 'Works Offline',
  },
  {
    icon: ShieldAlert,
    title: 'Deepfake Detector',
    desc: 'Upload any image and instantly know if it\'s AI-generated or a real photograph.',
    color: '#f76a6a',
    tag: 'AI Powered',
  },
]

const subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry', 'Biology', 'History']

export default function Home() {
  const isOnline = useNetwork()
  const navigate = useNavigate()

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
          {isOnline ? 'AI Online — Gemini Active' : 'Offline Mode Active'}
        </div>
        <h1 className="hero-title">
          Learn Smarter<br />
          <span className="hero-accent">With or Without</span><br />
          Internet
        </h1>
        <p className="hero-desc">
          Your AI-powered study companion for Class 5–12. Ask questions, get instant answers,
          and detect fake images — all in one place.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/chat')}>
            <MessageCircle size={18} />
            Start Learning
            <ArrowRight size={16} />
          </button>
          <button className="btn-secondary" onClick={() => navigate('/deepfake')}>
            <ShieldAlert size={18} />
            Check Image
          </button>
        </div>

        {/* Floating orbs */}
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-label">What We Offer</div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon" style={{ background: f.color + '18', color: f.color }}>
                <f.icon size={22} />
              </div>
              <span className="feature-tag" style={{ color: f.color }}>{f.tag}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section className="subjects">
        <div className="section-label">Subjects Covered</div>
        <div className="subjects-grid">
          {subjects.map((s, i) => (
            <div className="subject-chip" key={i} onClick={() => navigate('/chat')}>
              <BookOpen size={14} />
              {s}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

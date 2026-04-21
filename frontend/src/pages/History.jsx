import { useState, useEffect } from 'react'
import { Clock, MessageCircle, ShieldAlert, Wifi, WifiOff, Loader, RefreshCw } from 'lucide-react'
import { getChatHistory, getDeepfakeHistory } from '../api'
import './History.css'

export default function History() {
  const [tab, setTab] = useState('chat')
  const [chatHistory, setChatHistory] = useState([])
  const [deepfakeHistory, setDeepfakeHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const [chat, deepfake] = await Promise.all([
        getChatHistory(),
        getDeepfakeHistory(),
      ])
      setChatHistory(chat.data.history || [])
      setDeepfakeHistory(deepfake.data.history || [])
    } catch (err) {
      console.error('History fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="history-page">
      <div className="page-header">
        <div className="page-icon" style={{ color: 'var(--accent2)' }}>
          <Clock size={24} />
        </div>
        <div>
          <h1 className="page-title">History</h1>
          <p className="page-subtitle">Your past questions and deepfake checks</p>
        </div>
        <button className="refresh-btn" onClick={fetchHistory} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="history-tabs">
        <button
          className={`tab-btn ${tab === 'chat' ? 'active' : ''}`}
          onClick={() => setTab('chat')}
        >
          <MessageCircle size={15} />
          Chat History
          <span className="tab-count">{chatHistory.length}</span>
        </button>
        <button
          className={`tab-btn ${tab === 'deepfake' ? 'active' : ''}`}
          onClick={() => setTab('deepfake')}
        >
          <ShieldAlert size={15} />
          Deepfake Checks
          <span className="tab-count">{deepfakeHistory.length}</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-state">
          <Loader size={24} className="spin" />
          <span>Loading history...</span>
        </div>
      ) : (
        <>
          {tab === 'chat' && (
            <div className="history-list">
              {chatHistory.length === 0 ? (
                <div className="empty-state">
                  <MessageCircle size={40} />
                  <div>No chat history yet</div>
                  <p>Ask a question to get started!</p>
                </div>
              ) : (
                chatHistory.map((item, i) => (
                  <div key={i} className="history-card animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="history-card-header">
                      <div className={`source-badge ${item.source}`}>
                        {item.source === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {item.source}
                      </div>
                      <div className="history-meta">
                        <span className="class-badge">Class {item.class}</span>
                        <span className="history-date">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    <div className="history-question">
                      <span className="q-label">Q</span>
                      {item.question}
                    </div>
                    <div className="history-answer">
                      <span className="a-label">A</span>
                      <div className="answer-text">{item.answer?.slice(0, 300)}{item.answer?.length > 300 ? '...' : ''}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'deepfake' && (
            <div className="history-list">
              {deepfakeHistory.length === 0 ? (
                <div className="empty-state">
                  <ShieldAlert size={40} />
                  <div>No deepfake checks yet</div>
                  <p>Upload an image to check it!</p>
                </div>
              ) : (
                deepfakeHistory.map((item, i) => (
                  <div key={i} className={`history-card deepfake-card animate-fade ${item.isAIGenerated ? 'fake' : 'real'}`} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="history-card-header">
                      <div className={`verdict-badge ${item.isAIGenerated ? 'fake' : 'real'}`}>
                        {item.isAIGenerated ? '⚠️ AI Generated' : '✅ Real Image'}
                      </div>
                      <span className="history-date">{formatDate(item.createdAt)}</span>
                    </div>
                    <div className="deepfake-info">
                      <div className="df-row">
                        <span>File</span>
                        <span>{item.imageName}</span>
                      </div>
                      <div className="df-row">
                        <span>AI Score</span>
                        <span className={item.isAIGenerated ? 'text-danger' : 'text-success'}>
                          {(item.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

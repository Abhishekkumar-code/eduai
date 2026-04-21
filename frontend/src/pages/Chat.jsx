import { useState, useRef, useEffect } from 'react'
import { Send, Wifi, WifiOff, Bot, User, Loader, BookOpen, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import { askOnline, askOffline } from '../api'
import { useNetwork } from '../hooks/useNetwork'
import './Chat.css'

const CLASSES = [5, 6, 7, 8, 9, 10, 11, 12]

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 👋 I am your EduAI assistant. Ask me any question from Class 5–12. I\'ll answer in simple language!\n\nSelect your class and ask away!',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [classNumber, setClassNumber] = useState(5) 
  const [mode, setMode] = useState('auto')
  const isOnline = useNetwork()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getOfflineAnswer = async (question, classNum) => {
    const fallback = await askOffline(question, classNum)
    const d = fallback.data

  
    const content = d.answer
      ? d.answer
      : d.message || 'No matching answer found. Please connect to internet for AI answer.'

    return {
      content,
      source: 'offline',
      topic: d.topic || '',
      subject: d.subject || '',
      success: d.success,
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setLoading(true)

    try {
      const useOnline = mode === 'auto' ? isOnline : mode === 'online'

     
      if (!useOnline) {
        const result = await getOfflineAnswer(question, classNumber)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.content,
          source: result.source,
          topic: result.topic,
          subject: result.subject,
        }])
        return
      }

      // ─── ONLINE MODE ────────────────────────────────────────
      try {
        const response = await askOnline(question, classNumber)
        const data = response.data
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.answer || data.message || 'No answer received.',
          source: data.source || 'online',
          topic: data.topic || '',
          subject: data.subject || '',
        }])
      } catch (onlineErr) {
        // ✅ Online failed → try offline fallback
        console.warn('Online failed, trying offline...', onlineErr.message)
        toast('Gemini unavailable, using Offline DB', { icon: '📦' })

        try {
          const result = await getOfflineAnswer(question, classNumber)
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: result.content,
            source: 'offline',
            topic: result.topic,
            subject: result.subject,
          }])
        } catch (offlineErr) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Both online and offline failed. Please check your connection and try again.',
            source: 'error',
          }])
          toast.error('Could not get answer')
        }
      }

    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const effectiveMode = mode === 'auto' ? (isOnline ? 'online' : 'offline') : mode

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-title-wrap">
            <BookOpen size={20} />
            <div>
              <div className="chat-title">Ask EduAI</div>
              <div className="chat-subtitle">Class {classNumber} · {effectiveMode === 'online' ? 'Gemini AI' : 'Offline DB'}</div>
            </div>
          </div>
        </div>

        <div className="chat-controls">
          {/* Class Selector ke liye */}
          <div className="select-wrap">
            <select
              value={classNumber}
              onChange={e => setClassNumber(Number(e.target.value))}
              className="class-select"
            >
              {CLASSES.map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            {['auto', 'online', 'offline'].map(m => (
              <button
                key={m}
                className={`mode-btn ${mode === m ? 'active' : ''}`}
                onClick={() => setMode(m)}
              >
                {m === 'auto' && '⚡'}
                {m === 'online' && <Wifi size={13} />}
                {m === 'offline' && <WifiOff size={13} />}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role} animate-fade`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="message-avatar">
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="message-body">
              {msg.source && (
                <div className={`message-source ${msg.source}`}>
                  {msg.source === 'online' && '🌐 Gemini AI'}
                  {msg.source === 'offline' && '📦 Offline DB'}
                  {msg.source === 'error' && '❌ Error'}
                  {msg.topic && ` · ${msg.topic}`}
                  {msg.subject && ` · ${msg.subject}`}
                </div>
              )}
              <div className="message-content">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message assistant animate-fade">
            <div className="message-avatar"><Bot size={16} /></div>
            <div className="message-body">
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask a Class ${classNumber} question...`}
            rows={1}
            className="chat-input"
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? <Loader size={18} className="spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  )
}
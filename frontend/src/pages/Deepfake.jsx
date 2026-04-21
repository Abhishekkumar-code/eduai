import { useState, useRef } from 'react'
import { Upload, ShieldAlert, ShieldCheck, Loader, Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { checkDeepfake } from '../api'
import './Deepfake.css'

export default function Deepfake() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      toast.error('Only image files allowed!')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB!')
      return
    }
    setFile(f)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleCheck = async () => {
    if (!file || loading) return
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      const response = await checkDeepfake(formData)
      setResult(response.data)
      toast.success('Analysis complete!')
    } catch (err) {
      toast.error('Check failed. Try again!')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  const confidenceNum = result ? parseFloat(result.confidence) : 0

  return (
    <div className="deepfake-page">
      <div className="page-header">
        <div className="page-icon" style={{ color: 'var(--danger)' }}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="page-title">Deepfake Detector</h1>
          <p className="page-subtitle">Upload an image to check if it's AI-generated or real</p>
        </div>
      </div>

      <div className="deepfake-layout">
        {/* Upload Zone */}
        <div className="upload-section">
          {!preview ? (
            <div
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="drop-icon">
                <Image size={32} />
              </div>
              <div className="drop-title">Drop image here</div>
              <div className="drop-sub">or click to browse · JPG, PNG, WEBP · Max 5MB</div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="preview-wrap">
              <img src={preview} alt="Preview" className="preview-img" />
              <button className="remove-btn" onClick={reset}>
                <X size={16} />
              </button>
              <div className="preview-name">{file?.name}</div>
            </div>
          )}

          {file && !result && (
            <button
              className="check-btn"
              onClick={handleCheck}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <ShieldAlert size={18} />
                  Check for Deepfake
                </>
              )}
            </button>
          )}

          {file && !result && !loading && (
            <button className="reset-btn" onClick={reset}>
              Choose Different Image
            </button>
          )}
        </div>

        {/* Result Section */}
        {result && (
          <div className={`result-card animate-fade ${result.isAIGenerated ? 'fake' : 'real'}`}>
            <div className="result-icon">
              {result.isAIGenerated
                ? <ShieldAlert size={40} />
                : <ShieldCheck size={40} />
              }
            </div>

            <div className="result-verdict">{result.verdict}</div>

            <div className="confidence-bar-wrap">
              <div className="confidence-label">
                <span>AI Generated Probability</span>
                <span className="confidence-num">{result.confidence}</span>
              </div>
              <div className="confidence-track">
                <div
                  className="confidence-fill"
                  style={{ width: result.confidence, background: result.isAIGenerated ? 'var(--danger)' : 'var(--success)' }}
                />
              </div>
            </div>

            <div className="result-details">
              <div className="detail-row">
                <span>Image Name</span>
                <span>{result.imageName}</span>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <span className={result.isAIGenerated ? 'text-danger' : 'text-success'}>
                  {result.isAIGenerated ? '⚠️ AI/Deepfake' : '✅ Authentic'}
                </span>
              </div>
              <div className="detail-row">
                <span>Confidence Score</span>
                <span>{result.confidence}</span>
              </div>
            </div>

            <button className="check-btn" onClick={reset} style={{ marginTop: '16px' }}>
              Check Another Image
            </button>
          </div>
        )}

        {/* Info Cards */}
        {!result && (
          <div className="info-cards">
            <div className="info-card">
              <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
              <div>
                <div className="info-title">Real Image</div>
                <div className="info-desc">Low AI score (0–30%). Original photograph taken by camera.</div>
              </div>
            </div>
            <div className="info-card">
              <ShieldAlert size={20} style={{ color: 'var(--danger)' }} />
              <div>
                <div className="info-title">AI Generated</div>
                <div className="info-desc">High AI score (50%+). Created or manipulated by AI tools.</div>
              </div>
            </div>
            <div className="info-card">
              <Image size={20} style={{ color: 'var(--accent2)' }} />
              <div>
                <div className="info-title">Supported Formats</div>
                <div className="info-desc">JPEG, PNG, WEBP images up to 5MB in size.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

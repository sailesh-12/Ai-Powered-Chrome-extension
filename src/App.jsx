import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState('')

  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [pageInfo, setPageInfo] = useState(null)
  const [summaryLength, setSummaryLength] = useState('short')

  // Load saved API key on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['geminiApiKey'], (result) => {
        if (result.geminiApiKey) {
          setSavedApiKey(result.geminiApiKey)
          setApiKey(result.geminiApiKey)
        }
      })
    }
  }, [])

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key')
      return
    }
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
        setSavedApiKey(apiKey)
        setError('')
      })
    }
  }

  const clearApiKey = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.remove(['geminiApiKey'], () => {
        setSavedApiKey('')
        setApiKey('')
      })
    }
  }

  const getPageContent = () => {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getPageContent' }, (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error('Could not connect to page. Please refresh and try again.'))
              } else if (response && response.content) {
                resolve(response.content)
              } else {
                reject(new Error('Could not extract page content'))
              }
            })
          } else {
            reject(new Error('No active tab found'))
          }
        })
      } else {
        reject(new Error('Chrome extension APIs not available'))
      }
    })
  }

  const summarizeWithGemini = async (content, length) => {
    const lengthPrompts = {
      brief: `Give a brief summary of this webpage.

Title: ${content.title}
Content: ${content.text}`,
      short: `Give a short summary of this webpage.

Title: ${content.title}
Content: ${content.text}`,
      detailed: `Give a detailed summary of this webpage.

Title: ${content.title}
Content: ${content.text}`
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${savedApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: lengthPrompts[length]
            }]
          }],
          generationConfig: {
            temperature: 0.7,
          }
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to generate summary')
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated'
  }

  const handleSummarize = async () => {
    setLoading(true)
    setError('')
    setSummary('')
    setCopied(false)

    try {
      const content = await getPageContent()
      setPageInfo({ title: content.title, url: content.url })
      const result = await summarizeWithGemini(content, summaryLength)
      setSummary(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1>AI Summarizer</h1>
        <p className="tagline">Powered by Gemini</p>
      </header>

      {!savedApiKey ? (
        <div className="api-setup">
          <div className="card">
            <h2>🔐 Setup API Key</h2>
            <p>Enter your Gemini API key to get started</p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="input"
            />
            <button onClick={saveApiKey} className="btn btn-primary">
              Save API Key
            </button>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Get your free API key →
            </a>
          </div>
        </div>
      ) : (
        <div className="main-content">
          <div className="length-selector">
            <span className="length-label">Summary Length:</span>
            <div className="length-options">
              <button
                className={`length-btn ${summaryLength === 'brief' ? 'active' : ''}`}
                onClick={() => setSummaryLength('brief')}
              >
                ⚡ Brief
              </button>
              <button
                className={`length-btn ${summaryLength === 'short' ? 'active' : ''}`}
                onClick={() => setSummaryLength('short')}
              >
                📝 Short
              </button>
              <button
                className={`length-btn ${summaryLength === 'detailed' ? 'active' : ''}`}
                onClick={() => setSummaryLength('detailed')}
              >
                📚 Detailed
              </button>
            </div>
          </div>

          <button
            onClick={handleSummarize}
            className={`btn btn-summarize ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Summarize This Page
              </>
            )}
          </button>

          {error && (
            <div className="error">
              <span>⚠️</span> {error}
            </div>
          )}

          {summary && (
            <div className="summary-container">
              {pageInfo && (
                <div className="page-info">
                  <strong>{pageInfo.title}</strong>
                </div>
              )}
              <div className="summary">
                {summary.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <button onClick={copyToClipboard} className="btn btn-copy">
                {copied ? '✓ Copied!' : '📋 Copy Summary'}
              </button>
            </div>
          )}

          <button onClick={clearApiKey} className="btn btn-link">
            Change API Key
          </button>
        </div>
      )}
    </div>
  )
}

export default App

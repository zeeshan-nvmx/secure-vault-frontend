// src/components/common/PinModal.jsx
import React, { useState, useRef, useEffect } from 'react'

const PinModal = ({ onClose, onSubmit, title = 'Enter PIN' }) => {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }

    // Auto-submit when all digits entered
    if (newPin.every((digit) => digit) && index === 3) {
      handleSubmit(newPin.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleSubmit = async (pinValue) => {
    setLoading(true)
    setError('')

    try {
      await onSubmit(pinValue)
    } catch (err) {
      setError(err.message)
      setPin(['', '', '', ''])
      inputRefs[0].current?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const pinValue = pin.join('')
    if (pinValue.length === 4) {
      handleSubmit(pinValue)
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className='modal-header'>
          <h2 className='modal-title'>{title}</h2>
        </div>
        <div className='modal-content'>
          <form onSubmit={handleFormSubmit}>
            {error && <div className='alert alert-error mb-4'>{error}</div>}

            <div className='pin-input-container'>
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type='text'
                  className='pin-input'
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  disabled={loading}
                />
              ))}
            </div>

            <p className='text-center text-sm text-muted-foreground mt-4'>Enter your 4-digit PIN to continue</p>

            <div className='modal-footer' style={{ padding: '1rem 0 0', borderTop: 'none' }}>
              <button type='button' className='btn btn-secondary' onClick={onClose}>
                Cancel
              </button>
              <button type='submit' className='btn btn-primary' disabled={pin.some((d) => !d) || loading}>
                {loading ? <span className='spinner'></span> : 'Verify'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PinModal

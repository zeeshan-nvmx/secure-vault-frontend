// src/components/Settings.jsx
import React, { useState } from 'react'
import api from '../services/api'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('password')
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pinForm, setPinForm] = useState({
    oldPin: '',
    newPin: '',
    confirmPin: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    })
  }

  const handlePinChange = (e) => {
    const { name, value } = e.target
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPinForm({
        ...pinForm,
        [name]: value,
      })
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      await api.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      setSuccess('Password changed successfully')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePinSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (pinForm.newPin !== pinForm.confirmPin) {
      setError('New PINs do not match')
      return
    }

    if (pinForm.newPin.length !== 4) {
      setError('PIN must be exactly 4 digits')
      return
    }

    setLoading(true)
    try {
      await api.changePin(pinForm.oldPin, pinForm.newPin)
      setSuccess('PIN changed successfully')
      setPinForm({ oldPin: '', newPin: '', confirmPin: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container' style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 className='card-title mb-4'>Settings</h1>

      <div className='card'>
        <div className='card-header'>
          <div className='flex gap-4'>
            <button className={`btn ${activeTab === 'password' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('password')}>
              Change Password
            </button>
            <button className={`btn ${activeTab === 'pin' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('pin')}>
              Change PIN
            </button>
          </div>
        </div>

        <div className='card-content'>
          {error && <div className='alert alert-error mb-4'>{error}</div>}

          {success && <div className='alert alert-success mb-4'>{success}</div>}

          {activeTab === 'password' ? (
            <form className='form' onSubmit={handlePasswordSubmit}>
              <div className='form-group'>
                <label htmlFor='oldPassword' className='label'>
                  Current Password
                </label>
                <input type='password' id='oldPassword' name='oldPassword' className='input' value={passwordForm.oldPassword} onChange={handlePasswordChange} required />
              </div>

              <div className='form-group'>
                <label htmlFor='newPassword' className='label'>
                  New Password
                </label>
                <input
                  type='password'
                  id='newPassword'
                  name='newPassword'
                  className='input'
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  minLength={6}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='confirmPassword' className='label'>
                  Confirm New Password
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  className='input'
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  minLength={6}
                  required
                />
              </div>

              <button type='submit' className='btn btn-primary w-full' disabled={loading}>
                {loading ? <span className='spinner'></span> : 'Change Password'}
              </button>
            </form>
          ) : (
            <form className='form' onSubmit={handlePinSubmit}>
              <div className='form-group'>
                <label htmlFor='oldPin' className='label'>
                  Current PIN
                </label>
                <input
                  type='password'
                  id='oldPin'
                  name='oldPin'
                  className='input'
                  value={pinForm.oldPin}
                  onChange={handlePinChange}
                  maxLength={4}
                  pattern='\d{4}'
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='newPin' className='label'>
                  New PIN
                </label>
                <input type='text' id='newPin' name='newPin' className='input' value={pinForm.newPin} onChange={handlePinChange} maxLength={4} pattern='\d{4}' required />
              </div>

              <div className='form-group'>
                <label htmlFor='confirmPin' className='label'>
                  Confirm New PIN
                </label>
                <input
                  type='text'
                  id='confirmPin'
                  name='confirmPin'
                  className='input'
                  value={pinForm.confirmPin}
                  onChange={handlePinChange}
                  maxLength={4}
                  pattern='\d{4}'
                  required
                />
              </div>

              <div className='alert' style={{ backgroundColor: 'var(--muted)', border: 'none' }}>
                <strong>Important:</strong> Your PIN is used to encrypt your files. Make sure to remember it!
              </div>

              <button type='submit' className='btn btn-primary w-full' disabled={loading}>
                {loading ? <span className='spinner'></span> : 'Change PIN'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings

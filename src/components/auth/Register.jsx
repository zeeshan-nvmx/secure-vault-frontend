// src/components/auth/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    pin: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    // For PIN input, only allow numbers and max 4 digits
    if (name === 'pin') {
      if (/^\d*$/.test(value) && value.length <= 4) {
        setFormData({ ...formData, [name]: value })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate PIN
    if (formData.pin.length !== 4) {
      setError('PIN must be exactly 4 digits')
      setLoading(false)
      return
    }

    const { confirmPassword: _, ...userData } = formData
    const result = await register(userData)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className='auth-container'>
      <h1 className='app-title'>Secrets Manager</h1>
      <div className='auth-card card'>
        <div className='card-header'>
          <h2 className='card-subtitle'>Create an account</h2>
          <p className='card-description'>Enter your information to get started</p>
        </div>
        <div className='card-content'>
          <form className='form' onSubmit={handleSubmit}>
            {error && <div className='alert alert-error'>{error}</div>}
            <div className='form-group'>
              <label htmlFor='username' className='label'>
                Username
              </label>
              <input
                type='text'
                id='username'
                name='username'
                className='input'
                value={formData.username}
                onChange={handleChange}
                placeholder='Choose a username'
                minLength={3}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email' className='label'>
                Email
              </label>
              <input type='email' id='email' name='email' className='input' value={formData.email} onChange={handleChange} placeholder='Enter your email' required />
            </div>
            <div className='form-group'>
              <label htmlFor='password' className='label'>
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                className='input'
                value={formData.password}
                onChange={handleChange}
                placeholder='Create a password'
                minLength={6}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='confirmPassword' className='label'>
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                className='input'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm your password'
                minLength={6}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='pin' className='label'>
                4-Digit PIN
              </label>
              <input
                type='text'
                id='pin'
                name='pin'
                className='input'
                value={formData.pin}
                onChange={handleChange}
                placeholder='Enter a 4-digit PIN'
                maxLength={4}
                pattern='\d{4}'
                title='PIN must be exactly 4 digits'
                required
              />
              <p className='text-xs text-muted-foreground'>This PIN will be used to encrypt your files</p>
            </div>
            <button type='submit' className='btn btn-primary w-full' disabled={loading}>
              {loading ? <span className='spinner'></span> : 'Create Account'}
            </button>
          </form>
          <p className='text-center text-sm mt-4'>
            Already have an account?{' '}
            <Link to='/login' className='font-medium'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

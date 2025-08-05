// src/components/auth/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)

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
          <h2 className='card-subtitle'>Welcome back</h2>
          <p className='card-description'>Enter your credentials to access your account</p>
        </div>
        <div className='card-content'>
          <form className='form' onSubmit={handleSubmit}>
            {error && <div className='alert alert-error'>{error}</div>}
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
                placeholder='Enter your password'
                required
              />
            </div>
            <button type='submit' className='btn btn-primary w-full' disabled={loading}>
              {loading ? <span className='spinner'></span> : 'Sign In'}
            </button>
          </form>
          <p className='text-center text-sm mt-4'>
            Don't have an account?{' '}
            <Link to='/register' className='font-medium'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

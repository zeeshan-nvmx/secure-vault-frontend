// src/components/layout/Navigation.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) return null

  return (
    <nav className='nav'>
      <div className='nav-container container'>
        <Link to='/dashboard' className='nav-brand'>
          🔐 SecureVault
        </Link>
        <div className='nav-links'>
          <span className='text-sm'>
            Welcome, <strong>{user?.username}</strong>
          </span>
          <Link to='/dashboard' className='btn btn-ghost btn-sm'>
            Files
          </Link>
          <Link to='/settings' className='btn btn-ghost btn-sm'>
            Settings
          </Link>
          <button onClick={handleLogout} className='btn btn-outline btn-sm'>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

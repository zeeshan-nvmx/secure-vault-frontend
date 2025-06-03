// src/components/layout/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}>
        <div className='spinner' style={{ width: '2rem', height: '2rem' }}></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute

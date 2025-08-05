// src/components/files/FileUploadModal.jsx
import React, { useState, useRef, useEffect } from 'react'
import api from '../../services/api'

const FileUploadModal = ({ onClose, onFileUploaded, selectedProject = null }) => {
  const [file, setFile] = useState(null)
  const [filename, setFilename] = useState('')
  const [pin, setPin] = useState('')
  const [projectId, setProjectId] = useState(selectedProject?._id || selectedProject?.id || '')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await api.getProjects()
      setProjects(response.data || [])
    } catch (err) {
      console.error('Failed to load projects:', err)
    }
  }

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setFilename(selectedFile.name)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const finalProjectId = projectId || null
      const response = await api.uploadFile(file, filename, pin, finalProjectId)
      onFileUploaded(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2 className='modal-title'>Upload File</h2>
        </div>
        <div className='modal-content'>
          <form onSubmit={handleSubmit}>
            {error && <div className='alert alert-error mb-4'>{error}</div>}

            <div
              className={`upload-area ${dragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}>
              <svg className='upload-icon' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                />
              </svg>
              {file ? (
                <div>
                  <p className='font-medium'>{file.name}</p>
                  <p className='text-sm text-muted-foreground'>{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <p className='font-medium'>Drop your file here, or click to browse</p>
                  <p className='text-sm text-muted-foreground'>Maximum file size: 5MB</p>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type='file' onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])} style={{ display: 'none' }} />

            <div className='form-group mt-4'>
              <label htmlFor='filename' className='label'>
                Filename
              </label>
              <input type='text' id='filename' className='input' value={filename} onChange={(e) => setFilename(e.target.value)} placeholder='Enter filename' required />
            </div>

            <div className='form-group'>
              <label htmlFor='project' className='label'>
                Project (Optional)
              </label>
              <select
                id='project'
                className='input'
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value=''>No Project</option>
                {projects.map((project) => (
                  <option key={project._id || project.id} value={project._id || project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='pin' className='label'>
                4-Digit PIN
              </label>
              <input
                type='password'
                id='pin'
                className='input'
                value={pin}
                onChange={(e) => /^\d{0,4}$/.test(e.target.value) && setPin(e.target.value)}
                placeholder='Enter your PIN'
                maxLength={4}
                pattern='\d{4}'
                required
              />
            </div>

            <div className='modal-footer' style={{ padding: '1rem 0 0', borderTop: 'none' }}>
              <button type='button' className='btn btn-secondary' onClick={onClose}>
                Cancel
              </button>
              <button type='submit' className='btn btn-primary' disabled={!file || loading}>
                {loading ? <span className='spinner'></span> : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FileUploadModal

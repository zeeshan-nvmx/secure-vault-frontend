// src/components/files/CreateNoteModal.jsx
import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const CreateNoteModal = ({ onClose, onNoteCreated, selectedProject = null }) => {
  const [formData, setFormData] = useState({
    filename: '',
    content: '',
    fileType: 'txt',
    pin: '',
    projectId: selectedProject?._id || selectedProject?.id || '',
  })
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleChange = (e) => {
    const { name, value } = e.target

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

    try {
      const projectId = formData.projectId || null
      const response = await api.createNote(
        formData.filename,
        formData.content,
        formData.fileType,
        formData.pin,
        projectId
      )
      onNoteCreated(response.data)
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
          <h2 className='modal-title'>Create Note</h2>
        </div>
        <div className='modal-content'>
          <form onSubmit={handleSubmit}>
            {error && <div className='alert alert-error mb-4'>{error}</div>}

            <div className='form-group'>
              <label htmlFor='filename' className='label'>
                Filename
              </label>
              <input
                type='text'
                id='filename'
                name='filename'
                className='input'
                value={formData.filename}
                onChange={handleChange}
                placeholder='Enter filename'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='fileType' className='label'>
                File Type
              </label>
              <select id='fileType' name='fileType' className='input' value={formData.fileType} onChange={handleChange}>
                <option value='txt'>Text (.txt)</option>
                <option value='json'>JSON (.json)</option>
                <option value='env'>Environment (.env)</option>
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='content' className='label'>
                Content
              </label>
              <textarea
                id='content'
                name='content'
                className='textarea'
                value={formData.content}
                onChange={handleChange}
                placeholder='Enter your note content'
                rows={10}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='projectId' className='label'>
                Project (Optional)
              </label>
              <select
                id='projectId'
                name='projectId'
                className='input'
                value={formData.projectId}
                onChange={handleChange}
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
                name='pin'
                className='input'
                value={formData.pin}
                onChange={handleChange}
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
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {loading ? <span className='spinner'></span> : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateNoteModal

import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const ProjectModal = ({ project, onClose, onProjectSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#007bff',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!project

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        color: project.color || '#007bff',
      })
    }
  }, [project])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let response
      if (isEdit) {
        response = await api.updateProject(project._id || project.id, formData)
      } else {
        response = await api.createProject(formData)
      }
      onProjectSaved(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const colorOptions = [
    { value: '#007bff', label: 'Blue' },
    { value: '#28a745', label: 'Green' },
    { value: '#dc3545', label: 'Red' },
    { value: '#ffc107', label: 'Yellow' },
    { value: '#6f42c1', label: 'Purple' },
    { value: '#20c997', label: 'Teal' },
    { value: '#fd7e14', label: 'Orange' },
    { value: '#e83e8c', label: 'Pink' },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Project' : 'Create Project'}</h2>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error mb-4">{error}</div>}

            <div className="form-group">
              <label htmlFor="name" className="label">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description (optional)"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="color" className="label">
                Color
              </label>
              <div className="flex items-center gap-4">
                <select
                  id="color"
                  name="color"
                  className="input"
                  value={formData.color}
                  onChange={handleChange}
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div
                  className="color-preview"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: formData.color,
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                ></div>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: 'none' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner"></span> : isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
import React from 'react'

const ProjectCard = ({ project, onSelect, onEdit, onDelete, isSelected }) => {
  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(project)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      onDelete(project._id || project.id)
    }
  }

  return (
    <div
      className={`project-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(project)}
      style={{ borderLeft: `4px solid ${project.color}` }}
    >
      <div className="project-card-header">
        <div className="project-info">
          <h3 className="project-name">{project.name}</h3>
          <p className="project-description">{project.description}</p>
        </div>
        <div className="project-actions">
          <button
            className="btn-icon"
            onClick={handleEdit}
            title="Edit project"
          >
            ✏️
          </button>
          <button
            className="btn-icon"
            onClick={handleDelete}
            title="Delete project"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="project-stats">
        <span className="file-count">
          {project.files?.length || 0} files
        </span>
      </div>
    </div>
  )
}

export default ProjectCard
// src/components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import FileUploadModal from './files/FileUploadModal'
import CreateNoteModal from './files/CreateNoteModal'
import FileViewModal from './files/FileViewModal'
import PinModal from './common/PinModal'
import ProjectModal from './projects/ProjectModal'
import ProjectCard from './projects/ProjectCard'
import SearchBar from './search/SearchBar'
import { formatFileSize, formatDate } from '../utils/helpers'

const Dashboard = () => {
  // Data state
  const [files, setFiles] = useState([])
  const [projects, setProjects] = useState([])
  const [filteredFiles, setFilteredFiles] = useState([])
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState('projects') // 'files', 'projects', 'project-detail'
  const [selectedProject, setSelectedProject] = useState(null)
  
  // Modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [pinModalOpen, setPinModalOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [filesResponse, projectsResponse] = await Promise.all([
        api.getFiles(),
        api.getProjects()
      ])
      setFiles(filesResponse.data || [])
      setProjects(projectsResponse.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = files

    // Filter by selected project
    if (view === 'project-detail' && selectedProject) {
      const projectId = selectedProject._id || selectedProject.id
      filtered = filtered.filter(file => {
        const fileProjectId = file.project?._id || file.project?.id || file.projectId
        return fileProjectId === projectId
      })
    } else if (filters.project === 'unassigned') {
      filtered = filtered.filter(file => !file.project && !file.projectId)
    } else if (filters.project) {
      filtered = filtered.filter(file => {
        const fileProjectId = file.project?._id || file.project?.id || file.projectId
        return fileProjectId === filters.project
      })
    }

    // Filter by file type
    if (filters.fileType) {
      filtered = filtered.filter(file => file.fileType === filters.fileType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredFiles(filtered)
  }, [files, searchTerm, filters, selectedProject, view])

  useEffect(() => {
    applyFilters()
  }, [applyFilters, files, searchTerm, filters, selectedProject, view])

  const handleFileClick = (file) => {
    console.log('File clicked:', file) // Debug log
    setSelectedFile(file)
    setPendingAction({ type: 'view', file })
    setPinModalOpen(true)
  }

  const handlePinSubmit = async (pin) => {
    if (pendingAction.type === 'view') {
      try {
        console.log('Pending action:', pendingAction) // Debug log
        // Use either _id or id property
        const fileId = pendingAction.file._id || pendingAction.file.id
        console.log('File ID:', fileId) // Debug log
        const response = await api.getFile(fileId, pin)
        setSelectedFile(response.data)
        setPinModalOpen(false)
        setViewModalOpen(true)
      } catch {
        throw new Error('Invalid PIN')
      }
    }
  }

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await api.deleteFile(fileId)
        setFiles(files.filter((f) => (f._id || f.id) !== fileId))
        setViewModalOpen(false)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  // File handlers
  const handleFileUploaded = async (newFile) => {
    const fileWithId = { ...newFile, _id: newFile.id || newFile._id }
    setFiles([fileWithId, ...files])
    setUploadModalOpen(false)
    
    // Refresh data to ensure project associations are up to date
    await loadData()
  }

  const handleNoteCreated = async (newNote) => {
    const noteWithId = { ...newNote, _id: newNote.id || newNote._id }
    setFiles([noteWithId, ...files])
    setNoteModalOpen(false)
    
    // Refresh data to ensure project associations are up to date
    await loadData()
  }

  const handleFileUpdated = (updatedFile) => {
    const fileId = updatedFile.id || updatedFile._id
    setFiles(
      files.map((f) => {
        const currentId = f._id || f.id
        return currentId === fileId ? { ...f, ...updatedFile, _id: currentId } : f
      })
    )
    setViewModalOpen(false)
  }

  // Project handlers
  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setView('project-detail')
  }

  const handleProjectEdit = (project) => {
    setEditingProject(project)
    setProjectModalOpen(true)
  }

  const handleProjectDelete = async (projectId) => {
    try {
      await api.deleteProject(projectId)
      setProjects(projects.filter(p => (p._id || p.id) !== projectId))
      if (selectedProject && (selectedProject._id || selectedProject.id) === projectId) {
        setView('files')
        setSelectedProject(null)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleProjectSaved = (savedProject) => {
    if (editingProject) {
      setProjects(projects.map(p => 
        (p._id || p.id) === (savedProject._id || savedProject.id) ? savedProject : p
      ))
    } else {
      setProjects([savedProject, ...projects])
    }
    setProjectModalOpen(false)
    setEditingProject(null)
  }

  // Search handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
  }, [])

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  const getFileIcon = (fileType) => {
    const icons = {
      env: '🔐',
      txt: '📝',
      json: '📄',
      other: '📎',
    }
    return icons[fileType] || icons.other
  }

  if (loading) {
    return (
      <div className='container' style={{ padding: '2rem', textAlign: 'center' }}>
        <div className='spinner' style={{ width: '2rem', height: '2rem' }}></div>
      </div>
    )
  }

  const renderHeader = () => (
    <div className='dashboard-header mb-4'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h1 className='card-title'>
            {view === 'files' && 'My Files'}
            {view === 'projects' && 'My Projects'}
            {view === 'project-detail' && selectedProject && `${selectedProject.name} Files`}
          </h1>
          {view === 'project-detail' && selectedProject && (
            <p className='text-muted-foreground'>{selectedProject.description}</p>
          )}
        </div>
        <div className='flex gap-2'>
          {view === 'project-detail' && (
            <button 
              className='btn btn-secondary' 
              onClick={() => setView('projects')}
            >
              ← Back to Projects
            </button>
          )}
          <button 
            className={`btn ${view === 'files' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setView('files'); setSelectedProject(null) }}
          >
            Files
          </button>
          <button 
            className={`btn ${view === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('projects')}
          >
            Projects
          </button>
        </div>
      </div>
      
      {(view === 'files' || view === 'project-detail') && (
        <div className='flex justify-between items-center mb-4'>
          <SearchBar
            onSearch={handleSearch}
            onFilter={handleFilter}
            filters={filters}
            projects={projects}
            placeholder={view === 'project-detail' ? 'Search files in project...' : 'Search files and projects...'}
          />
          <div className='flex gap-2'>
            <button className='btn btn-primary' onClick={() => setNoteModalOpen(true)}>
              Create Note
            </button>
            <button className='btn btn-primary' onClick={() => setUploadModalOpen(true)}>
              Upload File
            </button>
          </div>
        </div>
      )}
      
      {view === 'projects' && (
        <div className='flex justify-between items-center mb-4'>
          <SearchBar
            onSearch={handleSearch}
            onFilter={() => {}}
            filters={{}}
            placeholder='Search projects...'
          />
          <button 
            className='btn btn-primary' 
            onClick={() => {
              setEditingProject(null)
              setProjectModalOpen(true)
            }}
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  )

  const renderFiles = () => {
    const filesToShow = filteredFiles

    if (filesToShow.length === 0) {
      return (
        <div className='card'>
          <div className='card-content' style={{ textAlign: 'center', padding: '3rem' }}>
            <p className='text-muted-foreground mb-4'>
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'No files match your search criteria' 
                : view === 'project-detail' 
                  ? 'No files in this project yet' 
                  : 'No files uploaded yet'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <button className='btn btn-primary' onClick={() => setUploadModalOpen(true)}>
                Upload your first file
              </button>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className='file-grid'>
        {filesToShow.map((file) => (
          <div key={file._id || file.id} className='file-card' onClick={() => handleFileClick(file)}>
            <div className='file-card-header'>
              <span style={{ fontSize: '1.5rem' }}>{getFileIcon(file.fileType)}</span>
              <span className='file-type'>{file.fileType}</span>
            </div>
            <h3 className='file-name'>{file.filename}</h3>
            <div className='file-meta'>
              <span>{formatFileSize(file.size)}</span>
              <span>{formatDate(file.createdAt)}</span>
            </div>
            {file.project && (
              <div className='file-project'>
                <span 
                  className='project-tag' 
                  style={{ backgroundColor: file.project.color }}
                >
                  {file.project.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderProjects = () => {
    const projectsToShow = searchTerm 
      ? projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      : projects

    if (projectsToShow.length === 0) {
      return (
        <div className='card'>
          <div className='card-content' style={{ textAlign: 'center', padding: '3rem' }}>
            <p className='text-muted-foreground mb-4'>
              {searchTerm ? 'No projects match your search' : 'No projects created yet'}
            </p>
            {!searchTerm && (
              <button 
                className='btn btn-primary' 
                onClick={() => {
                  setEditingProject(null)
                  setProjectModalOpen(true)
                }}
              >
                Create your first project
              </button>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className='projects-grid'>
        {projectsToShow.map((project) => (
          <ProjectCard
            key={project._id || project.id}
            project={{
              ...project,
              files: files.filter(f => {
                const fileProjectId = f.project?._id || f.project?.id || f.projectId
                return fileProjectId === (project._id || project.id)
              })
            }}
            onSelect={handleProjectSelect}
            onEdit={handleProjectEdit}
            onDelete={handleProjectDelete}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='container' style={{ padding: '2rem' }}>
      {renderHeader()}
      {error && <div className='alert alert-error mb-4'>{error}</div>}
      
      {view === 'projects' && renderProjects()}
      {(view === 'files' || view === 'project-detail') && renderFiles()}

      {/* Modals */}
      {uploadModalOpen && (
        <FileUploadModal 
          onClose={() => setUploadModalOpen(false)} 
          onFileUploaded={handleFileUploaded}
          selectedProject={view === 'project-detail' ? selectedProject : null}
        />
      )}

      {noteModalOpen && (
        <CreateNoteModal 
          onClose={() => setNoteModalOpen(false)} 
          onNoteCreated={handleNoteCreated}
          selectedProject={view === 'project-detail' ? selectedProject : null}
        />
      )}

      {viewModalOpen && selectedFile && (
        <FileViewModal 
          file={selectedFile} 
          onClose={() => setViewModalOpen(false)} 
          onDelete={handleDelete} 
          onUpdate={handleFileUpdated} 
        />
      )}

      {pinModalOpen && (
        <PinModal 
          onClose={() => setPinModalOpen(false)} 
          onSubmit={handlePinSubmit} 
        />
      )}

      {projectModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setProjectModalOpen(false)
            setEditingProject(null)
          }}
          onProjectSaved={handleProjectSaved}
        />
      )}
    </div>
  )
}

export default Dashboard

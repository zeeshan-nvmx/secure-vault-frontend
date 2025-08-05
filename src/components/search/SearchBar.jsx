import React, { useState, useEffect } from 'react'

const SearchBar = ({ onSearch, onFilter, filters, projects = [], placeholder = "Search files and projects..." }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm, onSearch])

  const handleFilterChange = (key, value) => {
    onFilter({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFilter({})
    setSearchTerm('')
  }

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '')

  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-input-container">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {(searchTerm || hasActiveFilters) && (
            <button
              className="clear-search"
              onClick={clearFilters}
              title="Clear search and filters"
            >
              ×
            </button>
          )}
        </div>
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          title="Show filters"
        >
          🔽
        </button>
      </div>

      {showFilters && (
        <div className="search-filters">
          <div className="filter-group">
            <label className="filter-label">File Type</label>
            <select
              className="filter-select"
              value={filters.fileType || ''}
              onChange={(e) => handleFilterChange('fileType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="env">Environment (.env)</option>
              <option value="txt">Text (.txt)</option>
              <option value="json">JSON (.json)</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Project</label>
            <select
              className="filter-select"
              value={filters.project || ''}
              onChange={(e) => handleFilterChange('project', e.target.value)}
            >
              <option value="">All Projects</option>
              <option value="unassigned">Unassigned</option>
              {projects.map((project) => (
                <option key={project._id || project.id} value={project._id || project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
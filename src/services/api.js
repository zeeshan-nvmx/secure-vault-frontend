// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token')
  }

  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      ...options,
      headers: {
        ...options.headers,
      },
    }

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`
    }

    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
      if (options.body) {
        config.body = JSON.stringify(options.body)
      }
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong')
    }

    return data
  }

  // Auth endpoints
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    })
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    })
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  async verifyPin(pin) {
    return this.request('/auth/verify-pin', {
      method: 'POST',
      body: { pin },
    })
  }

  async changePassword(oldPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: { oldPassword, newPassword },
    })
  }

  async changePin(oldPin, newPin) {
    return this.request('/auth/change-pin', {
      method: 'PUT',
      body: { oldPin, newPin },
    })
  }

  async getMe() {
    return this.request('/auth/me')
  }

  // File endpoints
  async getFiles(filters = {}) {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.project) params.append('project', filters.project)
    if (filters.fileType) params.append('fileType', filters.fileType)
    
    const queryString = params.toString()
    return this.request(`/files${queryString ? `?${queryString}` : ''}`)
  }

  async searchFiles(query) {
    return this.request(`/files/search?q=${encodeURIComponent(query)}`)
  }

  async moveFiles(fileIds, projectId) {
    return this.request('/files/move', {
      method: 'PUT',
      body: { fileIds, projectId },
    })
  }

  async getFile(id, pin) {
    return this.request(`/files/${id}?pin=${pin}`)
  }

  async uploadFile(file, filename, pin, projectId = null) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', filename)
    formData.append('pin', pin)
    if (projectId) {
      formData.append('projectId', projectId)
    }

    return this.request('/files/upload', {
      method: 'POST',
      body: formData,
    })
  }

  async createNote(filename, content, fileType, pin, projectId = null) {
    return this.request('/files/note', {
      method: 'POST',
      body: { filename, content, fileType, pin, projectId },
    })
  }

  async updateFile(id, updates) {
    return this.request(`/files/${id}`, {
      method: 'PUT',
      body: updates,
    })
  }

  async deleteFile(id) {
    return this.request(`/files/${id}`, {
      method: 'DELETE',
    })
  }

  // Project endpoints
  async getProjects(search = null) {
    const queryString = search ? `?search=${encodeURIComponent(search)}` : ''
    return this.request(`/projects${queryString}`)
  }

  async getProject(id) {
    return this.request(`/projects/${id}`)
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: projectData,
    })
  }

  async updateProject(id, updates) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: updates,
    })
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  logout() {
    this.setToken(null)
  }
}

export default new ApiService()

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
  async getFiles() {
    return this.request('/files')
  }

  async getFile(id, pin) {
    return this.request(`/files/${id}?pin=${pin}`)
  }

  async uploadFile(file, filename, pin) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', filename)
    formData.append('pin', pin)

    return this.request('/files/upload', {
      method: 'POST',
      body: formData,
    })
  }

  async createNote(filename, content, fileType, pin) {
    return this.request('/files/note', {
      method: 'POST',
      body: { filename, content, fileType, pin },
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

  logout() {
    this.setToken(null)
  }
}

export default new ApiService()

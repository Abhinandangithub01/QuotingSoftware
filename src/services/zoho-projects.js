/**
 * Zoho Books Projects API Service
 * Scope: ZohoBooks.projects.ALL
 */

import { zohoAuth } from './zoho-auth'

class ZohoProjectsService {
  constructor() {
    this.baseURL = '/api/zoho/books'
  }

  getOrganizationId() {
    return localStorage.getItem('zoho_organization_id')
  }

  async makeRequest(endpoint, options = {}) {
    const token = await zohoAuth.getValidAccessToken()
    const organizationId = this.getOrganizationId()
    
    const url = new URL(`${window.location.origin}${this.baseURL}${endpoint}`)
    url.searchParams.append('organization_id', organizationId)
    
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async listProjects(params = {}) {
    const queryParams = new URLSearchParams(params)
    return this.makeRequest(`/projects?${queryParams}`)
  }

  async getProject(projectId) {
    return this.makeRequest(`/projects/${projectId}`)
  }

  async createProject(projectData) {
    return this.makeRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    })
  }

  async updateProject(projectId, projectData) {
    return this.makeRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    })
  }

  async deleteProject(projectId) {
    return this.makeRequest(`/projects/${projectId}`, {
      method: 'DELETE'
    })
  }

  async activateProject(projectId) {
    return this.makeRequest(`/projects/${projectId}/active`, {
      method: 'POST'
    })
  }

  async deactivateProject(projectId) {
    return this.makeRequest(`/projects/${projectId}/inactive`, {
      method: 'POST'
    })
  }

  async cloneProject(projectId, cloneData) {
    return this.makeRequest(`/projects/${projectId}/clone`, {
      method: 'POST',
      body: JSON.stringify(cloneData)
    })
  }

  async assignUsers(projectId, userData) {
    return this.makeRequest(`/projects/${projectId}/users`, {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async listProjectUsers(projectId) {
    return this.makeRequest(`/projects/${projectId}/users`)
  }

  async inviteUser(projectId, inviteData) {
    return this.makeRequest(`/projects/${projectId}/users/invite`, {
      method: 'POST',
      body: JSON.stringify(inviteData)
    })
  }

  async updateUser(projectId, userId, userData) {
    return this.makeRequest(`/projects/${projectId}/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  }

  async deleteUser(projectId, userId) {
    return this.makeRequest(`/projects/${projectId}/users/${userId}`, {
      method: 'DELETE'
    })
  }

  async addComment(projectId, commentData) {
    return this.makeRequest(`/projects/${projectId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    })
  }

  async listComments(projectId) {
    return this.makeRequest(`/projects/${projectId}/comments`)
  }

  async deleteComment(projectId, commentId) {
    return this.makeRequest(`/projects/${projectId}/comments/${commentId}`, {
      method: 'DELETE'
    })
  }
}

export const zohoProjects = new ZohoProjectsService()

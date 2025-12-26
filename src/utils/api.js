const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log('🔗 API URL:', API_URL);

const getToken = () => localStorage.getItem('bricol_token');

export const api = {
  async request(endpoint, options = {}) {
    const token = getToken();
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur API');
    }
    return response.json();
  },
  get(endpoint) { return this.request(endpoint); },
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); },
  put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); },
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); },
};

export const authApi = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
};

export const projectApi = {
  get: () => api.get('/api/project'),
  updateBudget: (total_budget) => api.put('/api/project/budget', { total_budget }),
};

export const phasesApi = {
  getAll: () => api.get('/api/phases'),
  updateBudget: (id, estimated_cost) => api.put(`/api/phases/${id}/budget`, { estimated_cost }),
  updateActualCost: (id, actual_cost) => api.put(`/api/phases/${id}/actual-cost`, { actual_cost }),
  validate: (id) => api.post(`/api/phases/${id}/validate`),
  approve: (id) => api.post(`/api/phases/${id}/approve`),
};

export const subTasksApi = {
  getByPhase: (phaseId) => api.get(`/api/subtasks/phase/${phaseId}`),
  create: (data) => api.post('/api/subtasks', data),
  updateProgression: (id, progression) => api.put(`/api/subtasks/${id}/progression`, { progression }),
  validate: (id) => api.post(`/api/subtasks/${id}/validate`),
  delete: (id) => api.delete(`/api/subtasks/${id}`),
};

export const photosApi = {
  upload: async (subTaskId, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${API_URL}/api/photos/subtask/${subTaskId}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur upload');
    }
    return response.json();
  },
  getBySubTask: (subTaskId) => api.get(`/api/photos/subtask/${subTaskId}`),
};

export const reportsApi = {
  create: (data) => api.post('/api/reports', data),
  getBySubTask: (subTaskId) => api.get(`/api/reports/subtask/${subTaskId}`),
};

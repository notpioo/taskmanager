const API_BASE = '/api';

export const api = {
  // Authentication
  login: async (name, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },

  register: async (name, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  },

  // Upload tugas/galeri
  uploadTugas: async (formData) => {
    const response = await fetch(`${API_BASE}/tugas/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }
    
    return response.json();
  },

  // Get all tugas
  getTugas: async () => {
    const response = await fetch(`${API_BASE}/tugas`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tugas');
    }
    
    return response.json();
  },

  // Get all galeri
  getGaleri: async () => {
    const response = await fetch(`${API_BASE}/galeri`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch galeri');
    }
    
    return response.json();
  },

  // Download file (works for both tugas and galeri)
  downloadFile: async (id, filename) => {
    const response = await fetch(`${API_BASE}/files/download/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Download failed');
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  },

  // Delete file (works for both tugas and galeri)
  deleteFile: async (id) => {
    const response = await fetch(`${API_BASE}/files/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Delete failed');
    }
    
    return response.json();
  },
};
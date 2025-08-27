const API_BASE = '/api';

export const api = {
  // Upload tugas
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

  // Verify password for private files
  verifyPassword: async (id, password) => {
    const response = await fetch(`${API_BASE}/tugas/verify-password/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Password verification failed');
    }
    
    return response.json();
  },

  // Download tugas
  downloadTugas: async (id, filename, password = null) => {
    const url = password 
      ? `${API_BASE}/tugas/download/${id}?password=${encodeURIComponent(password)}`
      : `${API_BASE}/tugas/download/${id}`;
      
    const response = await fetch(url);
    
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

  // Delete tugas
  deleteTugas: async (id) => {
    const response = await fetch(`${API_BASE}/tugas/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Delete failed');
    }
    
    return response.json();
  },
};
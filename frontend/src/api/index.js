const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };
  
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============ AUTH API ============

export const authAPI = {
  register: (username, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: { username, email, password },
    });
  },
  
  login: (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },
  
  getMe: () => {
    return apiRequest('/auth/me');
  },
};

// ============ VIDEOS API ============

export const videosAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/videos${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => {
    return apiRequest(`/videos/${id}`);
  },
  
  getByChannel: (channelId) => {
    return apiRequest(`/channels/${channelId}/videos`);
  },
  
  create: (videoData) => {
    return apiRequest('/videos', {
      method: 'POST',
      body: videoData,
    });
  },
  
  update: (id, videoData) => {
    return apiRequest(`/videos/${id}`, {
      method: 'PUT',
      body: videoData,
    });
  },
  
  delete: (id) => {
    return apiRequest(`/videos/${id}`, {
      method: 'DELETE',
    });
  },
  
  like: (id) => {
    return apiRequest(`/videos/${id}/like`, {
      method: 'POST',
    });
  },
};

// ============ COMMENTS API ============

export const commentsAPI = {
  getByVideo: (videoId) => {
    return apiRequest(`/videos/${videoId}/comments`);
  },
  
  add: (videoId, text) => {
    return apiRequest(`/videos/${videoId}/comments`, {
      method: 'POST',
      body: { text },
    });
  },
};

// ============ CHANNELS API ============

export const channelsAPI = {
  getAll: () => {
    return apiRequest('/channels');
  },
  
  getById: (id) => {
    return apiRequest(`/channels/${id}`);
  },
  
  create: (channelData) => {
    return apiRequest('/channels', {
      method: 'POST',
      body: channelData,
    });
  },
  
  getUserChannel: (userId) => {
    return apiRequest(`/users/${userId}/channel`);
  },
};

// ============ SEARCH API ============

export const searchAPI = {
  search: (query) => {
    return apiRequest(`/search?q=${encodeURIComponent(query)}`);
  },
};

export default {
  auth: authAPI,
  videos: videosAPI,
  comments: commentsAPI,
  channels: channelsAPI,
  search: searchAPI,
};


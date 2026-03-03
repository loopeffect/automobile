import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → try refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('token', data.token);
          original.headers.Authorization = `Bearer ${data.token}`;
          return api(original);
        } catch (_) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/password', data),
};

// ── Listings
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getFeatured: () => api.get('/listings/featured'),
  getMy: (params) => api.get('/listings/my', { params }),
  getOne: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/listings/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/listings/${id}`),
  toggleSave: (id) => api.post(`/listings/${id}/save`),
  transfer: (id, data) => api.post(`/listings/${id}/transfer`, data),
};

// ── Dealers
export const dealersAPI = {
  getAll: (params) => api.get('/dealers', { params }),
  getOne: (id) => api.get(`/dealers/${id}`),
  getMyProfile: () => api.get('/dealers/me'),
  getMyAnalytics: () => api.get('/analytics/dealer'),
  updateMyProfile: (data) => {
    if (data instanceof FormData) {
      return api.put('/dealers/me', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put('/dealers/me', data);
  },
};

// ── Messages
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (id) => api.get(`/messages/conversations/${id}`),
  getMessages: (id, params) => api.get(`/messages/conversations/${id}/messages`, { params }),
  startConversation: (data) => api.post('/messages/conversations', data),
  sendMessage: (id, data) => api.post(`/messages/conversations/${id}/messages`, data),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

// ── Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getListings: (params) => api.get('/admin/listings', { params }),
  moderateListing: (id, data) => api.put(`/admin/listings/${id}/moderate`, data),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getDealers: (params) => api.get('/admin/dealers', { params }),
  updateDealer: (id, data) => api.put(`/admin/dealers/${id}`, data),
  getConversations: (params) => api.get('/admin/conversations', { params }),
};

// ── Inspections
export const inspectionsAPI = {
  request: (data) => api.post('/inspections', data),
  getMy: () => api.get('/inspections/my'),
  update: (id, data) => api.put(`/inspections/${id}`, data),
  generateReport: (id) => api.post(`/inspections/${id}/report`),
};

// ── Service Bids
export const serviceBidsAPI = {
  create: (data) => api.post('/service-bids', data),
  getMy: () => api.get('/service-bids/my'),
  getOne: (id) => api.get(`/service-bids/${id}`),
  getDealer: (params) => api.get('/service-bids/dealer', { params }),
  respond: (id, data) => api.put(`/service-bids/${id}`, data),
  buyerAction: (id, data) => api.put(`/service-bids/${id}/buyer`, data),
  confirmOrder: (id) => api.post(`/service-bids/${id}/confirm-order`),
};

// ── Car Orders (purchase flow)
export const carOrdersAPI = {
  create: (data) => api.post('/car-orders', data),
  getMy: () => api.get('/car-orders/my'),
  getDealer: (params) => api.get('/car-orders/dealer', { params }),
  respond: (id, data) => api.put(`/car-orders/${id}/respond`, data),
  complete: (id) => api.put(`/car-orders/${id}/complete`),
  submitReview: (id, data) => api.post(`/car-orders/${id}/review`, data),
};

// ── Push Notifications
export const pushAPI = {
  getVapidKey: () => api.get('/push/vapid-key'),
  subscribe: (subscription) => api.post('/push/subscribe', { subscription }),
  unsubscribe: (endpoint) => api.post('/push/unsubscribe', { endpoint }),
};

// ── WhatsApp Submissions (admin)
export const whatsappAdminAPI = {
  getSubmissions: (params) => api.get('/whatsapp/submissions', { params }),
  reviewSubmission: (id, data) => api.put(`/whatsapp/submissions/${id}`, data),
};

// ── Images
export const imagesAPI = {
  upload: (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    return api.post('/images/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  delete: (filename) => api.delete(`/images/${filename}`),
};

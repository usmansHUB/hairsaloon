const API = import.meta.env.VITE_API_URL || '/api';

let tokenExpiredCallback = null;

export const setTokenExpiredCallback = (callback) => {
  tokenExpiredCallback = callback;
};

const getToken = () => localStorage.getItem('token');

export const api = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Handle token expiry
    if (res.status === 401 && data.tokenExpired) {
      if (tokenExpiredCallback) {
        tokenExpiredCallback();
      }
    }
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const authApi = {
  register: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/auth/me'),
};

export const servicesApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/services${q ? `?${q}` : ''}`);
  },
  getOne: (slug) => api(`/services/${slug}`),
};

export const stylistsApi = {
  getAll: () => api('/stylists'),
  getOne: (id) => api(`/stylists/${id}`),
};

export const appointmentsApi = {
  getSlots: (stylistId, date, serviceIds = []) => {
    const params = new URLSearchParams({ stylistId, date });
    if (serviceIds.length) params.set('serviceIds', serviceIds.join(','));
    return api(`/appointments/slots?${params.toString()}`);
  },
  create: (body) => api('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  mine: () => api('/appointments/mine'),
  cancel: (id) => api(`/appointments/${id}/cancel`, { method: 'PATCH' }),
  all: () => api('/appointments'),
  updateStatus: (id, status) =>
    api(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// In production deployment, VITE_API_BASE_URL points to the live backend (e.g. https://algoorbit.onrender.com/api)
// In local development, it defaults to '/api' for Vite dev proxy forwarding.
const DEFAULT_API_BASE = import.meta.env.DEV
  ? '/api'
  : 'https://algoorbit.onrender.com/api';

let rawBase = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE).trim().replace(/\/+$/, '');
if (rawBase && !rawBase.startsWith('http://') && !rawBase.startsWith('https://') && !rawBase.startsWith('/')) {
  rawBase = `https://${rawBase}`;
}
if (rawBase && (rawBase.startsWith('http://') || rawBase.startsWith('https://')) && !rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}
const API_BASE_URL = rawBase;

export const getAuthToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
      return null;
    }
    return token;
  } catch (_) {
    return null;
  }
};
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};
export const removeAuthToken = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (_) {}
};

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      removeAuthToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (res.status === 429) {
      let retryMsg = 'Too many requests. Please wait a moment before trying again.';
      try {
        const rateData = await res.json();
        if (rateData.detail) {
          retryMsg = rateData.detail;
        }
      } catch (_) {}
      throw new Error(retryMsg);
    }

    if (!res.ok) {
      let errorMsg = res.statusText
        ? `Request failed (${res.status}: ${res.statusText})`
        : `Request failed (HTTP ${res.status})`;

      try {
        const text = await res.text();
        if (text) {
          try {
            const errData = JSON.parse(text);
            if (errData.detail) {
              errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
            } else if (errData.message) {
              errorMsg = errData.message;
            }
          } catch (_) {
            if (res.status === 405 || (text.includes('<!DOCTYPE') && text.includes('html'))) {
              errorMsg = `API endpoint unavailable on this host (HTTP ${res.status}). Ensure VITE_API_BASE_URL points to the live backend.`;
            } else if (text.length < 200) {
              errorMsg = text;
            }
          }
        }
      } catch (_) {}

      if (res.status === 502 || res.status === 503) {
        errorMsg = 'Backend server is waking up from sleep. Please wait 10-15 seconds and try again.';
      }

      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`API Error on [${options.method || 'GET'} ${cleanEndpoint}]:`, err.message);
    }
    throw err;
  }
}

const _cache = new Map();

export const clearApiCache = (prefix = null) => {
  if (!prefix) {
    _cache.clear();
  } else {
    for (const key of _cache.keys()) {
      if (key.includes(prefix)) {
        _cache.delete(key);
      }
    }
  }
};

export const api = {
  get: (endpoint, options = {}) => {
    const ttl = options.cacheTtl !== undefined ? options.cacheTtl : (options.cache ? 120000 : 0);
    if (ttl > 0) {
      const cached = _cache.get(endpoint);
      if (cached && (Date.now() - cached.timestamp < ttl)) {
        return Promise.resolve(cached.data);
      }
    }
    return apiRequest(endpoint, { method: 'GET', ...options }).then((data) => {
      if (ttl > 0) {
        _cache.set(endpoint, { data, timestamp: Date.now() });
      }
      return data;
    });
  },
  cachedGet: (endpoint, ttlMs = 120000) => api.get(endpoint, { cacheTtl: ttlMs }),
  post: (endpoint, body, options = {}) => {
    clearApiCache();
    return apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body), ...options });
  },
  put: (endpoint, body, options = {}) => {
    clearApiCache();
    return apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options });
  },
  delete: (endpoint, options = {}) => {
    clearApiCache();
    return apiRequest(endpoint, { method: 'DELETE', ...options });
  },
  invalidate: clearApiCache
};

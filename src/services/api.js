const API_URL = import.meta.env.VITE_API_URL || 'https://dwello-real-estate-website.onrender.com/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong.')
    error.errors = data.errors
    throw error
  }

  return data
}

const queryString = (params) =>
  new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== undefined && value !== null
    )
  ).toString()

const authHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {}

export const api = {
  getProperties: (params = {}) =>
    request(`/properties?${queryString(params)}`),

  getProperty: (id) =>
    request(`/properties/${id}`),

  register: (body) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  login: (body) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  me: (token) =>
    request('/auth/me', {
      headers: authHeaders(token)
    }),

  createProperty: (body, token) =>
    request('/properties', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body)
    }),

  updateProperty: (id, body, token) =>
    request(`/properties/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(body)
    }),

  deleteProperty: (id, token) =>
    request(`/properties/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    }),

  getFavorites: (token) =>
    request('/favorites', {
      headers: authHeaders(token)
    }),

  addFavorite: (id, token) =>
    request(`/favorites/${id}`, {
      method: 'POST',
      headers: authHeaders(token)
    }),

  removeFavorite: (id, token) =>
    request(`/favorites/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    }),

  createInquiry: (body, token) =>
    request('/inquiries', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body)
    }),

  getInquiries: (token) =>
    request('/inquiries', {
      headers: authHeaders(token)
    }),

  getStats: (token) =>
    request('/dashboard/stats', {
      headers: authHeaders(token)
    })
}
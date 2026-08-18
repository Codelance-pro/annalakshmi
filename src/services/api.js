import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL || 'https://annalakshmi-backend-1.onrender.com'
// export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({ baseURL: `${API_BASE}/api` })

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (formData) => API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
}

export const inquiryAPI = {
  submit: (data) => {
    if (data instanceof FormData) {
      return API.post('/inquiries', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    return API.post('/inquiries', data)
  },
  getAll: () => API.get('/inquiries'),
}

export const statsAPI = {
  get: () => API.get('/stats'),
}

export const otpAPI = {
  sendOtp: (mobile) => API.post('/send-otp', { mobile }),
  verifyOtp: (mobile, otp) => API.post('/verify-otp', { mobile, otp }),
}

export const designAPI = {
  upload: (formData) =>
    API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  saveDesign: (data, token) =>
    API.post('/save-design', data),
  getDesign: (id) => API.get(`/design/${id}`),
  getAll: () => API.get('/designs'),
  downloadExcel: () =>
    API.get('/designs/export', { responseType: 'blob' }),
}

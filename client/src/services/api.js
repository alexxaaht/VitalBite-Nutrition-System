import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const menuService = {
  getCategories: async () => {
    const response = await api.get('/menu/categories');
    return response.data;
  },
  getDishes: async (categorySlug = 'all') => {
    const params = categorySlug !== 'all' ? { category: categorySlug } : {};
    const response = await api.get('/menu', { params });
    return response.data;
  },
  addDish: async (dishData) => {
    const response = await api.post('/menu', dishData);
    return response.data;
  },
  deleteDish: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },
  updateDish: async (id, dishData) => {
    const response = await api.put(`/menu/${id}`, dishData);
    return response.data;
  }
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get('/orders/all');
    return response.data;
  },
  updateStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }
};

export const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export default api;



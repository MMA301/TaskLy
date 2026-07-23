import axios from 'axios';
import { Platform } from 'react-native';
import { getAuthSession, clearAuthSession } from '../src/session/authSession';

const getBaseURL = () => {
  let envUrl = process.env.EXPO_PUBLIC_API;
  if (!envUrl) {
    envUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';
  } else {
    // Ensure the URL has the /api suffix required by the backend router
    if (!envUrl.endsWith('/api') && !envUrl.endsWith('/api/')) {
      envUrl = envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`;
    }
  }

  // Auto-resolve localhost/127.0.0.1 for Android emulator to reference host system port
  if (Platform.OS === 'android' && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
    return envUrl.replace('localhost', '10.0.2.2').replace('127.0.0.1', '10.0.2.2');
  }

  return envUrl;
};

// Setup preconfigured Axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject bearer auth token dynamically if stored in session
api.interceptors.request.use(
  (config) => {
    const session = getAuthSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to strip the standard backend success/error wrapper format
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Đã xảy ra lỗi kết nối!';
    const status = error.response?.status;

    // Trigger auto-logout on token expiration or invalidity
    if (status === 401) {
      clearAuthSession();
    }

    return Promise.reject({
      message,
      status,
      originalError: error,
    });
  }
);

// Type declarations
export interface RegisterData {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'customer' | 'tasker' | 'admin';
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface TaskData {
  categoryId: string;
  title: string;
  description?: string;
  address: string;
  price: number;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  time?: string;
  duration?: string;
}

// Named API services matching backend routing groups
export const authApi = {
  login: (data: LoginData) => api.post('/auth/login', data),
  register: (data: RegisterData) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: Partial<RegisterData>) => api.patch('/users/me', data),
  updateTaskerProfile: (data: any) => api.patch('/users/me/tasker-profile', data),
};

export const taskApi = {
  getTasks: (params?: any) => api.get('/tasks', { params }),
  getTaskById: (id: string) => api.get(`/tasks/${id}`),
  createTask: (data: TaskData) => api.post('/tasks', data),
  updateTask: (id: string, data: Partial<TaskData>) => api.patch(`/tasks/${id}`, data),
  cancelTask: (id: string) => api.patch(`/tasks/${id}/cancel`),
  startTask: (id: string) => api.patch(`/tasks/${id}/start`),
  completeTask: (id: string) => api.patch(`/tasks/${id}/complete`),
  submitProof: (id: string, completedImage: string) => api.patch(`/tasks/${id}/submit-proof`, { completedImage }),
};

export const categoryApi = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id: string) => api.get(`/categories/${id}`),
};

export const taskApplicationApi = {
  applyTask: (data: { taskId: string; bidPrice: number }) => api.post('/task-applications/apply', data),
  cancelApplyTask: (id: string) => api.patch(`/task-applications/${id}/cancel`),
  acceptApplication: (id: string) => api.patch(`/task-applications/${id}/accept`),
  rejectApplication: (id: string) => api.patch(`/task-applications/${id}/reject`),
  getApplications: (params?: { taskId?: string; taskerId?: string; status?: string }) => api.get('/task-applications', { params }),
};

export const paymentApi = {
  createPayment: (data: { taskId: string; amount: number; provider: string; applicationId?: string }) => api.post('/payments', data),
  getMyPayments: (params?: any) => api.get('/payments', { params }),
  getPaymentById: (id: string) => api.get(`/payments/${id}`),
  confirmFakePayment: (data: { paymentId: string }) => api.post('/payments/fake-confirm', data),
  cancelPayment: (id: string) => api.post(`/payments/${id}/cancel`),
  releasePayment: (id: string) => api.post(`/payments/${id}/release`),
  refundPayment: (id: string) => api.post(`/payments/${id}/refund`),
};

export const reviewApi = {
  createReview: (data: { taskId: string; rating: number; comment: string }) => api.post('/reviews', data),
};

export const adminApi = {
  getDashboardSummary: () => api.get('/admin/dashboard'),
  verifyUser: (userId: string) => api.patch(`/users/${userId}/verify`),
  banUser: (userId: string) => api.patch(`/users/${userId}/ban`),
};

export default api;

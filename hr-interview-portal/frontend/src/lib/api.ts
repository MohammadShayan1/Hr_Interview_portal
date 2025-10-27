import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds - Railway may need time to wake up from sleep
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Don't add auth token for public endpoints
      const publicEndpoints = ['/candidates/apply/', '/jobs/public/'];
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        config.url?.includes(endpoint)
      );
      
      if (!isPublicEndpoint) {
        // Wait for auth to be ready
        const user = auth.currentUser;
        if (user) {
          // Force refresh token to ensure it's valid
          const token = await user.getIdToken(true);
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // If no user but trying to make authenticated request, reject
          console.warn('No authenticated user found for API request');
        }
      }
      
      // Don't override Content-Type if it's multipart/form-data
      if (config.headers['Content-Type'] === 'multipart/form-data') {
        // Let axios set the Content-Type with boundary
        delete config.headers['Content-Type'];
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

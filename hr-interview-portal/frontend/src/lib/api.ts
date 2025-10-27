import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Token cache to avoid excessive token refreshes
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
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
        const user = auth.currentUser;
        if (user) {
          // Check if cached token is still valid (refresh 5 minutes before expiry)
          const now = Date.now();
          const shouldRefresh = !cachedToken || (tokenExpiry - now) < 5 * 60 * 1000;
          
          if (shouldRefresh) {
            // Only force refresh if token is expired or close to expiring
            const forceRefresh = tokenExpiry > 0 && (tokenExpiry - now) < 60 * 1000;
            cachedToken = await user.getIdToken(forceRefresh);
            
            // Firebase tokens expire after 1 hour
            tokenExpiry = now + 60 * 60 * 1000;
          }
          
          config.headers.Authorization = `Bearer ${cachedToken}`;
        }
      }
      
      // Don't override Content-Type if it's multipart/form-data
      if (config.headers['Content-Type'] === 'multipart/form-data') {
        delete config.headers['Content-Type'];
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
      // Clear cached token on error
      cachedToken = null;
      tokenExpiry = 0;
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
      // Clear cached token
      cachedToken = null;
      tokenExpiry = 0;
      
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export function to clear token cache (useful for logout)
export const clearTokenCache = () => {
  cachedToken = null;
  tokenExpiry = 0;
};

export default apiClient;

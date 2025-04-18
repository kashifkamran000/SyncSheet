import axios from 'axios';
import store from './redux/store';
import { logout } from '../../store/authSlice';

// Create an instance of Axios
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await api.post('/api/v1/user/refresh-token');
                // Retry the original request
                return api(originalRequest);
            } catch (err) {
                // Refresh token expired or error, logout
                store.dispatch(logout());
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;

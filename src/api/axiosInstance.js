import axios from 'axios';
import refreshToken from './refreshToken';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: 'https://lmssolutions.xyz/api/', 
    headers: {
        'Content-Type': 'application/json',
        
    },
});

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    response => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // Check if the error response is due to an expired token
        if (error.response && error.response.data.code === 'token_not_valid' && !originalRequest._retry) {
            originalRequest._retry = true; // Avoid infinite loops

            try {
                // Try to refresh the token
                const newAccessToken = await refreshToken();
                
                // Retry the original request with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);  // Retry the request
            } catch (refreshError) {
                console.error('Error during token refresh:', refreshError);

                // If refreshing the token fails, log out the user and redirect to login page
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                // Assuming you have a navigate function from useNavigate() in your component
                const navigate = useNavigate();
                navigate('/login');  // Redirect to the login page

                return Promise.reject(refreshError); // Reject if refresh failed
            }
        }

        return Promise.reject(error);  // Reject if it's not token-related or other error
    }
);

export default axiosInstance;

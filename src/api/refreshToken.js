
import axiosInstance from './axiosInstance';

const refreshToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');

    if (!refresh_token) {
        throw new Error('No refresh token found');
    }

    try {
        const response = await axiosInstance.post('token/refresh/', { refresh: refresh_token });
        const { access } = response.data;

        // Save the new access token to localStorage
        localStorage.setItem('token', access);

        return access;  // Return the new access token
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw new Error('Unable to refresh token');
    }
};

export default refreshToken;

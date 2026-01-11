import client from '../client';
import endpoints from '../endpoints';

const authService = {
    login: async (credentials) => {
        const response = await client.post(endpoints.auth.login, credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await client.post(endpoints.auth.register, userData);
        return response.data;
    },

    // Helper to check if token is valid (optional, usually handled by context/interceptor)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;

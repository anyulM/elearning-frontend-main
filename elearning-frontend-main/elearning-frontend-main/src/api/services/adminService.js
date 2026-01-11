import client from '../client';
import endpoints from '../endpoints';

const adminService = {
    getUsers: async () => {
        const response = await client.get(endpoints.admin.users);
        return response.data;
    },

    getUserById: async (id) => {
        const response = await client.get(endpoints.admin.user(id));
        return response.data;
    },

    updateUser: async (id, data) => {
        const response = await client.put(endpoints.admin.user(id), data);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await client.delete(endpoints.admin.user(id));
        return response.data;
    },

    getMonitorData: async () => {
        const response = await client.get(endpoints.admin.monitor);
        return response.data;
    },
};

export default adminService;

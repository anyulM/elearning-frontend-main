import client from '../client';
import endpoints from '../endpoints';

const materialService = {
    upload: async (formData) => {
        const response = await client.post(endpoints.materials.upload, formData);
        return response.data;
    },

    getById: async (id) => {
        const response = await client.get(endpoints.materials.detail(id), {
            responseType: 'blob', // Important for downloading files
        });
        return response;
    },
};

export default materialService;

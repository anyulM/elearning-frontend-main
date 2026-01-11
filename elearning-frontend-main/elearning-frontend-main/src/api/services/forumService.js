import client from '../client';
import endpoints from '../endpoints';

const forumService = {
    create: async (data) => {
        const response = await client.post(endpoints.forums.create, data);
        return response.data;
    },

    getByCourse: async (idCurso) => {
        const response = await client.get(endpoints.forums.getByCourse(idCurso));
        return response.data;
    },

    getById: async (id) => {
        const response = await client.get(endpoints.forums.detail(id));
        return response.data;
    },

    postMessage: async (id, data) => {
        const response = await client.post(endpoints.forums.postMessage(id), data);
        return response.data;
    },

    deleteMessage: async (id) => {
        const response = await client.delete(endpoints.forums.deleteMessage(id));
        return response.data;
    },
};

export default forumService;

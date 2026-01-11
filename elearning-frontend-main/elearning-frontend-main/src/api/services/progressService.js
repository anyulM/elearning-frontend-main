import client from '../client';
import endpoints from '../endpoints';

const progressService = {
    get: async (idCurso) => {
        const response = await client.get(endpoints.progress.get(idCurso));
        return response.data;
    },

    markMaterialComplete: async (idCurso, idMaterial) => {
        const response = await client.put(endpoints.progress.markComplete(idCurso, idMaterial));
        return response.data;
    },

    unmarkMaterialComplete: async (idCurso, idMaterial) => {
        const response = await client.delete(endpoints.progress.markComplete(idCurso, idMaterial));
        return response.data;
    },
};

export default progressService;

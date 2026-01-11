import client from '../client';
import endpoints from '../endpoints';

const evaluationService = {
    create: async (data) => {
        const response = await client.post(endpoints.evaluations.create, data);
        return response.data;
    },

    getByCourse: async (idCurso) => {
        const response = await client.get(endpoints.evaluations.getByCourse(idCurso));
        return response.data;
    },

    getById: async (id) => {
        const response = await client.get(`/evaluaciones/${id}`);
        return response.data;
    },

    submit: async (id, answers) => {
        const response = await client.post(endpoints.evaluations.submit(id), { respuestas: answers });
        return response.data;
    },

    getResults: async (id) => {
        const response = await client.get(endpoints.evaluations.results(id));
        return response.data;
    },

    getEstudiantesResults: async (id) => {
        const response = await client.get(`/evaluaciones/${id}/estudiantes-results`);
        return response.data;
    },
};

export default evaluationService;

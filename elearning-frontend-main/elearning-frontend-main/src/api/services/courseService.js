import client from '../client';
import endpoints from '../endpoints';

const courseService = {
    getAll: async (params = {}) => {
        const response = await client.get(endpoints.courses.list, { params });
        return response.data;
    },

    getById: async (id) => {
        // The backend does not support /api/cursos/:id, so we fetch all and filter.
        const response = await client.get(endpoints.courses.list);
        let courses = [];
        // Handle { data: { cursos: [...] } }
        if (response.data && response.data.data && Array.isArray(response.data.data.cursos)) {
            courses = response.data.data.cursos;
        }
        // Handle { data: [...] } or { cursos: [...] }
        else if (response.data && Array.isArray(response.data.cursos)) {
            courses = response.data.cursos;
        } else if (Array.isArray(response.data)) {
            courses = response.data;
        }

        console.log("Searching for ID:", id, "in courses:", courses.length);

        const course = courses.find(c =>
            String(c.id) === String(id) ||
            String(c.idCurso) === String(id) ||
            String(c._id) === String(id)
        );

        if (!course) {
            throw new Error('Course not found');
        }
        return { data: course }; // Return in expected format
    },

    create: async (courseData) => {
        const response = await client.post(endpoints.courses.create, courseData);
        return response.data;
    },

    enroll: async (id) => {
        const response = await client.post(endpoints.courses.enroll(id));
        return response.data;
    },

    getMaterials: async (id) => {
        const response = await client.get(endpoints.courses.materials(id));
        return response.data;
    },

    getModules: async (id) => {
        const response = await client.get(endpoints.courses.modules(id));
        return response.data;
    },

    update: async (id, courseData) => {
        const response = await client.put(endpoints.courses.update(id), courseData);
        return response.data;
    },

    delete: async (id) => {
        const response = await client.delete(endpoints.courses.delete(id));
        return response.data;
    },

    createModule: async (courseId, moduleData) => {
        const response = await client.post(endpoints.courses.addModule(courseId), moduleData);
        return response.data;
    }
};

export default courseService;

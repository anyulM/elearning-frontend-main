const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
    },
    courses: {
        list: '/cursos',
        create: '/cursos',
        detail: (id) => `/cursos/${id}`,
        enroll: (id) => `/cursos/${id}/inscribirse`,
        materials: (id) => `/cursos/${id}/materiales`,
        modules: (id) => `/cursos/${id}/modulos`,
        addModule: (id) => `/cursos/${id}/modulos`,
        update: (id) => `/cursos/${id}`,
        delete: (id) => `/cursos/${id}`,
    },
    materials: {
        upload: '/materiales/upload',
        detail: (id) => `/materiales/${id}`,
    },
    evaluations: {
        create: '/evaluaciones/create',
        getByCourse: (idCurso) => `/evaluaciones/curso/${idCurso}`,
        submit: (id) => `/evaluaciones/${id}/submit`,
        results: (id) => `/evaluaciones/${id}/results`,
    },
    forums: {
        create: '/foros',
        getByCourse: (idCurso) => `/foros/curso/${idCurso}`,
        myForums: '/foros/mis-foros',
        detail: (id) => `/foros/${id}`,
        postMessage: (id) => `/foros/${id}/mensajes`,
        deleteMessage: (id) => `/foros/mensajes/${id}`,
    },
    progress: {
        get: (idCurso) => `/progreso/${idCurso}`,
        markComplete: (idCurso, idMaterial) => `/progreso/${idCurso}/material/${idMaterial}`,
    },
    reports: {
        generate: (idCurso) => `/reportes/${idCurso}`,
    },
    certificates: {
        download: (idCurso) => `/certificados/${idCurso}`,
    },
    admin: {
        users: '/admin/usuarios',
        user: (id) => `/admin/usuarios/${id}`,
        monitor: '/admin/monitor',
    },
    users: {
        profile: (id) => `/users/profile/${id}`,
        updateProfile: '/users/profile',
    }
};

export default endpoints;

import client from '../client';
import endpoints from '../endpoints';

const reportService = {
    generate: async (idCurso) => {
        const response = await client.get(endpoints.reports.generate(idCurso), {
            responseType: 'blob',
        });
        return response;
    },
};

export const certificateService = {
    download: async (idCurso) => {
        const response = await client.get(endpoints.certificates.download(idCurso), {
            responseType: 'blob',
        });
        return response;
    }
}

export default reportService;

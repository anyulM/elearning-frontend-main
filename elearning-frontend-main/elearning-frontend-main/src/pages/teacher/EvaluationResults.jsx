import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import evaluationService from '../../api/services/evaluationService';
import { useAuth } from '../../context/AuthContext';

const EvaluationResults = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await evaluationService.getEstudiantesResults(id);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching results:', error);
                alert('Error al cargar los resultados');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    if (loading) return <div className="text-center py-10">Cargando...</div>;
    if (!data) return <div className="text-center py-10">No se encontraron resultados</div>;

    const { evaluacion, estudiantes } = data;
    const totalEstudiantes = estudiantes.length;
    const aprobados = estudiantes.filter(e => e.aprobado).length;
    const promedioGeneral = estudiantes.length > 0
        ? Math.round(estudiantes.reduce((sum, e) => sum + e.calificacion, 0) / estudiantes.length)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <div className="bg-teal-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-teal-100 hover:text-white mb-4 flex items-center"
                    >
                        ← Volver
                    </button>
                    <h1 className="text-3xl font-bold mb-2">Resultados de la Evaluación</h1>
                    <p className="text-teal-100">{evaluacion.titulo}</p>
                </div>
            </div>

            {/* Estadísticas generales */}
            <div className="container mx-auto px-4 mt-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-teal-600 mb-2">{totalEstudiantes}</div>
                        <div className="text-gray-600">Estudiantes</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{aprobados}</div>
                        <div className="text-gray-600">Aprobados (≥70%)</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{promedioGeneral}%</div>
                        <div className="text-gray-600">Promedio General</div>
                    </div>
                </div>

                {/* Tabla de resultados */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Resultados por Estudiante</h2>
                    </div>

                    {estudiantes.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Ningún estudiante ha realizado esta evaluación aún
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estudiante
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Correo
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Correctas
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Calificación
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {estudiantes.map((estudiante, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {estudiante.usuario.nombre}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {estudiante.usuario.correo}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="text-sm text-gray-900">
                                                    {estudiante.correctas} / {estudiante.total}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className={`text-lg font-bold ${estudiante.calificacion >= 70 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {estudiante.calificacion}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {estudiante.aprobado ? (
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Aprobado
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                        Reprobado
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Información adicional */}
                <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                Total de preguntas en la evaluación: <strong>{evaluacion.totalPreguntas}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluationResults;

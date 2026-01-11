import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../api/services/courseService';
import evaluationService from '../../api/services/evaluationService';

const GradingPanel = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [evaluations, setEvaluations] = useState([]);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseResponse = await courseService.getById(courseId);
                const courseData = courseResponse.data?.data || courseResponse.data;
                setCourse(courseData.curso || courseData);

                const evalResponse = await evaluationService.getByCourse(courseId);
                const evals = evalResponse.data?.evaluaciones || evalResponse.data || [];
                setEvaluations(evals);

                if (evals.length > 0) {
                    setSelectedEvaluation(evals[0]);
                    await fetchResults(evals[0].id || evals[0].idEvaluacion);
                }
            } catch (error) {
                console.error('Error fetching grading data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const fetchResults = async (evaluationId) => {
        try {
            const response = await evaluationService.getResults(evaluationId);
            setResults(response.data?.resultados || response.data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
            setResults([]);
        }
    };

    const handleEvaluationChange = async (evaluation) => {
        setSelectedEvaluation(evaluation);
        await fetchResults(evaluation.id || evaluation.idEvaluacion);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando calificaciones...</p>
                </div>
            </div>
        );
    }

    const stats = results.length > 0 ? {
        total: results.length,
        average: results.reduce((sum, r) => sum + (r.calificacion || 0), 0) / results.length,
        max: Math.max(...results.map(r => r.calificacion || 0)),
        min: Math.min(...results.map(r => r.calificacion || 0)),
        passed: results.filter(r => (r.calificacion || 0) >= 60).length
    } : null;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => navigate(`/teacher/dashboard`)}
                        className="text-teal-100 hover:text-white mb-4 flex items-center"
                    >
                        ← Volver al Panel Docente
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Panel de Calificaciones</h1>
                    <p className="text-teal-100">{course?.titulo}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar Evaluación
                    </label>
                    {evaluations.length === 0 ? (
                        <p className="text-gray-500">No hay evaluaciones creadas para este curso.</p>
                    ) : (
                        <select
                            value={selectedEvaluation?.id || selectedEvaluation?.idEvaluacion}
                            onChange={(e) => {
                                const selectedEval = evaluations.find(ev =>
                                    (ev.id || ev.idEvaluacion) === parseInt(e.target.value)
                                );
                                handleEvaluationChange(selectedEval);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        >
                            {evaluations.map((evaluation) => (
                                <option
                                    key={evaluation.id || evaluation.idEvaluacion}
                                    value={evaluation.id || evaluation.idEvaluacion}
                                >
                                    {evaluation.titulo} ({evaluation.preguntas?.length || 0} preguntas)
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {selectedEvaluation && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <StatsCard title="Estudiantes" value={stats.total} icon="👥" color="bg-blue-500" />
                        <StatsCard title="Promedio" value={`${stats.average.toFixed(1)}%`} icon="📊" color="bg-purple-500" />
                        <StatsCard title="Máximo" value={`${stats.max}%`} icon="🏆" color="bg-green-500" />
                        <StatsCard title="Mínimo" value={`${stats.min}%`} icon="📉" color="bg-red-500" />
                        <StatsCard title="Aprobados" value={`${stats.passed}/${stats.total}`} icon="✅" color="bg-teal-500" />
                    </div>
                )}

                {selectedEvaluation && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Resultados</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calificación</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correctas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {results.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No hay resultados disponibles aún
                                            </td>
                                        </tr>
                                    ) : (
                                        results.map((result, index) => {
                                            const grade = result.calificacion || 0;
                                            const passed = grade >= 60;
                                            return (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                                {result.Usuario?.nombre?.[0]?.toUpperCase() || 'E'}
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {result.Usuario?.nombre || 'Estudiante'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-2xl font-bold" style={{
                                                            color: grade >= 80 ? '#10b981' : grade >= 60 ? '#eab308' : '#ef4444'
                                                        }}>
                                                            {grade.toFixed(1)}%
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {result.respuestasCorrectas || 0} / {selectedEvaluation.preguntas?.length || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {result.fecha ? new Date(result.fecha).toLocaleDateString('es-ES') : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {passed ? 'Aprobado' : 'Reprobado'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center text-center">
            <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3`}>
                {icon}
            </div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default GradingPanel;

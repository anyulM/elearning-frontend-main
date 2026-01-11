import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import courseService from '../api/services/courseService';
import progressService from '../api/services/progressService';
import { certificateService } from '../api/services/reportService';

const CertificatesPage = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        const fetchCoursesAndProgress = async () => {
            try {
                // Fetch all courses
                const coursesResponse = await courseService.getAll();
                const allCourses = coursesResponse.data?.cursos || coursesResponse.data || [];
                setCourses(allCourses);

                // Check progress for each course
                const completed = [];
                for (const course of allCourses) {
                    try {
                        const courseId = course.id || course.idCurso;
                        const progressData = await progressService.get(courseId);
                        const progress = progressData.data;

                        // Check if course is 100% completed
                        if (progress && progress.porcentaje >= 100) {
                            completed.push({
                                ...course,
                                completedDate: progress.updatedAt || progress.fechaFinalizacion
                            });
                        }
                    } catch (error) {
                        // User not enrolled or no progress
                        console.log(`No progress for course ${course.id || course.idCurso}`);
                    }
                }

                setCompletedCourses(completed);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoursesAndProgress();
    }, []);

    const handleDownloadCertificate = async (courseId, courseName) => {
        setDownloading(courseId);
        try {
            const response = await certificateService.download(courseId);

            // Create blob and download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificado_${courseName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('Error al descargar el certificado. Por favor, intenta de nuevo.');
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando certificados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Mis Certificados</h1>
                        <p className="text-teal-100">Descarga los certificados de los cursos que has completado</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 max-w-4xl">
                {completedCourses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <span className="text-6xl mb-4 block">🎓</span>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Aún no tienes certificados</h2>
                        <p className="text-gray-500 mb-6">
                            Completa tus cursos al 100% para obtener tus certificados.
                        </p>
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-left max-w-md mx-auto">
                            <p className="text-sm text-teal-800">
                                <strong>💡 Consejo:</strong> Para completar un curso debes:
                            </p>
                            <ul className="text-sm text-teal-700 mt-2 ml-4 list-disc">
                                <li>Ver todos los materiales</li>
                                <li>Completar todas las evaluaciones</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Has completado <strong className="text-teal-600">{completedCourses.length}</strong> curso{completedCourses.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {completedCourses.map((course) => {
                                const courseId = course.id || course.idCurso;
                                const isDownloading = downloading === courseId;

                                return (
                                    <div
                                        key={courseId}
                                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-3xl mr-3">🏆</span>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800">{course.titulo}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Completado el {course.completedDate
                                                                ? new Date(course.completedDate).toLocaleDateString('es-ES', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })
                                                                : 'Recientemente'
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                {course.descripcion && (
                                                    <p className="text-sm text-gray-600 mt-2 ml-12">
                                                        {course.descripcion.substring(0, 150)}
                                                        {course.descripcion.length > 150 ? '...' : ''}
                                                    </p>
                                                )}
                                                <div className="flex items-center mt-3 ml-12 text-xs text-gray-500">
                                                    <span className="mr-4">📚 {course.categoria || 'General'}</span>
                                                    <span>👨‍🏫 {course.Usuario?.nombre || course.docente?.nombre || 'Docente'}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadCertificate(courseId, course.titulo)}
                                                disabled={isDownloading}
                                                className="ml-4 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                {isDownloading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Descargando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Descargar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CertificatesPage;

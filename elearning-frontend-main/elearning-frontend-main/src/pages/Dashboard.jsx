import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import courseService from '../api/services/courseService';

const Dashboard = () => {
    // State for authentication context
    // State for authentication context
    // const { user } = useAuth();
    // State for courses
    const [courses, setCourses] = useState([]);
    // State for loading indicator
    const [loading, setLoading] = useState(true);
    // State for error handling
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAll();
                console.log("Dashboard received courses:", response);

                let coursesArray = [];
                if (response.data && Array.isArray(response.data.cursos)) {
                    coursesArray = response.data.cursos;
                } else if (response.data && Array.isArray(response.data)) {
                    coursesArray = response.data;
                } else if (Array.isArray(response)) {
                    coursesArray = response;
                }

                if (coursesArray.length > 0) {
                    // console.log("Structure of first course:", coursesArray[0]);
                }

                setCourses(coursesArray);
            } catch (err) {
                setError('Error al cargar los cursos.');
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Helper to get ID
    const getCourseId = (course) => course.id || course.idCurso || course.courseId || course._id;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Section */}
            <div className="bg-teal-400 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        ¡Bienvenido de nuevo! ¿Listo para tu próxima lección?
                    </h1>
                    <p className="text-teal-100 text-lg">
                        Continúa tu camino de aprendizaje y alcanza tus metas.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">

                {/* Featured Courses Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Cursos destacados</h2>
                        <Link to="/courses" className="text-teal-500 hover:text-teal-600 text-sm font-medium flex items-center">
                            Ver todos <span className="ml-1">→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Cargando cursos...</div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.slice(0, 3).map((course) => {
                                const courseId = getCourseId(course);
                                return (
                                    <div key={courseId || Math.random()} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                                        <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                                            {course.imagenUrl ? (
                                                <img src={course.imagenUrl} alt={course.titulo} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl">📚</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                                                {course.categoria}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">Gratis</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">{course.titulo}</h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.descripcion}</p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                                {course.Usuario?.nombre || course.docente?.nombre || 'Docente'}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Duración flexible
                                            </div>
                                        </div>

                                        <Link
                                            to={`/courses/${courseId}`}
                                            className="block w-full text-center bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2 rounded-lg transition-colors"
                                        >
                                            Continuar curso
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            No se encontraron cursos destacados.
                        </div>
                    )}
                </div>

                {/* Categories or other sections could go here */}
                <div className="mb-10">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Explora por categoría</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {['Tecnología', 'Diseño', 'Negocios', 'Marketing', 'Desarrollo Personal'].map((cat) => (
                            <button key={cat} className="px-6 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition whitespace-nowrap">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;

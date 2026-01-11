import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../api/services/courseService';
import progressService from '../api/services/progressService';

const ProgressPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, in-progress, completed

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await courseService.getAll();
                const allCourses = response.data?.cursos || response.data || [];

                const coursesWithProgress = [];
                for (const course of allCourses) {
                    try {
                        const courseId = course.id || course.idCurso;
                        const progressData = await progressService.get(courseId);

                        if (progressData && progressData.data) {
                            coursesWithProgress.push({
                                ...course,
                                progress: progressData.data
                            });
                        }
                    } catch (error) {
                        // User not enrolled in this course
                    }
                }

                setEnrolledCourses(coursesWithProgress);
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const filteredCourses = enrolledCourses.filter(course => {
        const percentage = course.progress?.porcentaje || 0;
        if (filter === 'completed') return percentage >= 100;
        if (filter === 'in-progress') return percentage > 0 && percentage < 100;
        return true;
    });

    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(c => (c.progress?.porcentaje || 0) >= 100).length;
    const inProgressCourses = enrolledCourses.filter(c => {
        const p = c.progress?.porcentaje || 0;
        return p > 0 && p < 100;
    }).length;
    const averageProgress = totalCourses > 0
        ? enrolledCourses.reduce((sum, c) => sum + (c.progress?.porcentaje || 0), 0) / totalCourses
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando progreso...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Mi Progreso</h1>
                    <p className="text-teal-100">Seguimiento de tu avance en los cursos</p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Cursos"
                        value={totalCourses}
                        icon="📚"
                        color="bg-blue-500"
                    />
                    <StatsCard
                        title="En Progreso"
                        value={inProgressCourses}
                        icon="⏳"
                        color="bg-yellow-500"
                    />
                    <StatsCard
                        title="Completados"
                        value={completedCourses}
                        icon="✅"
                        color="bg-green-500"
                    />
                    <StatsCard
                        title="Progreso Promedio"
                        value={`${Math.round(averageProgress)}%`}
                        icon="📊"
                        color="bg-purple-500"
                    />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Todos ({totalCourses})
                        </button>
                        <button
                            onClick={() => setFilter('in-progress')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'in-progress'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            En Progreso ({inProgressCourses})
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'completed'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Completados ({completedCourses})
                        </button>
                    </div>
                </div>

                {/* Courses List */}
                {filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <span className="text-6xl mb-4 block">📖</span>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            {filter === 'all' ? 'No estás inscrito en ningún curso' :
                                filter === 'completed' ? 'No has completado ningún curso aún' :
                                    'No tienes cursos en progreso'}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Explora nuestro catálogo y comienza tu aprendizaje
                        </p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                        >
                            Ver Cursos Disponibles
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredCourses.map((course) => {
                            const courseId = course.id || course.idCurso;
                            const percentage = course.progress?.porcentaje || 0;
                            const materialsViewed = course.progress?.materialesVistos?.length || 0;
                            const totalMaterials = course.progress?.totalMateriales || 0;

                            return (
                                <div
                                    key={courseId}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/courses/${courseId}`)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{course.titulo}</h3>
                                            <p className="text-sm text-gray-500">
                                                {course.categoria} • {course.Usuario?.nombre || course.docente?.nombre || 'Docente'}
                                            </p>
                                        </div>
                                        <CircularProgress percentage={percentage} />
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Progreso del curso</span>
                                            <span className="font-semibold">{Math.round(percentage)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-green-500' :
                                                        percentage >= 50 ? 'bg-yellow-500' :
                                                            'bg-teal-500'
                                                    }`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <span className="mr-2">📄</span>
                                            <span>{materialsViewed}/{totalMaterials} materiales</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="mr-2">
                                                {percentage >= 100 ? '🏆' : percentage > 0 ? '⏳' : '🔒'}
                                            </span>
                                            <span>
                                                {percentage >= 100 ? 'Completado' :
                                                    percentage > 0 ? 'En progreso' :
                                                        'No iniciado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`${color} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}>
                {icon}
            </div>
        </div>
    </div>
);

// Circular Progress Component
const CircularProgress = ({ percentage }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                />
                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke={percentage >= 100 ? '#10b981' : percentage >= 50 ? '#eab308' : '#0d9488'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">{Math.round(percentage)}%</span>
            </div>
        </div>
    );
};

export default ProgressPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../api/services/courseService';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const response = await courseService.getAll();
                let allCourses = [];
                if (response.data && Array.isArray(response.data.cursos)) {
                    allCourses = response.data.cursos;
                } else if (response.data && Array.isArray(response.data)) {
                    allCourses = response.data;
                } else if (Array.isArray(response)) {
                    allCourses = response;
                }

                // Filter courses created by this teacher
                const myCourses = allCourses.filter(c =>
                    String(c.idDocente) === String(user.id) ||
                    String(c.idDocente) === String(user.idUsuario) ||
                    (c.Usuario && (String(c.Usuario.id) === String(user.id)))
                );

                setCourses(myCourses);
            } catch (err) {
                console.error("Error fetching teacher courses", err);
                setError("Error al cargar tus cursos.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyCourses();
        }
    }, [user]);

    const handleDelete = async (courseId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
            try {
                await courseService.delete(courseId);
                setCourses(courses.filter(c => (c.id || c.idCurso || c._id) !== courseId));
                alert('Curso eliminado correctamente');
            } catch (err) {
                console.error("Error deleting course", err);
                alert('Error al eliminar el curso');
            }
        }
    };

    const getCourseId = (course) => course.id || course.idCurso || course.courseId || course._id;

    if (loading) return <div className="text-center py-10">Cargando tus cursos...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Panel de Docente</h1>
                <Link to="/teacher/courses/new" className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">
                    + Crear Nuevo Curso
                </Link>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Mis Cursos</h2>
                {courses.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <p>No has creado ningún curso todavía.</p>
                        <Link to="/teacher/courses/new" className="text-teal-600 font-medium hover:underline mt-2 inline-block">
                            ¡Crea tu primer curso ahora!
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alumnos</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {courses.map((course) => {
                                    const id = getCourseId(course);
                                    return (
                                        <tr key={id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center text-xl">
                                                        {course.imagenUrl ? <img src={course.imagenUrl} alt="" className="h-10 w-10 rounded object-cover" /> : '📚'}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{course.titulo}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{course.descripcion}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                                                    {course.categoria}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {/* Placeholder for student count if available */}
                                                -
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/courses/${id}`} className="text-teal-600 hover:text-teal-900 mr-4">Ver</Link>
                                                <Link to={`/teacher/courses/edit/${id}`} className="text-blue-600 hover:text-blue-900 mr-4">Editar</Link>
                                                <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;

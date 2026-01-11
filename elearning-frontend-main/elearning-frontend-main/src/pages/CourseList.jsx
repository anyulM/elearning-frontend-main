import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../api/services/courseService';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAll();
                console.log('API Response for courses:', data);

                let coursesArray = [];
                if (data.data && Array.isArray(data.data.cursos)) {
                    coursesArray = data.data.cursos;
                } else if (data.data && Array.isArray(data.data)) {
                    coursesArray = data.data;
                } else if (Array.isArray(data)) {
                    coursesArray = data;
                }

                if (coursesArray.length > 0) {
                    // console.log("Structure of first course (CourseList):", coursesArray[0]);
                }

                setCourses(coursesArray);
            } catch (err) {
                setError('Error al cargar los cursos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? course.categoria === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    // Extract unique categories for filter
    const categories = [...new Set(courses.map(course => course.categoria).filter(Boolean))];

    // Helper to get ID
    const getCourseId = (course) => course.id || course.idCurso || course.courseId || course._id;

    if (loading) return <div className="text-center py-10">Cargando cursos...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Cursos Disponibles</h2>

            {/* Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Buscar por título..."
                    className="p-2 border rounded-lg flex-grow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="p-2 border rounded-lg"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                    const courseId = getCourseId(course);
                    return (
                        <div key={courseId || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {/* Course Image */}
                            <div className="h-48 bg-gray-200 overflow-hidden">
                                {course.imagenUrl ? (
                                    <img src={course.imagenUrl} alt={course.titulo} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <span className="text-5xl">📚</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                                        {course.categoria}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">{course.titulo}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">{course.descripcion}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Docente: {course.Usuario?.nombre || course.docente?.nombre || 'N/A'}</span>
                                    <Link
                                        to={`/courses/${courseId}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {filteredCourses.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No se encontraron cursos que coincidan con tu búsqueda.
                </div>
            )}
        </div>
    );
};

export default CourseList;

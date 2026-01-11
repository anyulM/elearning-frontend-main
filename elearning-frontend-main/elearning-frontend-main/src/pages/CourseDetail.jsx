import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../api/services/courseService';
import progressService from '../api/services/progressService';
import materialService from '../api/services/materialService';
import forumService from '../api/services/forumService';
import evaluationService from '../api/services/evaluationService';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('contenido');
    const [enrolling, setEnrolling] = useState(false);
    const [expandedModuleId, setExpandedModuleId] = useState(null);

    // Forum state
    const [forums, setForums] = useState([]);
    const [showCreateForum, setShowCreateForum] = useState(false);
    const [newForumTitle, setNewForumTitle] = useState('');
    const [newForumDescription, setNewForumDescription] = useState('');
    const [creatingForum, setCreatingForum] = useState(false);

    // Evaluation state
    const [evaluations, setEvaluations] = useState([]);
    const [showCreateEvaluation, setShowCreateEvaluation] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                console.log("Fetching course with ID:", id);
                const response = await courseService.getById(id);

                let courseData = null;
                if (response.data && response.data.data) {
                    courseData = response.data.data;
                } else if (response.data) {
                    courseData = response.data;
                } else {
                    courseData = response;
                }

                if (courseData && courseData.curso) {
                    courseData = courseData.curso;
                }

                setCourse(courseData);

                if (user) {
                    try {
                        // Fetch Modules instead of flat materials
                        const modulesData = await courseService.getModules(id);
                        console.log("Modules response:", modulesData);
                        // Handle response structure for modules
                        let modulesArray = [];
                        if (modulesData.data && Array.isArray(modulesData.data)) {
                            modulesArray = modulesData.data;
                        } else if (modulesData.data && modulesData.data.modulos && Array.isArray(modulesData.data.modulos)) {
                            modulesArray = modulesData.data.modulos;
                        } else if (Array.isArray(modulesData)) {
                            modulesArray = modulesData;
                        }
                        setModules(modulesArray);

                        const progressData = await progressService.get(id);
                        setProgress(progressData.data);
                    } catch (e) {
                        console.log("User likely not enrolled or error fetching details", e);
                    }
                }
            } catch (err) {
                console.error('Error loading course', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, user]);

    // Fetch forums when forums tab is active
    useEffect(() => {
        if (activeTab === 'foros' && id) {
            const fetchForums = async () => {
                try {
                    const response = await forumService.getByCourse(id);
                    setForums(response.data?.foros || response.data || []);
                } catch (error) {
                    console.error('Error fetching forums:', error);
                }
            };
            fetchForums();
        }
    }, [activeTab, id]);

    // Fetch evaluations when evaluations tab is active
    useEffect(() => {
        if (activeTab === 'evaluaciones' && id) {
            const fetchEvaluations = async () => {
                try {
                    const response = await evaluationService.getByCourse(id);
                    setEvaluations(response.data?.evaluaciones || response.data || []);
                } catch (error) {
                    console.error('Error fetching evaluations:', error);
                }
            };
            fetchEvaluations();
        }
    }, [activeTab, id]);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setEnrolling(true);
        try {
            await courseService.enroll(id);
            alert('Inscripción exitosa!');
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || 'Error al inscribirse');
        } finally {
            setEnrolling(false);
        }
    };

    const handleDownloadMaterial = async (materialId, filename) => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:8080/api/materiales/${materialId}?download=true`;
            console.log('Descargando material:', { materialId, filename, url });
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
            console.log('✅ Material descargado exitosamente');
        } catch (error) {
            console.error('Error downloading material:', error);
            alert(`Error al descargar el material: ${error.message}`);
        }
    };

    const handleMarkComplete = async (materialId) => {
        try {
            const isCompleted = isMaterialCompleted(materialId);
            console.log(`${isCompleted ? 'Desmarcando' : 'Marcando'} material:`, { materialId, courseId: id });
            if (isCompleted) {
                await progressService.unmarkMaterialComplete(id, materialId);
            } else {
                await progressService.markMaterialComplete(id, materialId);
            }
            const progressData = await progressService.get(id);
            console.log('Progreso actualizado:', progressData);
            setProgress(progressData.data);
        } catch (error) {
            console.error("Error toggling material", error);
            alert(`Error al actualizar material: ${error.response?.data?.message || error.message}`);
        }
    };

    const isMaterialCompleted = (materialId) => {
        if (!progress || !progress.materialesVistos) return false;
        return progress.materialesVistos.includes(parseInt(materialId));
    };

    const toggleModule = (moduleId) => {
        setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
    };

    const handleCreateForum = async (e) => {
        e.preventDefault();
        if (!newForumTitle.trim()) return;

        setCreatingForum(true);
        try {
            await forumService.create({
                tema: newForumTitle,  // Backend expects 'tema', not 'titulo'
                idCurso: parseInt(id)
            });

            // Refresh forums list
            const response = await forumService.getByCourse(id);
            setForums(response.data?.foros || response.data || []);

            // Reset form
            setNewForumTitle('');
            setNewForumDescription('');
            setShowCreateForum(false);
            alert('Foro creado exitosamente');
        } catch (error) {
            console.error('Error creating forum:', error);
            alert('Error al crear el foro');
        } finally {
            setCreatingForum(false);
        }
    };

    if (loading) return <div className="text-center py-10">Cargando...</div>;
    if (!course) return <div className="text-center py-10">Curso no encontrado</div>;

    const isTeacher = user && course && (
        String(user.id) === String(course.idDocente) ||
        String(user.idUsuario) === String(course.idDocente) ||
        (course.Usuario && (String(user.id) === String(course.Usuario.id) || String(user.idUsuario) === String(course.Usuario.id)))
    );

    const isEnrolled = modules.length > 0 || (progress !== null) || isTeacher;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Course Header */}
            <div className="bg-teal-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block bg-teal-700 text-xs px-2 py-1 rounded mb-4">
                            {course.categoria}
                        </span>
                        <h1 className="text-4xl font-bold mb-4">{course.titulo}</h1>
                        <p className="text-teal-100 text-lg mb-6">{course.descripcion}</p>

                        <div className="flex items-center text-sm text-teal-200 mb-6">
                            <span className="mr-6">👤 {course.Usuario?.nombre || course.docente?.nombre || 'Docente'}</span>
                            <span>📅 Actualizado recientemente</span>
                        </div>

                        {!isEnrolled ? (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg"
                            >
                                {enrolling ? 'Inscribiendo...' : 'Inscribirse Gratis'}
                            </button>
                        ) : (
                            <div className="bg-teal-700 rounded-lg p-4 max-w-md">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Tu progreso</span>
                                    <span>{progress?.porcentaje || 0}%</span>
                                </div>
                                <div className="w-full bg-teal-900 rounded-full h-2.5">
                                    <div
                                        className="bg-teal-300 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${progress?.porcentaje || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            {isEnrolled && (
                <div className="container mx-auto px-4 -mt-0">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md min-h-[400px]">
                        <div className="flex border-b">
                            <button
                                className={`px-6 py-4 font-medium ${activeTab === 'contenido' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('contenido')}
                            >
                                Contenido
                            </button>
                            <button
                                className={`px-6 py-4 font-medium ${activeTab === 'evaluaciones' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('evaluaciones')}
                            >
                                Evaluaciones
                            </button>
                            <button
                                className={`px-6 py-4 font-medium ${activeTab === 'foros' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('foros')}
                            >
                                Foros
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'contenido' && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Módulos del Curso</h3>
                                    {modules.length === 0 ? (
                                        <p className="text-gray-500">No hay módulos disponibles aún.</p>
                                    ) : (
                                        modules.map((module) => (
                                            <div key={module.id} className="border rounded-lg overflow-hidden mb-4">
                                                <button
                                                    onClick={() => toggleModule(module.id)}
                                                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                                >
                                                    <span className="font-semibold text-gray-800">{module.titulo}</span>
                                                    <span className="text-gray-500">{expandedModuleId === module.id ? '▲' : '▼'}</span>
                                                </button>

                                                {expandedModuleId === module.id && (
                                                    <div className="p-4 bg-white border-t">
                                                        {module.materiales && module.materiales.length > 0 ? (
                                                            <ul className="space-y-3">
                                                                {module.materiales.map((material) => (
                                                                    <li key={material.idMaterial || material.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="mr-3 h-5 w-5 text-teal-600"
                                                                                checked={isMaterialCompleted(material.idMaterial || material.id)}
                                                                                onChange={() => handleMarkComplete(material.idMaterial || material.id)}
                                                                            />
                                                                            <span className="text-xl mr-3">
                                                                                {material.tipo === 'video' ? '🎥' : material.tipo === 'pdf' ? '📄' : '🔗'}
                                                                            </span>
                                                                            <div>
                                                                                <p className={`text-sm font-medium ${isMaterialCompleted(material.idMaterial || material.id) ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{material.titulo}</p>
                                                                                <p className="text-xs text-gray-500 uppercase">{material.tipo}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center space-x-3">
                                                                            <button
                                                                                onClick={() => handleDownloadMaterial(material.idMaterial || material.id, material.titulo)}
                                                                                className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                                                                            >
                                                                                Descargar
                                                                            </button>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-500 italic">Este módulo no tiene materiales.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'evaluaciones' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-800">Evaluaciones</h3>
                                        {isTeacher && (
                                            <button
                                                onClick={() => navigate(`/teacher/evaluations/create/${id}`)}
                                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                                            >
                                                + Crear Evaluación
                                            </button>
                                        )}
                                    </div>

                                    {evaluations.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">
                                            <p>No hay evaluaciones disponibles aún.</p>
                                            {isTeacher && <p className="text-sm mt-2">Crea la primera evaluación para evaluar a tus estudiantes.</p>}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {evaluations.map((evaluation) => (
                                                <div
                                                    key={evaluation.id || evaluation.idEvaluacion}
                                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800 text-lg mb-1">{evaluation.titulo}</h4>
                                                            {evaluation.descripcion && (
                                                                <p className="text-sm text-gray-600 mb-2">{evaluation.descripcion}</p>
                                                            )}
                                                            <div className="flex items-center text-xs text-gray-500 space-x-4">
                                                                <span>📝 {evaluation.preguntas?.length || 0} preguntas</span>
                                                                <span>⏱️ {evaluation.duracion || 'Sin límite'} min</span>
                                                                {evaluation.fechaLimite && (
                                                                    <span>📅 Hasta: {new Date(evaluation.fechaLimite).toLocaleDateString('es-ES')}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const evalId = evaluation.id || evaluation.idEvaluacion;
                                                                if (isTeacher || user?.rol === 'admin') {
                                                                    navigate(`/evaluations/${evalId}/results`);
                                                                } else {
                                                                    navigate(`/evaluations/${evalId}`);
                                                                }
                                                            }}
                                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm"
                                                        >
                                                            {isTeacher || user?.rol === 'admin' ? 'Ver Resultados' : 'Realizar'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'foros' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-800">Foros de Discusión</h3>
                                        {isTeacher && (
                                            <button
                                                onClick={() => setShowCreateForum(!showCreateForum)}
                                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                                            >
                                                {showCreateForum ? 'Cancelar' : '+ Crear Foro'}
                                            </button>
                                        )}
                                    </div>

                                    {showCreateForum && (
                                        <form onSubmit={handleCreateForum} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título del Foro</label>
                                                    <input
                                                        type="text"
                                                        value={newForumTitle}
                                                        onChange={(e) => setNewForumTitle(e.target.value)}
                                                        placeholder="Ej: Dudas sobre el Módulo 1"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                                                    <textarea
                                                        value={newForumDescription}
                                                        onChange={(e) => setNewForumDescription(e.target.value)}
                                                        placeholder="Describe el tema del foro..."
                                                        rows="3"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                                    ></textarea>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={creatingForum}
                                                    className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                                                >
                                                    {creatingForum ? 'Creando...' : 'Crear Foro'}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {forums.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">
                                            <p>No hay foros disponibles aún.</p>
                                            {isTeacher && <p className="text-sm mt-2">Crea el primer foro para comenzar las discusiones.</p>}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {forums.map((forum) => (
                                                <div
                                                    key={forum.id || forum.idForo}
                                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                                    onClick={() => navigate(`/forums/${forum.id || forum.idForo}`)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800 text-lg mb-1">{forum.tema}</h4>
                                                            {forum.descripcion && (
                                                                <p className="text-sm text-gray-600 mb-2">{forum.descripcion}</p>
                                                            )}
                                                            <div className="flex items-center text-xs text-gray-500 space-x-4">
                                                                <span>💬 {forum.mensajesCount || forum.Mensajes?.length || 0} mensajes</span>
                                                                <span>👤 Creado por {forum.Usuario?.nombre || 'Docente'}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-400">→</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../api/services/courseService';
import materialService from '../../api/services/materialService';

const CourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [courseData, setCourseData] = useState({
        titulo: '',
        descripcion: '',
        categoria: '',
        imagenUrl: ''
    });
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('info'); // info, modules

    // New Module State
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [showModuleForm, setShowModuleForm] = useState(false);

    // New Material State
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [materialFile, setMaterialFile] = useState(null);
    const [materialTitle, setMaterialTitle] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const fetchCourse = async () => {
                try {
                    // Fetch course details
                    const response = await courseService.getById(id);
                    let data = response.data;
                    if (data.data) data = data.data; // Handle nested data
                    if (data.curso) data = data.curso; // Handle nested curso object

                    setCourseData({
                        titulo: data.titulo || '',
                        descripcion: data.descripcion || '',
                        categoria: data.categoria || '',
                        imagenUrl: data.imagenUrl || ''
                    });

                    // Fetch modules
                    try {
                        const modulesResponse = await courseService.getModules(id);
                        let mods = [];
                        if (modulesResponse.data && Array.isArray(modulesResponse.data)) mods = modulesResponse.data;
                        else if (modulesResponse.data && modulesResponse.data.modulos) mods = modulesResponse.data.modulos;
                        else if (Array.isArray(modulesResponse)) mods = modulesResponse;
                        setModules(mods);
                    } catch (e) {
                        console.log("No modules found or error fetching modules");
                    }

                } catch (error) {
                    console.error("Error fetching course", error);
                    alert("Error al cargar el curso");
                } finally {
                    setLoading(false);
                }
            };
            fetchCourse();
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditing) {
                await courseService.update(id, courseData);
                alert('Curso actualizado correctamente');
            } else {
                const newCourse = await courseService.create(courseData);
                const newId = newCourse.data?.idCurso || newCourse.data?.id || newCourse.id;
                if (newId) {
                    navigate(`/teacher/courses/edit/${newId}`);
                    // Automatically switch to modules tab after create? Maybe just let them stay on edit page
                } else {
                    navigate('/teacher/dashboard');
                }
            }
        } catch (error) {
            console.error("Error saving course", error);
            alert("Error al guardar el curso");
        } finally {
            setSaving(false);
        }
    };

    const handleCreateModule = async (e) => {
        e.preventDefault();
        if (!newModuleTitle.trim()) return;
        const nextOrder = modules.length + 1;
        try {
            await courseService.createModule(id, {
                titulo: newModuleTitle,
                orden: nextOrder,
                descripcion: '' // Optional but good to send
            });
            setNewModuleTitle('');
            setShowModuleForm(false);
            // Refresh modules
            const modulesResponse = await courseService.getModules(id);
            let mods = [];
            if (modulesResponse.data && Array.isArray(modulesResponse.data)) mods = modulesResponse.data;
            else if (modulesResponse.data && modulesResponse.data.modulos) mods = modulesResponse.data.modulos;
            else if (Array.isArray(modulesResponse)) mods = modulesResponse;
            setModules(mods);
        } catch (error) {
            console.error("Error creating module", error);
            alert("Error al crear el módulo");
        }
    };

    const handleUploadMaterial = async (e) => {
        e.preventDefault();
        console.log("Uploading material...", { materialFile, materialTitle, selectedModuleId });

        if (!materialFile || !materialTitle || !selectedModuleId) {
            alert("Por favor completa todos los campos del material.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', materialFile);
        formData.append('titulo', materialTitle);
        formData.append('idModulo', selectedModuleId);

        // Determine file type
        let type = 'doc';
        if (materialFile.type.includes('pdf')) type = 'pdf';
        else if (materialFile.type.includes('image')) type = 'image';
        else if (materialFile.type.includes('video')) type = 'video';

        formData.append('tipo', type);
        formData.append('duracionMinutos', '0');

        try {
            console.log('=== SUBIENDO MATERIAL ===');
            console.log('FormData contenido:', {
                file: materialFile.name,
                titulo: materialTitle,
                idModulo: selectedModuleId,
                tipo: type
            });

            await materialService.upload(formData);

            console.log('✅ Material subido exitosamente');

            // Limpiar formulario
            setMaterialFile(null);
            setMaterialTitle('');
            setSelectedModuleId(null);

            // Resetear el input de archivo
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

            alert('Material subido correctamente');

            // Refresh modules
            console.log('Recargando módulos...');
            const modulesResponse = await courseService.getModules(id);
            console.log('Respuesta de módulos:', modulesResponse);

            let mods = [];
            if (modulesResponse.data && Array.isArray(modulesResponse.data)) mods = modulesResponse.data;
            else if (modulesResponse.data && modulesResponse.data.modulos) mods = modulesResponse.data.modulos;
            else if (Array.isArray(modulesResponse)) mods = modulesResponse;

            console.log('Módulos procesados:', mods);
            console.log('Número de módulos:', mods.length);
            if (mods.length > 0) {
                console.log('Materiales en primer módulo:', mods[0].materiales);
            }

            setModules(mods);
        } catch (error) {
            console.error("Error uploading material", error);
            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            alert(`Error al subir el material: ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

    const getModuleId = (module) => module.id || module.idModulo || module._id;

    if (loading) return <div className="text-center py-10">Cargando...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isEditing && (
                    <div className="flex border-b">
                        <button
                            className={`px-6 py-3 font-medium ${activeTab === 'info' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('info')}
                        >
                            Información Básica
                        </button>
                        <button
                            className={`px-6 py-3 font-medium ${activeTab === 'modules' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('modules')}
                        >
                            Contenido (Módulos)
                        </button>
                    </div>
                )}

                <div className="p-6">
                    {activeTab === 'info' && (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título del Curso</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={courseData.titulo}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        value={courseData.descripcion}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                        <select
                                            name="categoria"
                                            value={courseData.categoria}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            <option value="Tecnología">Tecnología</option>
                                            <option value="Diseño">Diseño</option>
                                            <option value="Negocios">Negocios</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Desarrollo Personal">Desarrollo Personal</option>
                                            <option value="testing">Testing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen (Opcional)</label>
                                        <input
                                            type="text"
                                            name="imagenUrl"
                                            value={courseData.imagenUrl}
                                            onChange={handleChange}
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                                    >
                                        {saving ? 'Guardando...' : (isEditing ? 'Actualizar Curso' : 'Crear Curso')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {activeTab === 'modules' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Módulos del Curso</h3>
                                <button
                                    onClick={() => setShowModuleForm(!showModuleForm)}
                                    className="text-teal-600 hover:text-teal-800 font-medium"
                                >
                                    + Agregar Módulo
                                </button>
                            </div>

                            {showModuleForm && (
                                <form onSubmit={handleCreateModule} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newModuleTitle}
                                            onChange={(e) => setNewModuleTitle(e.target.value)}
                                            placeholder="Nombre del módulo (ej: Introducción)"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-6">
                                {modules.length === 0 ? (
                                    <p className="text-gray-500 italic text-center">No hay módulos creados aún.</p>
                                ) : (
                                    modules.map((module, index) => {
                                        const moduleId = getModuleId(module);
                                        return (
                                            <div key={moduleId || index} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-lg">{module.titulo}</h4>
                                                    <button
                                                        onClick={() => setSelectedModuleId(selectedModuleId === moduleId ? null : moduleId)}
                                                        className="text-sm text-teal-600 hover:underline"
                                                    >
                                                        {selectedModuleId === moduleId ? 'Cancelar subida' : '+ Agregar Material'}
                                                    </button>
                                                </div>

                                                {selectedModuleId === moduleId && (
                                                    <form onSubmit={handleUploadMaterial} className="bg-gray-50 p-4 rounded mb-4 border border-dashed border-teal-300">
                                                        <h5 className="text-sm font-bold mb-2">Subir Material a: {module.titulo}</h5>
                                                        <div className="space-y-3">
                                                            <input
                                                                type="text"
                                                                value={materialTitle}
                                                                onChange={(e) => setMaterialTitle(e.target.value)}
                                                                placeholder="Título del material"
                                                                className="w-full px-3 py-2 border rounded"
                                                                required
                                                            />
                                                            <input
                                                                type="file"
                                                                onChange={(e) => setMaterialFile(e.target.files[0])}
                                                                className="w-full"
                                                                required
                                                            />
                                                            <button
                                                                type="submit"
                                                                disabled={uploading}
                                                                className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700 disabled:opacity-50"
                                                            >
                                                                {uploading ? 'Subiendo...' : 'Subir Archivo'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}

                                                {module.materiales && module.materiales.length > 0 ? (
                                                    <ul className="space-y-2 pl-4 border-l-2 border-gray-100">
                                                        {module.materiales.map(mat => (
                                                            <li key={mat.id} className="text-sm text-gray-600 flex items-center">
                                                                <span className="mr-2">{mat.tipo === 'video' ? '🎥' : mat.tipo === 'pdf' ? '📄' : '🔗'}</span>
                                                                {mat.titulo}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic pl-4">Sin materiales</p>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseEditor;

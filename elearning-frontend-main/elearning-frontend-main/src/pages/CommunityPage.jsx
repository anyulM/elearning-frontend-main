import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import endpoints from '../api/endpoints';

const CommunityPage = () => {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyForums();
    }, []);

    const fetchMyForums = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(endpoints.forums.myForums);

            // El backend envía los datos en response.data.data
            let forumsArray = [];
            if (response.data && Array.isArray(response.data.data)) {
                forumsArray = response.data.data;
            } else if (Array.isArray(response.data)) {
                // Fallback por si el backend envía directamente un array
                forumsArray = response.data;
            }

            setForums(forumsArray);
        } catch (err) {
            console.error('Error al cargar foros:', err);
            setError(err.response?.data?.mensaje || 'Error al cargar los foros');
        } finally {
            setLoading(false);
        }
    };

    const handleForumClick = (forumId) => {
        navigate(`/forums/${forumId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Comunidad</h1>
                    <div className="bg-white rounded-lg shadow p-10 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Cargando foros...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Comunidad</h1>
                    <div className="bg-white rounded-lg shadow p-10 text-center">
                        <span className="text-6xl mb-4 block">⚠️</span>
                        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={fetchMyForums}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Comunidad</h1>

                {Array.isArray(forums) && forums.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-10 text-center">
                        <span className="text-6xl mb-4 block">💬</span>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No hay foros disponibles</h2>
                        <p className="text-gray-500">Inscríbete en un curso para acceder a sus foros de discusión.</p>
                    </div>
                ) : Array.isArray(forums) && forums.length > 0 ? (
                    <div className="grid gap-6">
                        {forums.map((forum) => (
                            <div
                                key={forum.idForo}
                                onClick={() => handleForumClick(forum.idForo)}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                            {forum.titulo}
                                        </h2>
                                        <p className="text-gray-600 mb-3">
                                            {forum.descripcion}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                📚 {forum.curso?.titulo || 'Curso'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                👤 {forum.creador?.nombre || 'Desconocido'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                💬 {forum.mensajes?.length || 0} mensajes
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <span className="text-3xl">💬</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CommunityPage;

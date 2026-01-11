import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import forumService from '../api/services/forumService';
import { useAuth } from '../context/AuthContext';

const ForumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [forum, setForum] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchForumData = async () => {
            try {
                console.log('=== FETCHING FORUM ===');
                console.log('Forum ID:', id);
                const response = await forumService.getById(id);
                console.log('Full Response:', response);
                console.log('Response.data:', response.data);
                console.log('Response.data.foro:', response.data?.foro);
                console.log('Response.data.Mensajes:', response.data?.Mensajes);
                console.log('Response.data.foro.Mensajes:', response.data?.foro?.Mensajes);

                const forumData = response.data?.foro || response.data;
                const messagesData = response.data?.foro?.mensajes || response.data?.mensajes || response.data?.foro?.Mensajes || response.data?.Mensajes || [];

                console.log('Extracted Forum Data:', forumData);
                console.log('Extracted Messages:', messagesData);
                console.log('Messages Count:', messagesData.length);

                setForum(forumData);
                setMessages(messagesData);
            } catch (error) {
                console.error('=== ERROR FETCHING FORUM ===');
                console.error('Error:', error);
                console.error('Error Response:', error.response);
                console.error('Error Data:', error.response?.data);
            } finally {
                setLoading(false);
            }
        };
        fetchForumData();
    }, [id]);

    const handlePostMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setPosting(true);
        try {
            await forumService.postMessage(id, { contenido: newMessage });

            // Refresh messages
            const response = await forumService.getById(id);
            setMessages(response.data?.foro?.mensajes || response.data?.mensajes || response.data?.foro?.Mensajes || response.data?.Mensajes || []);
            setNewMessage('');
        } catch (error) {
            console.error('Error posting message:', error);
            alert('Error al publicar el mensaje');
        } finally {
            setPosting(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) return;

        try {
            await forumService.deleteMessage(messageId);

            // Refresh messages
            const response = await forumService.getById(id);
            setMessages(response.data?.foro?.mensajes || response.data?.mensajes || response.data?.foro?.Mensajes || response.data?.Mensajes || []);
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Error al eliminar el mensaje');
        }
    };

    if (loading) return <div className="text-center py-10">Cargando...</div>;
    if (!forum) return <div className="text-center py-10">Foro no encontrado</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="bg-teal-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-teal-100 hover:text-white mb-4 flex items-center"
                    >
                        ← Volver
                    </button>
                    <h1 className="text-3xl font-bold mb-2">{forum.tema}</h1>
                    {forum.descripcion && (
                        <p className="text-teal-100">{forum.descripcion}</p>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 max-w-4xl">
                {/* New Message Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Publicar Mensaje</h3>
                    <form onSubmit={handlePostMessage}>
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe tu mensaje aquí..."
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 mb-4"
                            required
                        ></textarea>
                        <button
                            type="submit"
                            disabled={posting}
                            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                        >
                            {posting ? 'Publicando...' : 'Publicar'}
                        </button>
                    </form>
                </div>

                {/* Messages List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Mensajes ({messages.length})
                    </h3>

                    {messages.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                            <p>No hay mensajes aún. ¡Sé el primero en comentar!</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            // Solo docentes y administradores pueden eliminar mensajes
                            const canDelete = user && (
                                user.rol === 'docente' ||
                                user.rol === 'admin' ||
                                user.role === 'docente' ||
                                user.role === 'admin'
                            );

                            return (
                                <div key={message.id || message.idMensaje} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                {(message.Usuario?.nombre || message.usuario?.nombre || message.Usuario?.name || message.usuario?.name || 'U')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {message.Usuario?.nombre || message.usuario?.nombre || message.Usuario?.name || message.usuario?.name || 'Usuario'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(message.createdAt || message.fecha).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDeleteMessage(message.id || message.idMensaje)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">{message.contenido}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForumDetail;

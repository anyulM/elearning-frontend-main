import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import endpoints from '../api/endpoints';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        avatar: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                nombre: user.nombre || '',
                email: user.email || '',
                avatar: user.avatar || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                nombre: formData.nombre,
                avatar: formData.avatar,
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            console.log('📤 Actualizando perfil con payload:', payload);
            const response = await client.put(endpoints.users.updateProfile, payload);
            console.log('✅ Respuesta del servidor:', response);

            // Actualizar el usuario en el contexto sin recargar la página
            updateUser({
                nombre: formData.nombre,
                avatar: formData.avatar
            });

            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
            setIsEditing(false);

            // Limpiar campos de contraseña
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));

        } catch (error) {
            console.error("❌ Error updating profile:", error);
            console.error("❌ Error response:", error.response);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar perfil' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center py-10">Cargando perfil...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center mb-8">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl mb-4 md:mb-0 md:mr-6 overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user.nombre?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold text-gray-800">{user.nombre}</h3>
                            <p className="text-gray-600">{user.email}</p>
                            <span className="inline-block mt-2 bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full uppercase font-semibold">
                                {user.rol}
                            </span>
                        </div>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                        >
                            Editar Perfil
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
                                    URL del Avatar
                                </label>
                                <input
                                    type="text"
                                    id="avatar"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="mb-4 border-t pt-4 mt-4">
                                <h4 className="text-gray-700 font-bold mb-2">Cambiar Contraseña (Opcional)</h4>
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm mb-1" htmlFor="password">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        minLength={6}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm mb-1" htmlFor="confirmPassword">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

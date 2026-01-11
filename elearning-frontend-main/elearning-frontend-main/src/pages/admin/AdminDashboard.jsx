import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../api/services/adminService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verify user is admin
        if (user && user.rol !== 'admin') {
            navigate('/dashboard');
            return;
        }

        const fetchStats = async () => {
            try {
                const response = await adminService.getMonitorData();
                console.log('📊 Respuesta completa:', response);
                console.log('📊 response.data:', response.data);

                const statsData = response.data || response;
                console.log('📊 Stats finales:', statsData);
                setStats(statsData);
            } catch (error) {
                console.error('❌ Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

    if (loading) return <div className="text-center py-10">Cargando...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
                    <p className="text-purple-100">Gestiona usuarios y monitorea la actividad del sistema</p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Usuarios"
                        value={stats?.totalUsuarios || 0}
                        icon="👥"
                        color="bg-blue-500"
                    />
                    <StatsCard
                        title="Estudiantes"
                        value={stats?.estudiantes || 0}
                        icon="🎓"
                        color="bg-green-500"
                    />
                    <StatsCard
                        title="Docentes"
                        value={stats?.docentes || 0}
                        icon="👨‍🏫"
                        color="bg-yellow-500"
                    />
                    <StatsCard
                        title="Cursos Activos"
                        value={stats?.cursosActivos || 0}
                        icon="📚"
                        color="bg-purple-500"
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ActionCard
                            title="Gestionar Usuarios"
                            description="Ver, editar y eliminar usuarios del sistema"
                            icon="👤"
                            onClick={() => navigate('/admin/users')}
                            color="bg-blue-600"
                        />
                        <ActionCard
                            title="Ver Cursos"
                            description="Administrar todos los cursos de la plataforma"
                            icon="📖"
                            onClick={() => navigate('/courses')}
                            color="bg-green-600"
                        />
                        <ActionCard
                            title="Reportes"
                            description="Generar reportes de actividad y uso"
                            icon="📊"
                            onClick={() => alert('Funcionalidad en desarrollo')}
                            color="bg-purple-600"
                        />
                    </div>
                </div>

                {/* Recent Activity */}
                {stats?.actividadReciente && stats.actividadReciente.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
                        <div className="space-y-3">
                            {stats.actividadReciente.map((activity, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-2xl mr-3">{activity.icon || '📌'}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{activity.descripcion}</p>
                                        <p className="text-xs text-gray-500">{activity.fecha}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                {icon}
            </div>
        </div>
    </div>
);

// Action Card Component
const ActionCard = ({ title, description, icon, onClick, color }) => (
    <button
        onClick={onClick}
        className="text-left p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-300"
    >
        <div className="flex items-start">
            <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4 flex-shrink-0`}>
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    </button>
);

export default AdminDashboard;

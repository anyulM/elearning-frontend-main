import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header / Navbar */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="bg-teal-400 text-white p-2 rounded-md mr-2 font-bold text-xl">E</div>
                            <span className="text-gray-800 font-bold text-lg tracking-wide">EDUTECNIA</span>
                        </div>
                        <nav className="hidden md:flex space-x-8 text-gray-600">
                            <Link to="/dashboard" className="hover:text-teal-500 transition font-medium">Inicio</Link>
                            <Link to="/courses" className="hover:text-teal-500 transition font-medium">Cursos</Link>
                            <Link to="/my-progress" className="hover:text-teal-500 transition font-medium">Mi progreso</Link>
                            <Link to="/certificates" className="hover:text-teal-500 transition font-medium">Certificados</Link>
                            <Link to="/community" className="hover:text-teal-500 transition font-medium">Comunidad</Link>
                            {(user?.rol === 'docente' || user?.rol === 'admin') && (
                                <Link to="/teacher/dashboard" className="text-teal-600 font-bold hover:text-teal-800 transition">Panel Docente</Link>
                            )}
                            {user?.rol === 'admin' && (
                                <Link to="/admin/dashboard" className="text-purple-600 font-bold hover:text-purple-800 transition">Panel Admin</Link>
                            )}
                        </nav>
                        <div className="flex items-center">
                            <Link to="/profile" className="flex items-center hover:opacity-80 transition">
                                <div className="flex flex-col items-end mr-3">
                                    <span className="text-sm font-semibold text-gray-700">{user?.nombre}</span>
                                    <button onClick={(e) => { e.preventDefault(); logout(); }} className="text-xs text-gray-500 hover:text-red-500">Cerrar sesión</button>
                                </div>
                                <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.nombre?.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;

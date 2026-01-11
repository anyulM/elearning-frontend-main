import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import ProgressPage from './pages/ProgressPage';
import CertificatesPage from './pages/CertificatesPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CourseEditor from './pages/teacher/CourseEditor';
import EvaluationCreator from './pages/teacher/EvaluationCreator';
import ForumDetail from './pages/ForumDetail';
import EvaluationTaker from './pages/EvaluationTaker';
import EvaluationResults from './pages/teacher/EvaluationResults';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import GradingPanel from './pages/teacher/GradingPanel';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/my-progress" element={<ProgressPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/forums/:id" element={<ForumDetail />} />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses/new" element={<CourseEditor />} />
            <Route path="/teacher/courses/edit/:id" element={<CourseEditor />} />
            <Route path="/teacher/evaluations/create/:courseId" element={<EvaluationCreator />} />
            <Route path="/teacher/grading/:courseId" element={<GradingPanel />} />

            {/* Evaluation Routes */}
            <Route path="/evaluations/:id" element={<EvaluationTaker />} />
            <Route path="/evaluations/:id/results" element={<EvaluationResults />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

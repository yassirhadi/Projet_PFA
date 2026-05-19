import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminSidebar from './components/common/AdminSidebar';
import Sidebar from './components/common/Sidebar';

// Pages
import RoleSelection from './pages/RoleSelection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CVPage from './pages/CVPage';
import AnalysePage from './pages/AnalysePage';
import OffrePage from './pages/OffrePage';
import OffrePriveePage from './pages/OffrePriveePage';
import AdminPage from './pages/AdminPage';
import AdminOffresPage from './pages/AdminOffresPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Layout admin — sidebar à gauche comme étudiant
const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-900 text-white flex">
    <AdminSidebar />
    <main className="flex-1 ml-60 p-8 overflow-y-auto min-h-screen">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);

// Layout étudiant
const StudentLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-900 text-white flex">
    <Sidebar />
    <main className="flex-1 ml-60 p-8 overflow-y-auto min-h-screen">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />

          {/* Routes étudiant */}
          <Route path="/dashboard" element={
            <ProtectedRoute><StudentLayout><DashboardPage /></StudentLayout></ProtectedRoute>
          } />
          <Route path="/cv" element={
            <ProtectedRoute><StudentLayout><CVPage /></StudentLayout></ProtectedRoute>
          } />
          <Route path="/analyse" element={
            <ProtectedRoute><StudentLayout><AnalysePage /></StudentLayout></ProtectedRoute>
          } />
          <Route path="/offres" element={
            <ProtectedRoute><StudentLayout><OffrePage /></StudentLayout></ProtectedRoute>
          } />
          <Route path="/offres-privees" element={
            <ProtectedRoute><StudentLayout><OffrePriveePage /></StudentLayout></ProtectedRoute>
          } />

          {/* Routes admin */}
          <Route path="/admin/page" element={
            <ProtectedRoute requireAdmin={true}><AdminLayout><AdminPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/offres" element={
            <ProtectedRoute requireAdmin={true}><AdminLayout><AdminOffresPage /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin" element={<Navigate to="/admin/page" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Pages
import RoleSelection from './pages/RoleSelection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CVPage from './pages/CVPage';
import AnalysePage from './pages/AnalysePage';
import OffrePage from './pages/OffrePage';
import AdminPage from './pages/AdminPage';
import AdminOffresPage from './pages/AdminOffresPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';



// Layout avec Navbar
const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-900 text-white">
    <Navbar />
    <main className="container mx-auto p-4">{children}</main>
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
          <Route path="/admin/register" element={<AdminRegisterPage/>}/>

          {/* Routes protégées - Utilisateur */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv"
            element={
              <ProtectedRoute>
                <Layout><CVPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyse"
            element={
              <ProtectedRoute>
                <Layout><AnalysePage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offres"
            element={
              <ProtectedRoute>
                <Layout><OffrePage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Routes protégées - Admin */}
          <Route
            path="/admin/page"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout><AdminPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/offres"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout><AdminOffresPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/page" replace />} />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          theme="dark"
          autoClose={3000}
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
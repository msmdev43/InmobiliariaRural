// C:\xampp\htdocs\InmobiliariaRural\src\App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Home from "./pages/Home";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/propiedades" element={
          <ProtectedRoute>
            <div>Lista de Propiedades</div>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/propiedades/nueva" element={
          <ProtectedRoute>
            <div>Nueva Propiedad</div>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/consultas" element={
          <ProtectedRoute>
            <div>Lista de Consultas</div>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/configuracion" element={
          <ProtectedRoute>
            <div>Configuración</div>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
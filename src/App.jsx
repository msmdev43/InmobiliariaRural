// C:\xampp\htdocs\InmobiliariaRural\src\App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Home from "./pages/Home";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import PublicarPropiedad from './pages/Admin/Propiedades/PublicarPropiedad';
import ListaPropiedades from './pages/Admin/Propiedades/ListaPropiedades';
import VerPropiedad from './pages/Admin/Propiedades/VerPropiedad';
import VerFicha from './pages/propiedades/VerFicha'; // <-- Importar la ficha pública
import TiposCampos from './pages/Admin/Configuracion/TipoCampos';
import Servicios from './pages/Admin/Configuracion/Servicios';
import Configuracion from './pages/Admin/Configuracion/Configuracion';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/propiedad/:id" element={<VerFicha />} /> {/* <-- Nueva ruta pública */}
        
        {/* Rutas protegidas */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Rutas de Propiedades */}
        <Route path="/admin/propiedades" element={
          <ProtectedRoute>
            <ListaPropiedades />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/propiedades/:id" element={
          <ProtectedRoute>
            <VerPropiedad />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/publicarPropiedad" element={
          <ProtectedRoute>
            <PublicarPropiedad />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/propiedades/editar/:id" element={
          <ProtectedRoute>
            <PublicarPropiedad />
          </ProtectedRoute>
        } />
        
        {/* Rutas de Consultas */}
        <Route path="/admin/consultas" element={
          <ProtectedRoute>
            <div>Lista de Consultas</div>
          </ProtectedRoute>
        } />

        {/* Rutas de Configuración */}
        <Route path="/admin/configuracion" element={
          <ProtectedRoute>
            <Configuracion />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/configuracion/tipos-campos" element={
          <ProtectedRoute>
            <TiposCampos />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/configuracion/servicios" element={
          <ProtectedRoute>
            <Servicios />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
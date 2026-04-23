// C:\xampp\htdocs\InmobiliariaRural\src\App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Home from "./pages/Home";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import PublicarPropiedad from './pages/Admin/Propiedades/PublicarPropiedad';
import EditarPropiedad from './pages/Admin/Propiedades/EditarPropiedad';
import ListaPropiedades from './pages/Admin/Propiedades/ListaPropiedades';
import VerPropiedad from './pages/Admin/Propiedades/VerPropiedad';
import VerFicha from './pages/propiedades/VerFicha';
import PropertiesPage from './pages/PropertiesPage';
import TiposCampos from './pages/Admin/Configuracion/TipoCampos';
import Servicios from './pages/Admin/Configuracion/Servicios';
import Configuracion from './pages/Admin/Configuracion/Configuracion';
import ListaConsultas from "./pages/Admin/Consultas/ListaConsultas";
import ResponderConsultas from "./pages/Admin/Consultas/ResponderConsultas";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/propiedades" element={<PropertiesPage />} />
        {/* ✅ USAR :codigo en lugar de :id o :param */}
        <Route path="/propiedad/:codigo" element={<VerFicha />} />
        <Route path="/admin/login" element={<Login />} />
        
        {/* Rutas protegidas - estas mantienen :id para el panel admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
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
            <EditarPropiedad />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/consultas" element={
          <ProtectedRoute>
            <ListaConsultas />
          </ProtectedRoute>
        } />

        <Route path="/admin/responder" element={
          <ProtectedRoute>
            <ResponderConsultas />
          </ProtectedRoute>
        } />

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
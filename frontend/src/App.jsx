import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Soporte from "./pages/Soporte";
import Configuracion from "./pages/Configuracion";
import UsersPage from "./pages/Users";
import NCheck from "./pages/nCheck";
import CPlant from "./pages/cPLant";
import GPlant from "./pages/gPLant";
import HCheck from "./pages/hCheck";
import Register from "./pages/Register";
import ChecklistTemplateBuilder from "./pages/cPlant";
import MainLayout from "./pages/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <main>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Register />} />

            {/* 🔒 Rutas protegidas */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <MainLayout><Home /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/soporte"
              element={
                <ProtectedRoute>
                  <MainLayout><Soporte /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute>
                  <MainLayout><Configuracion /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <MainLayout><UsersPage /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/nCheck"
              element={
                <ProtectedRoute>
                  <MainLayout><NCheck /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cPlant"
              element={
                <ProtectedRoute>
                  <MainLayout><CPlant /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/gPlant"
              element={
                <ProtectedRoute>
                  <MainLayout><GPlant /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hCheck"
              element={
                <ProtectedRoute>
                  <MainLayout><HCheck /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cplant/:filename"
              element={
                <ProtectedRoute>
                  <ChecklistTemplateBuilder />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

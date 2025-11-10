// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("usuario"));

  if (!user) {
    // Si no hay sesión, redirige al login
    return <Navigate to="/" replace />;
  }

  // Si hay sesión, muestra la página normalmente
  return children;
}

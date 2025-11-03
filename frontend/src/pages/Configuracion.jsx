// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { User, Lock, Moon, Sun, Trash2, BookOpen, Pencil, Check } from "lucide-react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({ nombre: "", email: "", cargo: "", id: null });
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [passwords, setPasswords] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  // 📥 Cargar datos del usuario actual (desde localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // 🌗 Cambiar modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // ✏️ Guardar nombre actualizado
  const guardarNombre = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: user.nombre }),
      });
      const data = await res.json();
      alert(data.mensaje || data.error || "Nombre actualizado correctamente");

      // Actualiza localStorage
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Error actualizando nombre:", err);
      alert("Error al actualizar el nombre");
    }
  };

  // 🔑 Cambiar contraseña
  const cambiarPassword = async () => {
    if (passwords.nueva !== passwords.confirmar) {
      return alert("Las contraseñas nuevas no coinciden");
    }
    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${user.id}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actualPassword: passwords.actual,
            nuevaPassword: passwords.nueva,
          }),
        }
      );
      const data = await res.json();
      alert(data.mensaje || data.error);
    } catch (err) {
      console.error("Error cambiando contraseña:", err);
      alert("Error al cambiar la contraseña");
    }
  };

  // 🚫 Eliminar cuenta
  const eliminarCuenta = async () => {
    if (!confirm("¿Seguro que quieres eliminar tu cuenta?")) return;
    try {
      await fetch(`http://localhost:3000/api/usuarios/${user.id}`, {
        method: "DELETE",
      });
      localStorage.removeItem("user");
      alert("Cuenta eliminada correctamente");
      window.location.href = "/login";
    } catch (err) {
      console.error("Error eliminando cuenta:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Configuración
      </h2>

      {/* Información Personal */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <User className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Información personal
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-center">
          {/* Nombre editable */}
          <div className="flex items-center gap-3">
            {editandoNombre ? (
              <input
                type="text"
                value={user.nombre || ""}
                onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none flex-1"
              />
            ) : (
              <p className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex-1">
                {user.nombre || "Sin nombre"}
              </p>
            )}

            <button
              onClick={async () => {
                if (editandoNombre) await guardarNombre();
                setEditandoNombre(!editandoNombre);
              }}
              className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
              title={editandoNombre ? "Guardar" : "Editar"}
            >
              {editandoNombre ? <Check size={18} /> : <Pencil size={18} />}
            </button>
          </div>

          {/* Correo (solo lectura como texto) */}
          <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {user.email || "correo@ejemplo.com"}
          </div>

          {/* Cargo (solo lectura como texto) */}
          <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {user.cargo || "Usuario del sistema"}
          </div>
        </div>
      </section>

      {/* Cambio de Contraseña */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Cambio de contraseña
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Contraseña actual"
            value={passwords.actual}
            onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })}
            className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={passwords.nueva}
            onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })}
            className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={passwords.confirmar}
            onChange={(e) => setPasswords({ ...passwords, confirmar: e.target.value })}
            className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          onClick={cambiarPassword}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Actualizar contraseña
        </button>
      </section>

      {/* Tema del sistema */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="text-blue-600" /> : <Sun className="text-yellow-500" />}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Tema del sistema
            </h3>
          </div>
          <button
            onClick={toggleDarkMode}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:opacity-80 transition"
          >
            {darkMode ? "Modo oscuro 🌙" : "Modo claro ☀️"}
          </button>
        </div>
      </section>

      {/* Eliminar cuenta */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <Trash2 className="text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Eliminar cuenta
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Esta acción no se puede deshacer. Se eliminarán todos tus datos del sistema.
        </p>
        <button
          onClick={eliminarCuenta}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Eliminar mi cuenta
        </button>
      </section>

      {/* Guía rápida */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Guía rápida / Tutorial
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Aprende cómo usar las funciones principales del sistema paso a paso.
        </p>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Ver guía
        </button>
      </section>
    </div>
  );
}

// src/pages/Users.jsx
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, ArrowLeft, UserCircle2 } from "lucide-react";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"; 
import EditRoleModal from "../components/EditRoleModal";
import { UserContext } from "../context/UserContext";
import UserMenu from "../components/UserMenu";

export default function GUsers() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, nombre: "" });
  const [deleting, setDeleting] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user } = useContext(UserContext);

  const menuRef = useRef(null);

  // 📂 Cargar usuarios desde API
  const fetchUsuarios = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("❌ Error cargando usuarios:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 👉 Eliminar usuario
  const openDeleteModal = (id, nombre) => {
    setToDelete({ id, nombre });
    setDeleteModalVisible(true);
  };
  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalVisible(false);
    setToDelete({ id: null, nombre: "" });
  };
  const confirmDelete = async () => {
    if (!toDelete.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/users/${toDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar usuario");
      setUsuarios((prev) => prev.filter((u) => u.id !== toDelete.id));
      closeDeleteModal();
    } catch (err) {
      console.error("❌ Error eliminando usuario:", err);
      alert("Error eliminando usuario: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // 👉 Abrir modal de edición
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditModalVisible(false);
  };

  // 👉 Guardar cambios
  const handleSaveEdit = async (id, rol_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol_id }),
      });
      if (!res.ok) throw new Error("Error al actualizar usuario");

      // refrescar lista
      await fetchUsuarios();
      closeEditModal();
    } catch (err) {
      console.error("❌ Error guardando cambios:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header con menú de usuario */}
      <div className="flex items-center justify-between relative">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Gestión de Usuarios
        </h1>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white 
                    bg-gradient-to-br from-blue-600 to-blue-800 shadow-md hover:shadow-lg transition-all duration-300"
        >
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Perfil de usuario"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user?.nombre?.charAt(0).toUpperCase() || <UserCircle2 size={24} />
          )}
        </button>

        {/* Menú de usuario */}
        {showUserMenu && (
          <UserMenu
            ref={menuRef}
            user={user}
            setShowUserMenu={setShowUserMenu}
          />
        )}
      </div>

      {/* Botón inicio */}
      <div>
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
          <span className="font-medium text-gray-700">Inicio</span>
        </button>
      </div>

      {/* 📋 Lista de usuarios */}
      <Card className="shadow-lg rounded-2xl border border-gray-200/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-900 py-2">
          <CardTitle className="text-white text-base font-medium">
            Lista de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Correo</th>
                  <th className="p-3 text-left">Rol</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="p-3 font-medium text-gray-800">{u.nombre}</td>
                    <td className="p-3 text-gray-600 truncate max-w-[200px]">
                      {u.email}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                        {u.rol_nombre}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => openDeleteModal(u.id, u.nombre)}
                        className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modales */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        itemName={toDelete.nombre}
        loading={deleting}
        onConfirm={confirmDelete}
      />
      <EditRoleModal
        visible={editModalVisible}
        user={editingUser}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

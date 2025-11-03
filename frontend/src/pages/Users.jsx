// src/pages/Users.jsx
import { useState, useEffect,useContext  } from "react";
import { Edit, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EditRoleModal from "../components/EditRoleModal";
import { UserContext } from "../context/UserContext";

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, nombre: "" });
  const [deleting, setDeleting] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user } = useContext(UserContext);

  // 📂 Cargar usuarios desde API
  const fetchUsuarios = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("❌ Error cargando usuarios:", err);
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 🗑️ Eliminar usuario
  const openDeleteModal = (id, nombre) => {
    setToDelete({ id, nombre });
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setDeleteModalVisible(false);
      setToDelete({ id: null, nombre: "" });
    }
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
      setError("No se pudo eliminar el usuario.");
    } finally {
      setDeleting(false);
    }
  };

  // ✏️ Editar usuario
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditModalVisible(false);
  };

  const handleSaveEdit = async (id, rol_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol_id }),
      });
      if (!res.ok) throw new Error("Error al actualizar usuario");

      await fetchUsuarios();
      closeEditModal();
    } catch (err) {
      console.error("❌ Error guardando cambios:", err);
      setError("No se pudo guardar los cambios.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Gestión de Usuarios
      </h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {loadingList ? (
        <p className="text-center text-gray-500 py-6">Cargando usuarios...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-3 border-b">Nombre</th>
                <th className="p-3 border-b">Correo</th>
                <th className="p-3 border-b">Rol</th>
                <th className="p-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios
                .filter((u) => u.id !== user?.id) // 👈 Excluir al usuario activo
                .map((u, idx) => (
                <tr
                  key={u.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 text-center font-semibold text-gray-700">
                    {u.nombre}
                  </td>
                  <td className="p-3 text-center">{u.email}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                      {u.rol_nombre}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-100 rounded-full transition"
                      >
                        <Edit size={16} /> Editar
                      </button>
                      <button
                        onClick={() => openDeleteModal(u.id, u.nombre)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded-full transition"
                      >
                        <Trash2 size={18} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

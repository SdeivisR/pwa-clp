import { useEffect, useState } from "react";

export default function EditRoleModal({ visible, onClose, user, onSave }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user?.rol_id || "");

  // 📂 Cargar roles desde backend
  useEffect(() => {
    if (!visible) return;
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/roles`);
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("❌ Error cargando roles:", err);
      }
    };
    fetchRoles();
  }, [visible]);

  useEffect(() => {
    setSelectedRole(user?.rol_id || "");
  }, [user]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">Editar Rol de {user?.nombre}</h2>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">Seleccione un rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.rol_nombre}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">    
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(user.id, selectedRole)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

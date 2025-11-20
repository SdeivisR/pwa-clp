import { useEffect, useState } from "react";
import { Edit, Trash2, Eye, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generatePDFFromJSON } from "../helpers/generatePDFFromJSON";
import { generatePDF } from "../utils/pdfGenerator"; 
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ChangeStateModal from "../components/ChangeStateModal";



export default function HCheck() {
    const navigate = useNavigate();
    const [checklists, setChecklists] = useState([]);
    const [search, setSearch] = useState("");
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [toDelete, setToDelete] = useState({ id: null });
    const [deleting, setDeleting] = useState(false);
    const [changeStateModalVisible, setChangeStateModalVisible] = useState(false);
    const [checklistToChange, setChecklistToChange] = useState(null);

  // ✅ Estado para editar checklist
  const [checklistToEdit, setChecklistToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/checklists`)
      .then(res => res.json())
      .then(data => {
        const updatedChecklists = data.map(chk => {
          const contenido = JSON.parse(chk.contenido_json);

          // Si la firma de salida no está, asignamos estado_id = 2 (En Ejecución)
          if (!contenido.firma_salida) {
            return { ...chk, estado_id: 2 };
          }
          return chk;
        });

        setChecklists(updatedChecklists);
      })
      .catch(err => console.error("Error cargando checklists:", err));
  }, []);

  const handleEditChecklist = (chk) => {
    navigate("/ncheck", { state: { checklistId: chk.id } });
    };
  const handleCheckJSON = async (id,estado_id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pdf/generate-pdf/${id}`);
      if (!response.ok) throw new Error("Error obteniendo JSON");

      const checklistJSON = await response.json();

      // 1) convertir a content (groupName -> array fields)
      const content = generatePDFFromJSON(checklistJSON);

      // 2) generar PDF
      const pdfBytes = await generatePDF({
        title: checklistJSON.titulo || `Checklist ${id}`,
        content,
      });

      // 3) descargar
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Checklist_${checklistJSON.placa || id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      // Actualizar estado a "Enviado" (id = 3)
      setChecklists(prev =>
        prev.map(c => (c.id === id ? { ...c, estado_id: 3 } : c))
      );

      // Actualizar en la BD
      await fetch(`${import.meta.env.VITE_API_URL}/checklists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado_id: 4 }),
      });
      window.location.reload();

    } catch (err) {
      console.error("handleCheckJSON error:", err);
    }
  };
  // 👉 Eliminar plantilla (desde la BD y actualizar estado)
  const openDeleteModal = (chk) => {
    setToDelete({ id: chk.id }); // Solo guardamos el id
    setDeleteModalVisible(true);
  };
  // Cerrar modal
  const closeDeleteModal = () => {
    if (deleting) return; // no cerrar mientras se elimina
    setDeleteModalVisible(false);
    setToDelete({ id: null });
  };

  const confirmDelete = async () => {
    if (!toDelete.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/checklists/${toDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Error al eliminar plantilla");
      }

      // Actualizar estado (quitar la plantilla eliminada)
      setChecklists((prev) => prev.filter((p) => p.id !== toDelete.id));

      setDeleteModalVisible(false);
      setToDelete({ id: null });
    } catch (err) {
      console.error("❌ Error eliminando plantilla:", err);
      alert("Error eliminando plantilla: " + err.message);
    } finally {
      setDeleting(false);
    }
  };
  const openChangeStateModal = (chk) => {
    setChecklistToChange(chk);
    setChangeStateModalVisible(true);
  };
  const handleChangeState = async (estado_id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/checklists/${checklistToChange.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado_id }),
      });
      if (!res.ok) throw new Error("Error actualizando checklist");

      // actualizar estado localmente
      setChecklists((prev) =>
        prev.map((chk) =>
          chk.id === checklistToChange.id ? { ...chk, estado_id } : chk
        )
      );

      setChangeStateModalVisible(false);
    } catch (err) {
      console.error("Error actualizando checklist:", err);
      alert(err.message);
    }
  };
  const filteredChecklists = checklists.filter((chk) => {
    const contenido = (() => {
      try {
        return JSON.parse(chk.contenido_json || "{}");
      } catch {
        return {};
      }
    })();

    const text = search.toLowerCase();

    return (
      chk.folio?.toString().toLowerCase().includes(text) ||
      contenido.placa?.toLowerCase().includes(text) ||
      chk.estado_nombre?.toLowerCase().includes(text) ||
      new Date(chk.fecha_creacion)
        .toLocaleString()
        .toLowerCase()
        .includes(text)
    );
  });


  return (
      
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Lista de Checklists
        </h2>
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por plantilla, placa, estado o fecha..."
            className="w-full max-w-md px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
            title="Refrescar"
          >
            <RotateCcw size={18} className="text-gray-600" />
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-3 border-b">N° Plantilla</th>
                <th className="p-3 border-b">Placa</th>
                <th className="p-3 border-b">Estado</th>
                <th className="p-3 border-b">Fecha</th>
                <th className="p-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredChecklists.map((chk, index) => {
                const contenido = JSON.parse(chk.contenido_json);

                return (
                  <tr
                    key={chk.id}
                    className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-200`}
                  >
                    <td className="p-3 text-center font-semibold text-gray-700">{chk.folio}</td>
                    <td className="p-3 text-center">{contenido.placa || "—"}</td>
                    <td className="p-3 text-center">
                    <button
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        chk.estado_nombre === "Pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : chk.estado_nombre === "En Ejecución"
                          ? "bg-blue-100 text-blue-700"
                          : chk.estado_nombre === "Anulado"
                          ? "bg-red-100 text-red-700"
                          : chk.estado_nombre === "Enviado"
                          ? "bg-purple-100 text-purple-700"
                          : chk.estado_nombre === "Completado"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => openChangeStateModal(chk)}
                    >
                      {chk.estado_nombre || "—"}
                    </button>
                    </td>
                    <td className="p-3 text-center">{new Date(chk.fecha_creacion).toLocaleString()}</td>
                    <td className="p-3 text-center flex gap-2 justify-center flex-wrap">
                      <button
                          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-full transition"
                          onClick={() => handleCheckJSON(chk.id,chk.estado_id)}
                        >
                          <Eye size={16} /> Imprimir
                        </button>
                        <button 
                          className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-100 rounded-full transition"
                          onClick={() => handleEditChecklist(chk)}>
                          <Edit size={16} /> Editar
                        </button>
                      <button
                        onClick={() => openDeleteModal(chk)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded-full transition"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Modal de edición */}
        {isEditModalOpen && (
          <NCheckModal
            data={checklistToEdit}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
          <ConfirmDeleteModal
          visible={deleteModalVisible}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          deleting={deleting}
          />
          <ChangeStateModal
          visible={changeStateModalVisible}
          onClose={() => setChangeStateModalVisible(false)}
          onConfirm={handleChangeState}
          checklist={checklistToChange}
          />
      </div>
  );
  
}



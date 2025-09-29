// src/pages/gPlant.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, PlusCircle, File, Info } from "lucide-react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,} from "recharts";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EditPlantillaModal from "../components/EditPlantillaModal";



export default function GPlant() {
  const navigate = useNavigate();
  const [plantillas, setPlantillas] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, titulo: "" });
  const [deleting, setDeleting] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState({ id: null, titulo: "", descripcion: "" });



  // 📂 Cargar plantillas desde JSON en public/data

  useEffect(() => {
    setLoadingList(true);

    fetch("http://localhost:3000/api/plantillas")
      .then((res) => res.json())
      .then((data) => setPlantillas(data)) // 👈 ya llega lista
      .catch((err) => setError(`Error al cargar plantillas: ${err.message}`))
      .finally(() => setLoadingList(false));
  }, []);


  // 📂 Cargar plantillas desde API
  const fetchPlantillas = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/plantillas/${id}`);
    if (!res.ok) throw new Error(`Error al cargar plantilla ${id}`);

    const data = await res.json();
    setSelectedPlantilla(data); // 🔥 ya parseada
    setGroups(data.estructura_json || []); // directamente
  } catch (error) {
    console.error(error);
    setError("Error al cargar plantilla seleccionada");
  }
};


  // 👉 Eliminar plantilla (desde la BD y actualizar estado)
  const openDeleteModal = (id, titulo) => {
    setToDelete({ id, titulo });
    setDeleteModalVisible(true);
  };
  // Cerrar modal
  const closeDeleteModal = () => {
    if (deleting) return; // no cerrar mientras se elimina
    setDeleteModalVisible(false);
    setToDelete({ id: null, titulo: "" });
  };
  const confirmDelete = async () => {
    if (!toDelete.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/plantillas/${toDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Error al eliminar plantilla");
      }

      // Actualizar estado (quitar la plantilla eliminada)
      setPlantillas((prev) => prev.filter((p) => p.id !== toDelete.id));

      setDeleteModalVisible(false);
      setToDelete({ id: null, titulo: "" });
    } catch (err) {
      console.error("❌ Error eliminando plantilla:", err);
      alert("Error eliminando plantilla: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // 👉 Editar plantilla
  const openEditModal = (plantilla) => {
    setEditingPlantilla(plantilla);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingPlantilla({ id: null, titulo: "", descripcion: "" });
  };
  //Redirrecionar al cPlant
  const handleEditPlantilla = (id) => {
    console.log("👉 Enviando id a cPlant:", id); 
    navigate("/cplant", { state: { id } });
  };

  const handleSaveQuickEdit = async (id, titulo, descripcion) => {
    try {
      const plantillaActual = editingPlantilla; 

      const response = await fetch(`http://localhost:3000/api/plantillas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          titulo, 
          descripcion, 
          estructura_json: plantillaActual.estructura_json || {} 
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar plantilla");

      const data = await response.json();
      console.log("✅ Actualización rápida:", data);

      await fetchPlantillas(); // recargar lista
    } catch (err) {
      console.error("❌ Error guardando cambios:", err);
    }
  };


  // 👉 Crear nueva plantilla
  const nuevaPlantilla = () => {
    navigate("/cPlant");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Plantillas</h1>
        <button
          onClick={nuevaPlantilla}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Nueva Plantilla
        </button>
      </div>

      {/* 📋 Lista de plantillas */}
<Card>
  <CardContent>
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="w-full border-collapse bg-white">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="p-3">Código</th>
            <th className="p-3">Nombre</th>
            <th className="p-3 hidden sm:table-cell">Información</th>
            <th className="p-3 hidden sm:table-cell">Fecha Creada</th>
            <th className="p-3 hidden sm:table-cell">Fecha Modif.</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plantillas.map((p, index) => (
            <tr
              key={p.id}
              className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
            >
              <td className="p-3 font-semibold text-gray-700">{p.codigo}</td>
              <td className="p-3 font-medium">{p.titulo}</td>
              <td className="p-3 hidden sm:table-cell truncate max-w-xs" title={p.descripcion}>
                {p.descripcion}
              </td>
              <td className="p-3 hidden sm:table-cell">
                {new Date(p.fecha_creacion).toLocaleDateString("es-PE")}
              </td>
              <td className="p-3 hidden sm:table-cell">
                {p.fecha_modificacion
                  ? new Date(p.fecha_modificacion).toLocaleDateString("es-PE")
                  : "-"}
              </td>
              <td className="p-3 flex gap-2 justify-center flex-wrap">
                <button
                  onClick={() => openEditModal(p)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-full transition"
                >
                  <Info size={16} /> Ver
                </button>
                <button
                  onClick={() => handleEditPlantilla(p.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-100 rounded-full transition"
                >
                  <Edit size={16} /> Editar
                </button>
                <button
                  onClick={() => openDeleteModal(p.id, p.titulo)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded-full transition"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>


      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        itemName={toDelete.titulo}
        loading={deleting}
        onConfirm={confirmDelete}
      />  
      <EditPlantillaModal
        visible={editModalVisible}
        onClose={closeEditModal}
        onConfirm={handleEditPlantilla}
        plantilla={editingPlantilla}
        setPlantilla={setEditingPlantilla}
        onSave={handleSaveQuickEdit} 
      />

    </div>
  );
}

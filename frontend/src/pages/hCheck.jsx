import { useEffect, useState } from "react";
import { Edit, Trash2, PlusCircle, File, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { generatePDFFromJSON } from "../helpers/generatePDFFromJSON";
import { generatePDF } from "../utils/pdfGenerator"; 


export default function HCheck() {
    const navigate = useNavigate();
    const [checklists, setChecklists] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // ✅ Estado para editar checklist
  const [checklistToEdit, setChecklistToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/checklists")
      .then(res => res.json())
      .then(data => setChecklists(data))
      .catch(err => console.error("Error cargando checklists:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este checklist?")) return;
    try {
      await fetch(`http://localhost:3000/api/checklists/${id}`, { method: "DELETE" });
      setChecklists(checklists.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error eliminando checklist:", err);
    }
  };
  const handleEditChecklist = (chk) => {
    console.log("ID que voy a enviar:", chk.id);
    navigate("/ncheck", { state: { checklistId: chk.id } });
    };

// en hCheck.jsx o donde lo llamas
const handleCheckJSON = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/pdf/generate-pdf/${id}`);
    if (!response.ok) throw new Error("Error obteniendo JSON");

    const checklistJSON = await response.json();

    // 1) convertir a content (groupName -> array fields)
    const content = generatePDFFromJSON(checklistJSON);

    // debug rápido (verifica forma antes de generar)
    console.log("content keys:", Object.keys(content));
    for (const [g, f] of Object.entries(content)) {
      console.log(g, Array.isArray(f), f.length, f[0]);
    }

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
  } catch (err) {
    console.error("handleCheckJSON error:", err);
  }
};


  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold ml-4">Historial de Checklists</h1>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse bg-white min-w-[600px] md:min-w-full">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-3">N° Plantilla</th>
                <th className="p-3">Placa</th>
                <th className="p-3">Conductor</th>
                <th className="p-3">Plantilla</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {checklists.map((chk, index) => {
                const contenido = JSON.parse(chk.contenido_json);
                return (
                  <tr key={chk.id} className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="p-3 font-semibold text-gray-700">{chk.folio}</td>
                    <td className="p-3">{contenido.placa || "—"}</td>
                    <td className="p-3">{contenido.conductor || "—"}</td>
                    <td className="p-3">{chk.plantilla_id}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        chk.estado_nombre === "Pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : chk.estado_nombre === "En Proceso"
                          ? "bg-blue-100 text-blue-700"
                          : chk.estado_nombre === "Finalizado"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {chk.estado_nombre || "—"}
                      </span>
                    </td>
                    <td className="p-3">{new Date(chk.fecha_creacion).toLocaleString()}</td>
                    <td className="p-3 flex gap-2 justify-center flex-wrap">
                      <button
                          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-full transition"
                          onClick={() => handleCheckJSON(chk.id)}
                        >
                          <Eye size={16} /> Ver
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-100 rounded-full transition"
                            onClick={() => handleEditChecklist(chk)}>
                            <Edit size={16} /> Editar
                        </button>
                      <button
                        onClick={() => handleDelete(chk)}
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
      </CardContent>
    </Card>
  );
}



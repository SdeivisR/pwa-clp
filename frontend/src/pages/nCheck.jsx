// src/pages/NCheck.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, FileText, FilePlus, FolderPlus } from "lucide-react";
import TemplatesModal from "../components/TemplatesModal";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";


export default function NCheck() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false); 
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleCreateTemplate = () => {
    setLoading(true);
    navigate("/cPlant");
  };

  const steps = [
    "Selección de plantilla",
    "Datos generales",
    "Checklist",
    "Firmas",
    "Guardar",
  ];

  // Calcular progreso en %
  const progress = (step / steps.length) * 100;

    // Lista de plantillas
  const templates = [
    { name: "Checklist Vehicular", fields: [
  {
    "id": "8cc69327-7b2d-4554-bb84-128a22fac34e",
    "name": "Grupo 1",
    "fields": [
      {
        "type": "Checkbox",
        "label": "Nuevo Checkbox"
      },
      {
        "type": "Comentario",
        "label": "Nuevo Comentario"
      },
      {
        "type": "Fechas",
        "label": "Nuevo Fechas"
      },
      {
        "type": "Firma",
        "label": "Nuevo Firma"
      },
      {
        "type": "Firma + Texto",
        "label": "Nuevo Firma + Texto"
      },
      {
        "type": "Hora",
        "label": "Nuevo Hora"
      },
      {
        "type": "Imágenes tipo lista",
        "label": "Nuevo Imágenes tipo lista"
      },
      {
        "type": "Kilometraje",
        "label": "Nuevo Kilometraje"
      },
      {
        "type": "Lista",
        "label": "Nuevo Lista"
      },
      {
        "type": "Numérico",
        "label": "Nuevo Numérico"
      },
      {
        "type": "Recomendación Inteligente (IA)",
        "label": "Nuevo Recomendación Inteligente (IA)"
      },
      {
        "type": "Selección Múltiple",
        "label": "Nuevo Selección Múltiple"
      },
      {
        "type": "Texto",
        "label": "Nuevo Texto"
      },
      {
        "type": "Texto + Si/No",
        "label": "Nuevo Texto + Si/No"
      }
    ]
  },
]
 },
    { name: "Inspección de Seguridad", fields: [
  {
    "id": "8cc69327-7b2d-4554-bb84-128a22fac34e",
    "name": "Grupo 1",
    "fields": [
      {
        "type": "Texto",
        "label": "Nuevo Checkbox"
      },
    ]
  }
] },
  ];
   const isGroupedTemplate = (template) => {
     return (
       template &&
       Array.isArray(template.fields) &&
       template.fields.length > 0 &&
       typeof template.fields[0] === "object" &&
       template.fields[0] !== null &&
       "fields" in template.fields[0]
   );
 };
const renderField = (field) => {
  switch (field.type) {
    case "Texto":
      return <Input placeholder={field.label} />;
    case "Checkbox":
      return <div className="flex items-center gap-2">
        <Checkbox />
        <span>{field.label}</span>
      </div>;
    case "Comentario":
      return <Textarea placeholder={field.label} />;
    case "Fechas":
      return <Input type="date" placeholder={field.label} />;
    case "Hora":
      return <Input type="time" placeholder={field.label} />;
    case "Kilometraje":
    case "Numérico":
      return <Input type="number" placeholder={field.label} />;
    case "Lista":
      return <select className="border rounded p-2 w-full">
        <option value="">Seleccione una opción</option>
      </select>;
    case "Selección Múltiple": 
      return <select multiple className="border rounded p-2 w-full">
        <option value="">Opción 1</option>
        <option value="">Opción 2</option>
      </select>;
    case "Firma":
      return <div className="border rounded p-2">[Aquí canvas para firma]</div>;
    case "Firma + Texto":
      return <div className="flex flex-col gap-2">
        <div className="border rounded p-2">[Aquí canvas para firma]</div>
        <Input placeholder="Texto adicional" />
      </div>;
    case "Imágenes tipo lista":
      return <div className="flex flex-col gap-2">
        <Button>Subir imagen</Button>
      </div>;
    case "Recomendación Inteligente (IA)":
      return <div className="p-2 bg-gray-100 rounded">[Aquí se mostrará recomendación IA]</div>;
    case "Texto + Si/No":
      return <div className="flex items-center gap-2">
        <Input placeholder={field.label} />
        <select className="border rounded p-2">
          <option>Sí</option>
          <option>No</option>
        </select>
      </div>;
    default:
      return <div className="text-red-500">Tipo no soportado: {field.type}</div>;
  }
};

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuevo Checklist</h1>

      {/* Botones principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {/* Botón abrir modal */}
        <button
          className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200"
          onClick={() => setShowModal(true)}
        >
          <FolderPlus className="w-10 h-10 text-blue-600 mb-3" />
          <span className="font-medium">Elegir Plantilla</span>
        </button>

        {/* Crear plantilla */}
        <button
          className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200"
          onClick={handleCreateTemplate}
        >
          <FilePlus className="w-10 h-10 text-green-600 mb-3" />
          <span className="font-medium">Crear Plantilla</span>
        </button>

        {/* Guardar borrador */}
        <button
          className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200"
          onClick={() => alert("Guardar borrador")}
        >
          <Save className="w-10 h-10 text-yellow-600 mb-3" />
          <span className="font-medium">Guardar borrador</span>
        </button>

        {/* Generar PDF */}
        <button
          className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200"
          onClick={() => alert("Generar PDF")}
        >
          <FileText className="w-10 h-10 text-purple-600 mb-3" />
          <span className="font-medium">Generar PDF</span>
        </button>
      </div>

    
{/* Contenedor del formulario dinámico */}
<div className="mt-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
  {!selectedTemplate ? (
    <p className="text-gray-500">Seleccione una plantilla para comenzar.</p>
  ) : isGroupedTemplate(selectedTemplate) ? (
    // Plantilla con grupos
    selectedTemplate.fields.map((group, gi) => (
      <div key={group.id ?? `group-${gi}`} className="mb-6">
        <h3 className="text-xl font-semibold mb-3">{group.name}</h3>
        {Array.isArray(group.fields) && group.fields.length > 0 ? (
          group.fields.map((field, fi) => renderField(field, `${gi}-${fi}`))
        ) : (
          <p className="text-gray-400 text-sm">Este grupo no tiene campos.</p>
        )}
      </div>
    ))
  ) : (
    // Plantilla plana (array de strings)
    selectedTemplate.fields.map((label, i) => (
      <div key={`flat-${i}`} className="mb-3">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input className="w-full p-2 border rounded-lg bg-gray-100" disabled />
      </div>
    ))
  )}
</div>

      {/* Overlay de carga */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
              <p className="text-white text-lg font-medium">Cargando...</p>
            </div>
          </div>
        )}

      {/* Modal de plantillas */}
      <TemplatesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        templates={templates}
        onSelect={(tpl) => setSelectedTemplate(tpl)}
      />

    </div>
  );
}

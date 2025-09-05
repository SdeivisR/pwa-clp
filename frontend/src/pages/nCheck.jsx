// src/pages/NCheck.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, FileText, FilePlus, FolderPlus } from "lucide-react";
import TemplatesModal from "../components/TemplatesModal";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import SignaturePad from "@/components/SignaturePad"; 
import { v4 as uuidv4 } from "uuid";

export default function NCheck() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step] = useState(1);
  const [showModal, setShowModal] = useState(false); 
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [activeSignatureField, setActiveSignatureField] = useState(null);
  const [fields, setFields] = useState([]);


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
    { name: "Inspección de Seguridad", fields: [
  {
    "id": "7cb81046-f3f5-49dd-ac4d-6f1fc68511ca",
    "name": "Grupo Preestablecido 1",
    "fields": [
      {
        "id": "1f61c89c-3f6a-4080-9aac-f977d2109f54",
        "type": "Texto",
        "label": "Conductor",
        "value": null
      },
      {
        "id": "24ff35b4-9608-4d11-99d9-76eedd66e229",
        "type": "Kilometraje",
        "label": "Kilometraje",
        "value": null
      },
      {
        "id": "7bdad55a-5ad7-4be3-a998-944fd7cb92c9",
        "type": "Texto",
        "label": "Placa",
        "value": null
      },
      {
        "id": "70cda632-571c-480e-9892-e70b86a3e8b5",
        "type": "Texto",
        "label": "Responsable de la Inspeccion",
        "value": null
      },
      {
        "id": "fe266c2c-ec6b-411b-a5d9-ec4d504df8d0",
        "type": "FechasP",
        "label": "Fechas",
        "value": null,
        "startDate": "",
        "endDate": ""
      },
      {
        "id": "bb64130f-6019-437d-80de-6ba5dd13eaef",
        "type": "Hora",
        "label": "Hora de Ingreso",
        "value": null
      },
      {
        "id": "f64a082c-64c9-43dd-bb19-f06bb9923960",
        "type": "Texto",
        "label": "Empresa",
        "value": null
      }
    ]
  }
] },
  ];
// Función para guardar la firma en el campo correspondiente
  const updateFieldValue = (fieldId, value) => {
    setSelectedTemplate((prev) => {
      if (!prev) return prev;

      const newFields = prev.fields.map((group) => ({
        ...group,
        fields: group.fields.map((f) =>
          f.id === fieldId ? { ...f, value } : f
        ),
      }));

      return { ...prev, fields: newFields };
    });
  };
  const updateFieldFull = (fieldId, updatedProps) => {
  setSelectedTemplate((prev) => {
    if (!prev) return prev;

    const newFields = prev.fields.map((group) => ({
      ...group,
      fields: group.fields.map((f) =>
        f.id === fieldId ? { ...f, ...updatedProps } : f
      ),
    }));

    return { ...prev, fields: newFields };
  });
};


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
        return (
          <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
            <label className="text-lg font-semibold text-gray-800 block mt-1">
              {field.label}
            </label>
            <Input
              type="text"
              placeholder="Escribe aquí..."
              className="rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-3 py-2 text-sm sm:text-base"
            />
          </div>
        );
    case "Checkbox":
      return (
        <CheckboxField field={field} />
      );

      function CheckboxField({ field }) {
        const [value, setValue] = useState(null);

        return (
          <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
            <span className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</span>
            <div className="flex items-center gap-4 sm:gap-6">
              <label
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition text-sm sm:text-base
                  ${value === "si" ? "bg-green-100 border border-green-400" : "hover:bg-gray-100"}
                `}
                onClick={() => setValue("si")}
              >
              <Checkbox checked={value === "si"} />
              <span className="text-gray-700 font-medium">Sí</span>
            </label>
            <label
              className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition text-sm sm:text-base
                ${value === "no" ? "bg-red-100 border border-red-400" : "hover:bg-gray-100"}
              `}
              onClick={() => setValue("no")}
            >
              <Checkbox checked={value === "no"} />
              <span className="text-gray-700 font-medium">No</span>
            </label>
          </div>
        </div>
      );}
    case "Comentario":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <Textarea
            placeholder="Escribe tu comentario..."
            className="min-h-[100px] rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none px-3 py-2 text-sm sm:text-base"
          />
        </div>
      );
    case "Fechas":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <Input
            type="date"
            className="rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-3 py-2 text-sm sm:text-base"
          />
        </div>
      );
case "FechasP":
  return (
    <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
      <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>

      {/* Fecha de inicio */}
      <input
        type="date"
        value={field.startDate || ""}
        onChange={(e) => {
          const newStart = e.target.value;
          if (field.endDate && newStart > field.endDate) {
            updateFieldFull(field.id, {
              ...field,
              startDate: "",
              endDate: "",
              error: "⚠️ La fecha de inicio no puede ser mayor que la de salida",
            });
            setTimeout(() => {
              updateFieldFull(field.id, { ...field, error: "" });
            }, 4000);
          } else {
            updateFieldFull(field.id, { startDate: newStart, error: "" });
          }
        }}
        className="rounded-xl border border-gray-300 px-3 py-2 text-sm sm:text-base"
      />

      {/* Fecha de salida */}
      <input
        type="date"
        value={field.endDate || ""}
        onChange={(e) => {
          const newEnd = e.target.value;
          if (field.startDate && newEnd < field.startDate) {
            updateFieldFull(field.id, {
              ...field,
              startDate: "",
              endDate: "",
              error: "⚠️ La fecha de salida no puede ser menor que la de inicio",
            });
             setTimeout(() => {
              updateFieldFull(field.id, { ...field, error: "" });
            }, 4000);
          } else {
            updateFieldFull(field.id, { endDate: newEnd, error: "" });
          }
        }}
        className="rounded-xl border border-gray-300 px-3 py-2 text-sm sm:text-base"
      />

      {/* Tarjeta de error moderna */}
      {field.error && (
        <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm shadow-sm">
          {field.error}
        </div>
      )}
    </div>
  );



    case "Hora":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <Input
            type="time"
            className="rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-3 py-2 text-sm sm:text-base"
          />
        </div>
      );
    case "Kilometraje":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          
          <div className="relative flex items-center">
            <Input
              type="number"
              placeholder="0"
              className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-3 py-2 text-sm sm:text-base pr-12"
            />
            <span className="absolute right-3 text-gray-600 text-sm sm:text-base">km</span>
          </div>
        </div>
      );

    case "Numérico":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <Input
            type="number"
            placeholder="0"
            className="rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-3 py-2 text-sm sm:text-base"
          />
        </div>
      );

    case "Lista":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <select
            className="rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-3 py-2 text-sm sm:text-base text-gray-700"
          >
            <option value="">Seleccione una opción</option>
            {field.items?.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "Selección Múltiple":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <div className="pl-2 sm:pl-4 space-y-2">
            {field.items?.map((item, index) => (
              <label key={index} className="flex items-center gap-2 text-sm sm:text-base">
                <input type="checkbox" value={item.value} className="h-4 w-4" />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      );

case "Firma":
  return (
    <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
      <label className="text-base sm:text-lg font-semibold text-gray-800">
        {field.label}
      </label>

      {field.value ? (
        <div className="relative">
          <img
            src={field.value}
            alt="Firma guardada"
            className="w-full h-32 object-contain border rounded-lg bg-gray-50"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
              onClick={() => setActiveSignatureField(field.id)}
            >
              Rehacer firma
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
              onClick={() => updateFieldValue(field.id, null)}
            >
              Borrar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setActiveSignatureField(field.id)}
          className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
        >
          Toca aquí para firmar
        </button>

      )}
    </div>
  );




    case "Firma + Texto":
  return (
    <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
      <label className="text-base sm:text-lg font-semibold text-gray-800">
        {field.label}
      </label>
                <input
            type="text"
            placeholder="Escribir aquí..."
            className="border rounded-xl px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
          />


      {field.value ? (
        <div className="relative">
          <img
            src={field.value}
            alt="Firma guardada"
            className="w-full h-32 object-contain border rounded-lg bg-gray-50"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
              onClick={() => setActiveSignatureField(field.id)}
            >
              Rehacer firma
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
              onClick={() => updateFieldValue(field.id, null)}
            >
              Borrar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setActiveSignatureField(field.id)}
          className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
        >
          Toca aquí para firmar
        </button>

      )}
    </div>
  );
    case "Imágenes tipo lista":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <div className="flex flex-col gap-1">
            {field.items?.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(item.imageUrl)}
                className="text-left px-2 py-1 border rounded hover:bg-gray-100 text-sm sm:text-base"
              >
                {item.label}
              </button>
            ))}
          </div>
          {selectedImage && (
            <div className="mt-3 flex justify-center">
              <img
                src={selectedImage}
                alt="Imagen seleccionada"
                className="w-48 sm:w-64 h-auto rounded-lg border shadow-sm"
              />
            </div>
          )}
        </div>
      );
    case "Recomendación Inteligente (IA)":
      return (
        <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
          <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <div className="p-3 bg-gray-100 rounded-xl border text-gray-600 italic text-sm sm:text-base">
            {recommendation || "La IA aún no ha generado una recomendación..."}
          </div>
        </div>
      );

    case "Texto + Si/No":
        return (
    <TextoSiNo field={field} />
  );

function TextoSiNo({ field }) {
  const [value, setValue] = useState(null); // "si" | "no" | null

  return (
    <div className="flex flex-col gap-2 w-full p-4 rounded-2xl shadow-md bg-white border border-gray-200">
      {/* Label como título */}
      <label className="text-lg font-semibold text-gray-800 block mt-1">
        {field.label}
      </label>

      {/* Input moderno */}
      <Input
        type="text"
        placeholder="Escribe aquí..."
        className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition mb-3"
      />

      {/* Opción Sí / No con mismo estilo que el Checkbox exclusivo */}
      <div className="flex items-center gap-6">
        <label
          className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition 
            ${value === "si" ? "bg-green-100 border border-green-400" : "hover:bg-gray-100"}
          `}
          onClick={() => setValue("si")}
        >
          <Checkbox checked={value === "si"} />
          <span className="text-gray-700 font-medium">Sí</span>
        </label>

        <label
          className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition 
            ${value === "no" ? "bg-red-100 border border-red-400" : "hover:bg-gray-100"}
          `}
          onClick={() => setValue("no")}
        >
          <Checkbox checked={value === "no"} />
          <span className="text-gray-700 font-medium">No</span>
        </label>
      </div>
    </div>
  );
}
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

{activeSignatureField && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-4 w-[92%] max-w-[520px]">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Firmar</h2>

      <SignaturePad
        width={480}   // se ve bien en PC y móvil
        height={220}
        onSave={(dataUrl) => {
          updateFieldValue(activeSignatureField, dataUrl);
          setActiveSignatureField(null);
        }}
        onCancel={() => setActiveSignatureField(null)}
      />
    </div>
  </div>
)}


    </div>
  );
}

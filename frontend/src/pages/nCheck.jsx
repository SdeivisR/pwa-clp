// src/pages/NCheck.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RefreshCw, Trash2, Loader2, Save, FileText, FilePlus, FolderPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TemplatesModal from "../components/TemplatesModal";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import SignaturePad from "@/components/SignaturePad"; 
import Spinner from "../components/Spinner";
import { UserContext } from "../context/UserContext";


//Funciones 
  // TextoSiNo.jsx
      function TextoSiNo({ field, updateFieldValue }) {
        const value = field.cB ?? ""; // Valor del Sí/No
        const textValue = field.value ?? ""; // Valor del texto

        return (
          <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
            <span className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</span>

            <div className="flex items-center gap-4 sm:gap-6">
              <label
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition text-sm sm:text-base
                  ${value === "si" ? "bg-green-100 border border-green-400" : "hover:bg-gray-100"}`}
                onClick={() => updateFieldValue(field.id, { ...field, cB: "si" })}
              >
                <Checkbox checked={value === "si"} readOnly />
                <span className="text-gray-700 font-medium">Sí</span>
              </label>

              <label
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition text-sm sm:text-base
                  ${value === "no" ? "bg-red-100 border border-red-400" : "hover:bg-gray-100"}`}
                onClick={() => updateFieldValue(field.id, { ...field, cB: "no" })}
              >
                <Checkbox checked={value === "no"} readOnly />
                <span className="text-gray-700 font-medium">No</span>
              </label>
            </div>

            <Input
              value={textValue}
              onChange={(e) =>
                updateFieldValue(field.id, { ...field, value: e.target.value })
              }
              placeholder="Escribe aquí..."
              className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition mt-2 px-3 py-2"
            />
          </div>
        );
      }

    // CheckboxField.jsx
      function CheckboxField({ field, handleChange }) {
        const value = field.cB ?? ""; 

      return (
          <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
            <span className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</span>
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Opción Sí */}
              <label
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition text-sm sm:text-base
                  ${value === "si" ? "bg-green-100 border border-green-400" : "hover:bg-gray-100"}`}
                onClick={() => handleChange(field.id, "si")}
              >
                <Checkbox checked={value === "si"} />
                <span className="text-gray-700 font-medium">Sí</span>
              </label>

              {/* Opción No */}
              <label
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition text-sm sm:text-base
                  ${value === "no" ? "bg-red-100 border border-red-400" : "hover:bg-gray-100"}`}
                onClick={() => handleChange(field.id, "no")}
              >
                <Checkbox checked={value === "no"} />
                <span className="text-gray-700 font-medium">No</span>
              </label>
            </div>
          </div>
        );
      }



export default function NCheck() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState({ fields: [], estructura_json: []  });
  const [recommendation, setRecommendation] = useState("");
  const [activeSignatureField, setActiveSignatureField] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [plantillas, setPlantillas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const location = useLocation();
  const checklistId = location.state?.checklistId;
  const [checklist, setChecklist] = useState(null);



  useEffect(() => {
    fetch("http://localhost:3000/api/plantillas")
      .then((res) => res.json())
      .then((data) => setPlantillas(data))
      .catch((err) => console.error("❌ Error cargando plantillas:", err));
  }, []);

    const handleSelectTemplate = (template) => {
      setSelectedTemplate(template.fields || []); 
      setTemplateName(template.name);
    };
    const handleCreateTemplate = () => {
      setLoading(true);
      setTimeout(() => {
      navigate("/cPlant");
      }, 300);
    };
    const handleInputChange = (fieldId, value) => {
      setFormData(prevData => ({
        ...prevData,
        [fieldId]: value
      }));
      setSelectedTemplate(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          fields: (prev.fields || []).map(group => ({
            ...group,
            fields: (group.fields || []).map(field =>
              field.id === fieldId ? { ...field, value } : field
            )
          }))
        };
      });
    };
    const handleCheckboxChange = (fieldId, newValue) => {
      setSelectedTemplate(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          estructura_json: (prev.estructura_json ?? []).map(group => ({
            ...group,
            fields: (group.fields ?? []).map(field =>
              field.id === fieldId ? { ...field, cB: newValue } : field
            ),
          })),
        };
      });
    };
    const handleSubmit = (e) => {
      e.preventDefault(); 
      setSubmitted(true);
    };
    // Función para guardar la firma en el campo correspondiente
    const updateFieldValue = (fieldId, value) => {
      setSelectedTemplate((prev) => {
        if (!prev) return prev;

        const newEstructura = (prev.estructura_json ?? []).map((group) => ({
          ...group,
          fields: (group.fields ?? []).map((f) =>
            f.id === fieldId ? { ...f, value } : f
          ),
        }));

        return { ...prev, estructura_json: newEstructura };
      });
    };
    //funcion para modificar el value
    const updateFieldFull = (fieldId, updatedProps) => {
      setSelectedTemplate((prev) => {
        if (!prev) return prev;

        const newEstructura = (prev.estructura_json ?? []).map((group) => ({
          ...group,
          fields: (group.fields ?? []).map((f) =>
            f.id === fieldId ? { ...f, ...updatedProps } : f
          ),
        }));

        return { ...prev, estructura_json: newEstructura };
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
    //Validacion del Require   
    const validarCampo = (field) => {
      if (!field.required) return true;

      switch (field.type) {
        case "Texto":
        case "Comentarios":
          return (
            field.value !== null &&
            field.value !== undefined &&
            String(field.value).trim() !== ""
          );
        case "Lista":
          return field.value && field.value !== "";
        case "Selección Múltiple":
          return Array.isArray(field.value) && field.value.length > 0;
        case "Imágenes tipo lista":
          return !!field.value;
        default:
          return true;
      }
    };
    // Render para formulario
    const renderField = (field, updateField, updateFieldValue, handleInputChange) => {
        switch (field.type) {

      case "Texto":
          return (
            <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
              <label className="text-lg font-semibold text-gray-800 block mt-1">
                {field.label}
              </label>
                <Input
                  type="text"
                  value={field.value || ""}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                  placeholder="Escribe aquí..."
                  className={`border p-2 rounded w-full ${
                    submitted && !field.value ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {submitted && !field.value ? (
                  <p className="text-red-500 text-sm">Este campo es obligatorio</p>
                ) : null}
            </div>
          );
      case "Comentario":
        return (
          <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
            <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>
            <Textarea
              placeholder="Escribe tu comentario..."
              value={field.value || ""}
              onChange={(e) => updateFieldValue(field.id, e.target.value)}
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
                value={field.value || ""}
                onChange={(e) => updateFieldValue(field.id, e.target.value)}
              className="rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-3 py-2 text-sm sm:text-base"
            />
          </div>
        );
      case "FechasP":
        return (
          <div className="flex flex-col gap-2 w-full p-3 sm:p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
            <label className="text-base sm:text-lg font-semibold text-gray-800">{field.label}</label>

            {/* Fecha de inicio */}
            <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Día de Ingreso
            </label>
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
          </div>

            {/* Fecha de salida */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Día de Ingreso
              </label>
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
              </div>
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
              value={field.value || ""}
              onChange={(e) => updateFieldValue(field.id, e.target.value)}
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
                value={field.value || ""}
                onChange={(e) => updateFieldValue(field.id, e.target.value)}
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
              value={field.value || ""}
              onChange={(e) => updateFieldValue(field.id, e.target.value)}
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
                value={field.value || ""}
                onChange={(e) => updateFieldValue(field.id, e.target.value)} // 👈 solo el valor
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
            <label className="text-base sm:text-lg font-semibold text-gray-800">
              {field.label}
            </label>
            <div className="pl-2 sm:pl-4 space-y-2">
              {field.items?.map((item, index) => {
                const values = Array.isArray(field.value) ? field.value : []; 
                const isChecked = values.includes(item.value);

                return (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <input
                      type="checkbox"
                      value={item.value}
                      checked={isChecked}
                      onChange={(e) => {
                        let newValue;
                        if (e.target.checked) {
                          newValue = [...values, item.value];
                        } else {
                          newValue = values.filter(v => v !== item.value);
                        }
                        updateFieldValue(field.id, newValue);
                      }}

                      className="h-4 w-4"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
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
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSignatureField(field.id)}
                    className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Rehacer"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFieldValue(field.id, null)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Borrar"
                  >
                    <Trash2 className="w-5 h-5" />
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
                onChange={(e) =>
                  updateField(field.id, { ...field, com: e.target.value })
                }
                value={field.com || ""}
                className="border rounded-xl px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
              />


            {field.value ? (
              <div className="relative">
                <img
                  src={field.value}
                  alt="Firma guardada"
                  className="w-full h-32 object-contain border rounded-lg bg-gray-50"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSignatureField(field.id)}
                    className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Rehacer"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFieldValue(field.id, null)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Borrar"
                  >
                    <Trash2 className="w-5 h-5" />
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
            <label className="text-base sm:text-lg font-semibold text-gray-800">
              {field.label}
            </label>

            {/* Opciones como botones */}
            <div className="flex flex-col gap-1">
              {field.items?.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => updateFieldValue(field.id, item.value)}
                  className={`text-left px-2 py-1 border rounded text-sm sm:text-base transition ${
                    field.value === item.value
                      ? "border-blue-400 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {field.value && (
              <div className="mt-3 flex justify-center">
                <img
                  src={field.items.find((i) => i.value === field.value)?.imageUrl}
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
            <label className="text-base sm:text-lg font-semibold text-gray-800">
              {field.label}
            </label>
            <div className="p-3 bg-gray-100 rounded-xl border text-gray-600 italic text-sm sm:text-base">
              {recommendation || field.value || "La IA aún no ha generado una recomendación..."}
            </div>
          </div>
        );
      case "Checkbox":
        return (
          <CheckboxField
            field={field}
            handleChange={handleCheckboxChange}
          />
        );
      case "Texto + Si/No":
        return (
          <TextoSiNo
            field={field}
            updateFieldValue={updateFieldFull} // 👈 este es el que maneja { cB, value }
          />
        );
      default:
        return <div className="text-red-500">Tipo no soportado: {field.type}</div>;
    }
    };

    //Guardado
    const handleSave = async () => {
        if (!selectedTemplate) {
          alert("No hay plantilla seleccionada");
          return;
        }

        // Extraer la placa y conductor del template, si existen
        const fields = selectedTemplate.estructura_json.flatMap(group => group.fields);
        const placaField = fields.find(f => f.label === "Placa")?.value ?? null;
        const conductorField = fields.find(f => f.label === "Conductor")?.value ?? null;

        try {
          let vehiculo_id = 1; // fallback si no hay vehículo

          // Si tenemos placa o conductor, intentar crear vehículo nuevo o usar existente
          if (placaField || conductorField) {
            // Primero podrías buscar en tu backend si ya existe un vehículo con esa placa
            const resBuscar = await fetch(`http://localhost:3000/api/vehiculos?placa=${placaField}`);
            const dataBuscar = await resBuscar.json();

            if (dataBuscar && dataBuscar.length > 0) {
              // Vehículo existe
              vehiculo_id = dataBuscar[0].id;
            } else {
              // Crear nuevo vehículo
              const resCrear = await fetch("http://localhost:3000/api/vehiculos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  placa: placaField,
                  conductor: conductorField
                }),
              });
              const dataCrear = await resCrear.json();
              vehiculo_id = dataCrear.vehiculo_id; // ID del nuevo vehículo
            }
          }

          // Crear checklist
          const checklistToSave = {
            vehiculo_id,
            plantilla_id: selectedTemplate.id,
            contenido_json: JSON.stringify({
              ...selectedTemplate,
              placa: placaField,
              conductor: conductorField,
              creado_por: user?.name ?? null,
            }),
            fecha_creacion: new Date().toISOString(),
            fecha_salida: null,
          };

          // Guardar checklist en backend
          const resChecklist = await fetch("http://localhost:3000/api/checklists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(checklistToSave),
          });

          if (!resChecklist.ok) throw new Error("Error al guardar en la base de datos");

          const dataChecklist = await resChecklist.json();
          console.log("Checklist guardado:", dataChecklist);
          setTimeout(() => {
            navigate("/hCheck");
            }, 300);
          alert("Checklist guardado correctamente");

        } catch (err) {
          console.error(err);
          alert("No se pudo guardar el checklist");
        }
    };

useEffect(() => {
  if (checklistId) {
    const fetchChecklist = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/checklists/${checklistId}`);
        const data = await res.json();

        // Parseamos el JSON que guardaste
        const contenido = JSON.parse(data.contenido_json);

        // Guardamos en selectedTemplate (esto ya llena el form)
        setSelectedTemplate({
          id: data.plantilla_id,
          titulo: contenido.titulo ?? data.titulo,  
          estructura_json: contenido.estructura_json ?? [],
          fields: contenido.fields ?? []
        });
      } catch (err) {
        console.error("Error al cargar checklist:", err);
      }
    };

    fetchChecklist();
  }
}, [checklistId]);

  return (

    <div className="p-8 min-h-screen bg-gray-50">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuevo Checklist</h1>
      {/* Botones principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {/* Botón abrir modal */}
        <button
          className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200"
          onClick={() => setModalOpen (true)}
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
          onClick={handleSave}
        >
          <Save className="w-10 h-10 text-orange-400 mb-3" />
          <span className="font-medium">Guardar Checklist</span>
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
      ) : (
        <>
          {/* Título de la plantilla */}
          <h2 className="text-2xl font-bold mb-6 text-center">
            {selectedTemplate.titulo ?? "Plantilla sin título"}
          </h2>

          {Array.isArray(selectedTemplate.estructura_json) && selectedTemplate.estructura_json.length > 0 ? (
            selectedTemplate.estructura_json.map((group, gi) => (
              <div key={group.id ?? `group-${gi}`} className="mb-6">
                <h3 className="text-xl font-semibold mb-3">{group.name ?? `Grupo ${gi + 1}`}</h3>

                {Array.isArray(group.fields) && group.fields.length > 0 ? (
                  group.fields.map((field, fi) => (
                    <div key={field.id ?? `field-${gi}-${fi}`} className="mb-3">
                      {renderField(field, updateFieldFull, updateFieldValue, handleInputChange)}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Este grupo no tiene campos.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">La plantilla no tiene campos definidos.</p>
          )}
        </>
      )}
    </div>
      {/* Modal */}
      <TemplatesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        templates={plantillas}
        onSelect={(tpl) => {
          // 📌 guarda la plantilla seleccionada
          setSelectedTemplate(tpl);

          // si tiene estructura_json, parsear
          try {
            let parsed = tpl.estructura_json;
            if (typeof parsed === "string") {
              parsed = JSON.parse(parsed);
            }
            setSelectedTemplate({ ...tpl, estructura_json: parsed });
          } catch (err) {
            console.error("❌ Error parseando estructura_json", err);
          }
        }}
      />  
      
      {loading && <Spinner />}

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
      {user?.rol_id === 3 && (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📂 Vista previa del Script</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto max-h-80">
            {JSON.stringify(selectedTemplate, null, 2)}
          </pre>

        </CardContent>
      </Card>
      )}

      
      <form
      onSubmit={(e) => {
        e.preventDefault();

        let hayErrores = false;

        selectedTemplate.fields.forEach((field) => {
          if (!validarCampo(field)) {
            field.error = true;
            hayErrores = true;
          } else {
            field.error = false;
          }
        });

        if (hayErrores) {
          alert("❌ Faltan completar campos requeridos");
          return;
        }

        alert("✅ Todos los campos requeridos están completos");
      }}
      >
      </form>
    </div>
  );
} 

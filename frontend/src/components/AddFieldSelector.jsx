import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus,Trash2} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

// Tipos de campos disponibles
const FIELD_TYPES = [
  "Checkbox",
  "Comentario",
  "FechasP",
  "Fechas",
  "Firma",
  "Firma + Texto",
  "Hora",
  "Imágenes Marcadas",
  "Kilometraje",
  "Lista",
  "Numérico",
  "Selección Múltiple",
  "Texto",
  "Texto + Si/No",
];
export default function AddFieldSelector({ groupIndex, groupFields, addField, updateField, removeField }) {
  const [selectedType, setSelectedType] = useState("Texto");
  const sigCanvas = useRef(null);
  const [newItem, setNewItem] = useState("");
  const addItem = () => {
    if (!newItem.trim()) return;
    const value = `item${items.length + 1}`;
    setItems([...items, { value, label: newItem }]);
    setNewItem("");
  };
  const removeItem = (value) => setItems(items.filter((item) => item.value !== value));
  const editItem = (value, newLabel) => {
    setItems(items.map(item => item.value === value ? { ...item, label: newLabel } : item));
  };
  return (
    <div className="space-y-4">
      {/* Selector de tipo + botón Agregar */}
      <div className="flex gap-2 items-center mb-2">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Selecciona tipo de campo" />
          </SelectTrigger>
          <SelectContent>
            {FIELD_TYPES.map((type, i) => (
              <SelectItem key={i} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          className="flex items-center gap-1 p-2 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200"
          onClick={() => addField(groupIndex, selectedType)}>
          <Plus className="w-5 h-5" />
          Agregar campo
        </button>
      </div>
      {/* Accordion con campos */}
      <Accordion type="single" collapsible className="w-full" >
        {groupFields.map((field, fieldIndex) => (
          <AccordionItem
            key={fieldIndex}
            value={`field-${fieldIndex}`}
            className="border rounded-md"
        >
          <div className="flex items-center justify-between px-2 py-1 gap-1 overflow-x-auto no-scrollbar">
            <AccordionTrigger className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                type="text"
                value={field.label}
                onChange={(e) =>
                  updateField(groupIndex, fieldIndex, {
                    ...field,
                    label: e.target.value,
                  })
                }
                className="border-b border-gray-300 focus:outline-none flex-1 bg-transparent text-sm min-w-[80px]"
                placeholder="Campo..."
              />
              <span className="text-gray-500 text-xs whitespace-nowrap">[{field.type}]</span>
              <label className="flex items-center gap-[2px] text-xs text-gray-600 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) =>
                    updateField(groupIndex, fieldIndex, {
                      ...field,
                      required: e.target.checked,
                    })
                  }
                  className="scale-90"
                />
                Req.
              </label>
            </div>
            <button
              onClick={() => removeField(groupIndex, fieldIndex)}
              className="hover:bg-red-100 text-red-600 rounded p-1 flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
            </AccordionTrigger>
          </div>

              <AccordionContent className="px-3 pb-3">
                {field.type === "Texto" && (
                  <Input placeholder="Ingresa texto..." disabled className="bg-gray-100 cursor-not-allowed" />
                )}
                {field.type === "Texto + Si/No" && (
                  <div className="flex gap-3 items-center">
                    <Input placeholder="Texto..." />
                    <div className="flex gap-4 items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="checkbox1" disabled />
                      <label htmlFor="checkbox1" className="text-gray-700 font-medium">
                        SI
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="checkbox2" disabled />
                      <label htmlFor="checkbox2" className="text-gray-700 font-medium">
                        NO
                      </label>
                    </div>
                  </div> 
                  </div>
                )}
                {field.type === "Numérico" && (
                  <Input type="number" placeholder="Número..." disabled className="bg-gray-100 cursor-not-allowed" />
                )}
                {field.type === "Checkbox" && (
                  <div className="flex gap-6 opacity-60">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`si-${field.id}`}
                        checked={field.cB === "si"}
                        disabled
                      />
                      <label htmlFor={`si-${field.id}`}>SI</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`no-${field.id}`}
                        checked={field.cB === "no"}
                        disabled
                      />
                      <label htmlFor={`no-${field.id}`}>NO</label>
                    </div>
                  </div>
                )}  
                {field.type === "Comentario" && ( 
                  <Textarea placeholder="Escribe comentario..." disabled className="bg-gray-100 cursor-not-allowed"/>
                )}
                {field.type === "Lista" && (
                  <div className="flex flex-col gap-2">
                    {field.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            updateField(groupIndex, fieldIndex, {
                              ...field,
                              items: field.items.map((it, idx) =>
                                idx === i ? { ...it, label: e.target.value, value: e.target.value.toLowerCase() } : it
                              )
                            })
                          }
                          className="border-b border-gray-300 flex-1"
                        />
                        <button
                          onClick={() =>
                            updateField(groupIndex, fieldIndex, {
                              ...field,
                              items: field.items.filter((_, idx) => idx !== i)
                            })
                          }
                          className="text-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() =>
                        updateField(groupIndex, fieldIndex, {
                          ...field,
                          items: [...(field.items || []), { value: `item${Date.now()}`, label: "Nuevo item" }]
                        })
                      }
                      className="text-blue-500"
                    >
                      + Agregar item
                    </button>
                  </div>
                )}
                {field.type === "Selección Múltiple" && (
                  <div className="flex flex-col gap-2">
                    {field.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            updateField(groupIndex, fieldIndex, {
                              ...field,
                              items: field.items.map((it, idx) =>
                                idx === i ? { ...it, label: e.target.value, value: e.target.value.toLowerCase() } : it
                              )
                            })
                          }
                          className="border-b border-gray-300 flex-1"
                        />
                        <button
                          onClick={() =>
                            updateField(groupIndex, fieldIndex, {
                              ...field,
                              items: field.items.filter((_, idx) => idx !== i)
                            })
                          }
                          className="text-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() =>
                        updateField(groupIndex, fieldIndex, {
                          ...field,
                          items: [...(field.items || []), { value: `item${Date.now()}`, label: "Nuevo item" }]
                        })
                      }
                      className="text-blue-500"
                    >
                      + Agregar item
                    </button>
                  </div>
                )}
                {field.type === "Imagenes Marcadas" && (
                  <div className="flex flex-col gap-3 border rounded-xl p-3 bg-gray-50">
                    <p className="font-semibold text-gray-700">Opciones disponibles:</p>

                    <div className="grid grid-cols-2 gap-2">
                      {["Auto", "Camioneta", "Van", "Camión ligero", "Bus", "Auto eléctrico", "Deportivo"].map((opcion, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center border rounded-lg px-3 py-2 bg-white shadow-sm"
                        >
                          <span className="text-gray-700">{opcion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {field.type === "Firma" && (
                  <div className="border rounded-lg p-2 bg-white">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 300,
                        height: 150,
                        className: "border border-gray-300 rounded-md bg-gray-50 pointer-events-none" 
                      }}
                    />
                    <div className="flex gap-2 mt-2">
                    </div>
                  </div>
                )}
                {field.type === "Firma + Texto" && (
                  <div className="border rounded-lg p-2 bg-white">
                    {/* Input bloqueado */}
                    <Input 
                      placeholder="Ingresa texto..." 
                      disabled 
                      className="bg-gray-100 cursor-not-allowed" 
                    />

                    {/* Canvas bloqueado */}
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 300,
                        height: 150,
                        className: "border border-gray-300 rounded-md bg-gray-50 pointer-events-none" 
                      }}
                    />
                    <div className="flex gap-2 mt-2"></div>
                  </div>
                )}
                {field.type === "Hora" && (
                    <input
                      type="time"
                      disabled
                      className="bg-gray-100 cursor-not-allowed w-full border border-gray-300 rounded-md px-2 py-1"
                    />
                )}
                {field.type === "Fechas" && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        disabled
                        value={field.startDate || ""}
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      />
                    </div>                  
                  </div>
                )}
                {field.type === "FechasP" && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 w-20">Entrada:</label>
                      <input
                        type="date"
                        disabled
                        value={field.startDate || ""}
                        onChange={(e) => {
                          const newStart = e.target.value;
                          // Si la salida es menor que la entrada, la ajustamos
                          let newEnd = field.endDate || "";
                          if (newEnd && newStart > newEnd) {
                            newEnd = newStart;
                          }
                          updateField(groupIndex, fieldIndex, {
                            ...field,
                            startDate: newStart,
                            endDate: newEnd,
                          });
                        }}
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      />
                    </div>                  
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 w-20">Salida:</label>
                      <input
                        type="date"
                        disabled
                        value={field.endDate || ""}
                        min={field.startDate || ""}
                        onChange={(e) =>
                          updateField(groupIndex, fieldIndex, {
                            ...field,
                            endDate: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                )}
                {field.type === "Kilometraje" && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 w-24">Kilometraje:</label>
                    <input
                      type="text"
                      value="120000 km"
                      disabled
                      className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-100 cursor-not-allowed text-right"
                      placeholder="Ej: 120000 km"
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );  
}

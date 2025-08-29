import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Trash2, Plus } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

// Tipos de campos disponibles
const FIELD_TYPES = [
  "Checkbox",
  "Comentario",
  "Fechas",
  "Firma",
  "Firma + Texto",
  "Hora",
  "Imágenes tipo lista",
  "Kilometraje",
  "Lista",
  "Numérico",
  "Recomendación Inteligente (IA)",
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

        <Button onClick={() => addField(groupIndex, selectedType)}>
          ➕ Agregar campo
        </Button>
      </div>


    {/* Accordion con campos */}
    <Accordion type="single" collapsible className="w-full">
      {groupFields.map((field, fieldIndex) => (
        <AccordionItem
          key={fieldIndex}
          value={`field-${fieldIndex}`}
          className="border rounded-md"
        >
          <div className="flex items-center justify-between px-3 py-2">
          <AccordionTrigger className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={field.label}
                onChange={(e) =>
                  updateField(groupIndex, fieldIndex, {
                    ...field,
                    label: e.target.value,
                  })
                }
                className="border-b border-gray-300 focus:outline-none flex-1 bg-transparent"
                placeholder="Título del campo..."
              />
              <span className="text-gray-500 text-sm">[{field.type}]</span>
              {/* Checkbox de requerido */}
                <label className="flex items-center gap-1 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) =>
                      updateField(groupIndex, fieldIndex, {
                        ...field,
                        required: e.target.checked,
                      })
                    }
                  />
                  Requerido
                </label>
            </div>
          </AccordionTrigger>
            {/* Botón eliminar separado */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-100 text-red-600 ml-2"
                onClick={() => removeField(groupIndex, fieldIndex)}
              >
                <Trash2 size={16} />
              </Button>
          
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
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox id={`si-${fieldIndex}`} />
                    <label htmlFor={`si-${fieldIndex}`}>SI</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id={`no-${fieldIndex}`} />
                    <label htmlFor={`no-${fieldIndex}`}>NO</label>
                  </div>
                </div>
              )}

              {field.type === "Comentario" && (
                <Textarea placeholder="Escribe comentario..." disabled className="bg-gray-100 cursor-not-allowed"/>
               )}

              {/* Lista editable */}
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
              {/* Seleccion Multiple editable */}
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

              {/* Imagenes tipo Lista */}
              {field.type === "Imágenes tipo lista" && (
                <div className="flex flex-col gap-2">
                  {field.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {/* Campo de texto */}
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          updateField(groupIndex, fieldIndex, {
                            ...field,
                            items: field.items.map((it, idx) =>
                              idx === i
                                ? {
                                    ...it,
                                    label: e.target.value,
                                    value: e.target.value.toLowerCase(),
                                  }
                                : it
                            ),
                          })
                        }
                        className="border-b border-gray-300 flex-1"
                        placeholder="Texto del item"
                      />

                      {/* Campo para URL de la imagen */}
                      <input
                        type="text"
                        value={item.imageUrl || ""}
                        onChange={(e) =>
                          updateField(groupIndex, fieldIndex, {
                            ...field,
                            items: field.items.map((it, idx) =>
                              idx === i ? { ...it, imageUrl: e.target.value } : it
                            ),
                          })
                        }
                        className="border-b border-gray-300 flex-1"
                        placeholder="URL de la imagen"
                      />

                      {/* Preview de la imagen si existe */}
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.label}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}

                      <button
                        onClick={() =>
                          updateField(groupIndex, fieldIndex, {
                            ...field,
                            items: field.items.filter((_, idx) => idx !== i),
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
                        items: [
                          ...(field.items || []),
                          {
                            value: `item${Date.now()}`,
                            label: "Nuevo item",
                            imageUrl: "",
                          },
                        ],
                      })
                    }
                    className="text-blue-500"
                  >
                    + Agregar item
                  </button>
                </div>
              )}

              {field.type === "Recomendación Inteligente (IA)" && (
                <div className="p-2 border rounded-md bg-muted text-gray-600">
                  ⚡ Aquí se mostrará una recomendación generada por IA
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

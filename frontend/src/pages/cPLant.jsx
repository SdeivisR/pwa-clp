// src/pages/cPlant.jsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import AddFieldSelector from "../components/AddFieldSelector";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";

// 📌 Campos predefinidos
const PREDEFINED_FIELDS = [
  { type: "Texto", label: "Conductor" },
  { type: "Kilometraje", label: "Kilometraje" },
  { type: "Texto", label: "Placa" },
  { type: "Texto", label: "Responsable de la Inspeccion" },
  { type: "FechasP", label: "Fechas" },
  { type: "Hora", label: "Hora de Ingreso" },
  { type: "Texto", label: "Empresa" },
];

export default function ChecklistTemplateBuilder() {
  const [groups, setGroups] = useState([]);
  const [moveMode, setMoveMode] = useState(false);
  const { filename } = useParams();
  const [script, setScript] = useState(null);
  const [error, setError] = useState(null);

  // ➕ Crear grupo vacío
  const addGroup = () => {
    const id = uuidv4();
    setGroups((prev) => [
      ...prev,
      { id, name: `Grupo ${prev.length + 1}`, fields: [] },
    ]);
  };

  // ➕ Crear grupo con campos predefinidos
  const addPredefinedGroup = () => {
    const id = uuidv4();
    const fieldsWithIds = PREDEFINED_FIELDS.map((f) => ({
      id: uuidv4(),
      type: f.type,
      label: f.label,
      value: null,
      ...(f.type === "FechasP" ? { startDate: "", endDate: "" } : {}),
    }));

    setGroups((prev) => [
      ...prev,
      {
        id,
        name: `Grupo Preestablecido ${prev.length + 1}`,
        fields: fieldsWithIds,
      },
    ]);
  };

  // ➖ Eliminar grupo
  const removeGroup = (groupIndex) => {
    setGroups((prev) => prev.filter((_, i) => i !== groupIndex));
  };

  // ➕ Agregar campo
  const addField = (groupIndex, type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `Nuevo ${type}`,
      value: null,
      ...(type === "FechasP" ? { startDate: "", endDate: "" } : {}),
    };
    const updated = [...groups];
    updated[groupIndex].fields.push(newField);
    setGroups(updated);
  };

  // ✏️ Actualizar campo
  const updateField = (groupIndex, fieldIndex, updatedField) => {
    const newGroups = [...groups];
    newGroups[groupIndex].fields[fieldIndex] = updatedField;
    setGroups(newGroups);
  };

  // ✏️ Actualizar nombre del grupo
  const updateGroupName = (groupIndex, newName) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === groupIndex ? { ...g, name: newName } : g))
    );
  };

  // ➖ Eliminar campo
  const removeField = (groupIndex, fieldIndex) => {
    const updated = [...groups];
    updated[groupIndex].fields.splice(fieldIndex, 1);
    setGroups(updated);
  };

  // 💾 Guardar
  const saveTemplate = () => {
    const updated = { ...script, groups };
    localStorage.setItem("checklistTemplate", JSON.stringify(updated, null, 2));
    alert("✅ Plantilla guardada en localStorage");
  };

  // 🔄 Mover grupo
  const moveGroup = (index, direction) => {
    const updated = [...groups];
    if (direction === "up" && index > 0) {
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    }
    if (direction === "down" && index < updated.length - 1) {
      [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    }
    setGroups(updated);
  };

  // 🔄 Drag & Drop
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setGroups((prev) => {
      const newGroups = [...prev];
      const sourceGroupIndex = newGroups.findIndex((g) => g.id === source.droppableId);
      const destGroupIndex = newGroups.findIndex((g) => g.id === destination.droppableId);

      const sourceFields = Array.from(newGroups[sourceGroupIndex].fields);
      const [movedItem] = sourceFields.splice(source.index, 1);

      if (sourceGroupIndex === destGroupIndex) {
        sourceFields.splice(destination.index, 0, movedItem);
        newGroups[sourceGroupIndex].fields = sourceFields;
      } else {
        const destFields = Array.from(newGroups[destGroupIndex].fields);
        destFields.splice(destination.index, 0, movedItem);
        newGroups[sourceGroupIndex].fields = sourceFields;
        newGroups[destGroupIndex].fields = destFields;
      }

      return newGroups;
    });
  };
// 📂 Cargar script al inicio
useEffect(() => {
  if (!filename) return;

  const file = decodeURIComponent(filename);

  fetch(`/data/${file}`)
    .then((res) => {
      if (!res.ok) throw new Error("No se encontró el archivo");
      return res.json();
    })
    .then((json) => {
      setScript(json);
      if (Array.isArray(json)) {
        setGroups(json);
      } else if (json.groups) {
        setGroups(json.groups);
      }
    })
    .catch((err) => setError(`Error al cargar el script: ${err.message}`));
}, [filename]);


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Constructor de Checklist</h1>

      {/* Botones */}
      <div className="flex gap-2 items-center mb-2">
        <Button onClick={addGroup}>➕ Nuevo Grupo</Button>
        <Button onClick={addPredefinedGroup}>📂 Preestablecidos</Button>
        <Button onClick={saveTemplate}>💾 Guardar</Button>
        <Button variant="outline" onClick={() => setMoveMode(!moveMode)}>
          {moveMode ? "Modo Edición" : "Modo Movimiento"}
        </Button>
      </div>

      {/* Grupos */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          {groups.map((group, groupIndex) => (
            <Droppable droppableId={group.id} key={group.id}>
              {(provided) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-4 border rounded-lg"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                      className="font-semibold border-b border-gray-300 focus:outline-none flex-1 mr-2"
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveGroup(groupIndex, "up")}
                        disabled={groupIndex === 0}
                      >
                        <ArrowUp className="w-5 h-5 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveGroup(groupIndex, "down")}
                        disabled={groupIndex === groups.length - 1}
                      >
                        <ArrowDown className="w-5 h-5 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGroup(groupIndex)}
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Campos */}
                  {moveMode ? (
                    group.fields.map((field, fieldIndex) => (
                      <Draggable key={field.id} draggableId={field.id} index={fieldIndex}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 mb-2 border rounded cursor-move ${
                              snapshot.isDragging ? "bg-blue-100" : "bg-gray-50"
                            }`}
                          >
                            {field.label}
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <AddFieldSelector
                      groupIndex={groupIndex}
                      groupFields={group.fields}
                      addField={addField}
                      updateField={updateField}
                      removeField={removeField}
                    />
                  )}

                  {provided.placeholder}
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Debug opcional */}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Vista previa JSON</h2>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
          {JSON.stringify(groups, null, 2)}
        </pre>
      </div>
    </div>
  );
}

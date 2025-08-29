import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import AddFieldSelector from "../components/AddFieldSelector";

// Lista de preestablecidos (puede crecer dinámicamente)
const PREDEFINED_FIELDS = [
  { type: "Texto", label: "Conductor" },
    { type: "kilometraje", label: "Kilometraje" },
    { type: "Texto", label: "Placa" },
    { type: "Texto", label: "Responsable de la Inspeccion" },
    { type: "Fechas", label: "Fechas" },
    { type: "Hora", label: "Hora de Ingreso" },
    { type: "Texto", label: "Empresa" },
    
];

export default function ChecklistTemplateBuilder() {
  const [groups, setGroups] = useState([]);

  // ➕ Crear nuevo grupo vacío
  const addGroup = () => {
    const id = crypto.randomUUID?.() ?? Date.now();
    setGroups((prev) => [
      ...prev,
      { id, name: `Grupo ${prev.length + 1}`, fields: [] },
    ]);
  };

  // ➕ Crear grupo con campos preestablecidos
  const addPredefinedGroup = () => {
    const id = crypto.randomUUID?.() ?? Date.now();
    setGroups((prev) => [
      ...prev,
      { id, name: `Grupo Preestablecido ${prev.length + 1}`, fields: [...PREDEFINED_FIELDS] },
    ]);
  };

  // ➖ Eliminar grupo
  const removeGroup = (groupIndex) => {
    const updatedGroups = [...groups];
    updatedGroups.splice(groupIndex, 1);
    setGroups(updatedGroups);
  };

  // ➕ Agregar campo a un grupo
  const addField = (groupIndex, type) => {
    const newField = { type, label: `Nuevo ${type}` };
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].fields.push(newField);
    setGroups(updatedGroups);
  };

  // ✏️ Actualizar campo
  const updateField = (groupIndex, fieldIndex, updatedField) => {
    const newGroups = [...groups];
    newGroups[groupIndex].fields[fieldIndex] = updatedField;
    setGroups(newGroups);
  };
  // ✏️ Actualizar campo DE GRUPOS 
  const updateGroupName = (groupIndex, newName) => {
  setGroups((prevGroups) =>
    prevGroups.map((g, i) =>
      i === groupIndex ? { ...g, name: newName } : g
    )
  );
};

  // ➖ Eliminar campo
  const removeField = (groupIndex, fieldIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].fields.splice(fieldIndex, 1);
    setGroups(updatedGroups);
  };

  // 💾 Guardar plantilla
  const saveTemplate = () => {
    localStorage.setItem("checklistTemplate", JSON.stringify(groups));
    alert("✅ Plantilla guardada en localStorage");
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Constructor de Checklist</h1>

      {/* Botones principales */}
      <div className="flex gap-2 items-center mb-2">
        {/* Botón normal de agregar manual */}
        <Button onClick={addGroup}>➕ Agregar Grupo</Button>
        <Button onClick={addPredefinedGroup}>📂 Agregar Preestablecidos</Button>
        <Button onClick={saveTemplate}>💾 Guardar </Button>
      </div>

      <div className="space-y-4">
        {groups.map((group, groupIndex) => (
          <Card key={group.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={group.name}
                onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                className="font-semibold border-b border-gray-300 focus:outline-none flex-1 mr-2"
              />
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-100 text-red-600"
                onClick={() => removeGroup(groupIndex)}
              >
                <Trash2 size={18} />
              </Button>
            </div>

            <AddFieldSelector
              groupIndex={groupIndex}
              groupFields={group.fields}
              addField={addField}
              updateField={updateField}
              removeField={removeField}
            />
          </Card>
        ))}
      </div>

      {/* Vista previa del script */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Vista previa del script</h2>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
          {JSON.stringify(groups, null, 2)}
        </pre>
      </div>
    </div>
  );
}
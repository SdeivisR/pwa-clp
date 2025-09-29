// src/pages/cPlant.jsx
import { useEffect, useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2, Plus,FileText,Save,Move,Settings,FilePlus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useLocation } from "react-router-dom";
import InputModal from "../components/InputModal";
import AddFieldSelector from "../components/AddFieldSelector";
import OverwriteModal from "../components/OverwriteModal";
import Banner from "../components/Banner";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";




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
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [estructura, setEstructura] = useState({ grupos: [] });
  const location = useLocation();
  const [plantillas, setPlantillas] = useState([]);
  const [overwriteModalVisible, setOverwriteModalVisible] = useState(false);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerType, setBannerType] = useState("success");
  const [loading, setLoading] = useState(false);
  const id = location.state?.id;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    setEstructura({ grupos: groups });
  }, [groups]);

  // ➕ Crear grupo vacío
  const addGroup = () => {
    const id = uuidv4();
    const newGroup = { id, name: `Grupo ${groups.length + 1}`, fields: [] };
    const newGroups = [...groups, newGroup];
    setGroups(newGroups); // estructura se actualizará por useEffect
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

    const newGroups = [
      ...groups,
      {
        id,
        name: `Grupo Preestablecido ${groups.length + 1}`,
        fields: fieldsWithIds,
      },
    ];
    setGroups(newGroups);
  };

  // ➖ Eliminar grupo
  const removeGroup = (groupIndex) => {
    const newGroups = groups.filter((_, i) => i !== groupIndex);
    setGroups(newGroups);
  };

  // ➕ Agregar campo
  const addField = (groupIndex, type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `Nuevo ${type}`,
      value: null,
      ...(type === "FechasP" ? { startDate: "", endDate: "" } : {}),
      ...(type === "Checkbox" ? { cB: null } : {}),
      ...(type === "Texto + Si/No" ? { cB: null } : {}),
      ...(type === "Firma + Texto" ? { com: null } : {}),

    };
    const newGroups = groups.map((g, i) =>
      i === groupIndex ? { ...g, fields: [...g.fields, newField] } : g
    );

    setGroups(newGroups);

    setBanner(`${type} ha sido añadido`);
    setBannerType("success");
    setTimeout(() => setBanner(null), 1500);
  };

  // ✏️ Actualizar campo
  const updateField = (groupIndex, fieldIndex, updatedField) => {
    const newGroups = groups.map((g, i) =>
      i === groupIndex
        ? { ...g, fields: g.fields.map((f, fi) => (fi === fieldIndex ? updatedField : f)) }
        : g
    );
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
    const newGroups = groups.map((g, i) =>
      i === groupIndex ? { ...g, fields: g.fields.filter((_, fi) => fi !== fieldIndex) } : g
    );
    setGroups(newGroups);
  };

  // 💾 Guardar
  const saveTemplate = async (datos) => {
    try {
      // Validaciones
      if (!datos.titulo || !datos.descripcion) {
        throw new Error("Debe ingresar título y descripción");
      }

      const response = await fetch("http://localhost:3000/api/plantillas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: datos.titulo,
          descripcion: datos.descripcion,
          estructura_json: groups,
          creado_por: user?.id ?? null  
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error en servidor (${response.status}): ${text}`);
      }

      const result = await response.json();
        setBanner("✅ Realizado Correctamente");
            setBannerType("success");
            setTimeout(() => {
              setBanner(null);
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                navigate("/gPlant");
              }, 500);
            }, 1000);
            return result;
          } catch (error) {
            setBanner(`❌ ${error.message}`);
            setBannerType("error");
            setTimeout(() => {
              setBanner(null);
            }, 1000);

            throw error;
          }
        };


  //Metodo para sobreescribir
  const overwriteTemplate = async (datos) => {
    try {
      if (!datos.titulo || !datos.descripcion) {
        throw new Error("Debe ingresar título y descripción");
      }

      const response = await fetch(
        `http://localhost:3000/api/plantillas/${plantillaSeleccionada.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            estructura_json: groups,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error en servidor (${response.status}): ${text}`);
      }

      const result = await response.json();
        setBanner("✅ Realizado Correctamente");
          setBannerType("success");
          setTimeout(() => {
            setBanner(null);
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigate("/gPlant");
            }, 500);
          }, 1000);
          return result;
        } catch (error) {
          setBanner(`❌ ${error.message}`);
          setBannerType("error");
          setTimeout(() => {
            setBanner(null);
          }, 1000);
          throw error;
        }
      };
  // 🔄 Mover grupo
  const moveGroup = (index, direction) => {
    const newGroups = [...groups];
    if (direction === "up" && index > 0) {
      [newGroups[index - 1], newGroups[index]] = [newGroups[index], newGroups[index - 1]];
      setGroups(newGroups);
    }
    if (direction === "down" && index < newGroups.length - 1) {
      [newGroups[index + 1], newGroups[index]] = [newGroups[index], newGroups[index + 1]];
      setGroups(newGroups);
    }
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
  //Banners para botones
  const showBanner = (message, type = "info") => {
  setBanner(message);
  setBannerType(type);
  setTimeout(() => setBanner(null), 1500);
};
  useEffect(() => {
    if (!id) {
      // 🔹 si no hay id en la URL, limpiamos todo
      setPlantillaSeleccionada(null);
      setGroups([]);
      return;
    }
    fetch("http://localhost:3000/api/plantillas")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error al obtener plantillas (${res.status}): ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setPlantillas(data);

        let plantilla;

        if (id) {
          // 🔎 Buscar plantilla con ese id
          plantilla = data.find((p) => String(p.id) === String(id));
          if (!plantilla) {
            setError(`Plantilla con id ${id} no encontrada`);
            setGroups([]);
            return; // no seguimos si no existe
          }
          setPlantillaSeleccionada(plantilla); // ✅ solo si existe
        } else {
          // Si no hay id, tomar la primera (opcional)
          plantilla = data[0] || null;
          if (plantilla) {
            setPlantillaSeleccionada(plantilla);
          }
        }

        if (plantilla?.estructura_json) {
          try {
            let parsed = plantilla.estructura_json;

            // 👇 Si viene como string desde la BD, parseamos
            if (typeof parsed === "string") {
              parsed = JSON.parse(parsed);
            }

            const grupos = Array.isArray(parsed)
              ? parsed
              : Array.isArray(parsed.grupos)
              ? parsed.grupos
              : [];

            setGroups(grupos);
          } catch (err) {
            setError("Error al parsear estructura_json");
            console.error(
              "❌ Error al parsear estructura_json:",
              err,
              plantilla.estructura_json
            );
            setGroups([]);
          }
        } else {
          setGroups([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(`Error al cargar las plantillas: ${err.message}`);
        setGroups([]);
      });
  }, [id]);
  return (
    
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Constructor de Checklist</h1>

      {/* Botones */}
      <div className="flex flex-wrap gap-3 items-center mb-4 p-3 bg-gray-50 rounded-lg shadow-sm">
        <Button
          className="flex-1 min-w-[160px] h-11 flex items-center justify-center gap-2"
          onClick={() => {
            setLoading(true); // 🔹 activar spinner
            setTimeout(() => {
              setPlantillaSeleccionada(null);
              setGroups([]);
              setLoading(false); 
              navigate("/cPlant"); // limpiar URL
            }, 100);
          }}
        >
          <FilePlus className="w-5 h-5" />
          Crear Nueva Plantilla
        </Button>
        <Button
          className="flex-1 min-w-[160px] h-11 flex items-center justify-center gap-2"
          onClick={() => {
            addGroup();
            showBanner("Nuevo grupo creado", "success");
          }}
        >
          <Plus className="w-5 h-5" />
          Nuevo Grupo
        </Button>
        <Button
        className="flex-1 min-w-[160px] h-11 flex items-center justify-center gap-2"
        onClick={() => {
          addPredefinedGroup();
          showBanner("Grupo preestablecido agregado", "info");
        }}
        >
          <FileText className="w-5 h-5" />
          Preestablecidos
        </Button>
        <Button
          className="flex-1 min-w-[160px] h-11 flex items-center justify-center gap-2"
          onClick={() => {
            if (id) {
              setPlantillaSeleccionada({
                id,
                titulo: plantillaSeleccionada?.titulo,
                descripcion: plantillaSeleccionada?.descripcion,
              });
              setOverwriteModalVisible(true);
            } else {
              setModalVisible(true);
            }
          }}
        >
          <Save className="w-5 h-5" />
          {id ? "Sobreescribir" : "Guardar"}
        </Button>
        <Button
          className="flex-1 min-w-[160px] h-11 flex items-center justify-center gap-2"
          onClick={() => {
            setMoveMode(!moveMode);
            showBanner(
              !moveMode ? "Activado modo edición" : "Activado modo movimiento",
              "info"
            );
          }}
        >
          <Move className="w-5 h-5" />
          {moveMode ? "Modo Edición" : "Modo Movimiento"}
        </Button>
        <Button
          className="flex-1 min-w-[160px] h-11 flex items-center justify-center gap-2"
          onClick={() => {
            setLoading(true); // 🔹 activar spinner
            setTimeout(() => {
              setLoading(false); 
              navigate("/gPlant");
            }, 100); // 🔹 espera 0.5s
          }}
        >
          <Settings className="w-5 h-5" />
          Gestionar Plantillas
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
      {modalVisible && (
        <InputModal
          onClose={() => setModalVisible(false)} // para cerrar el modal desde adentro
          onSave={(titulo, descripcion) => {
            saveTemplate(titulo, descripcion); // llama a tu función
            setModalVisible(false); // cerrar luego de guardar
          }}
        />
      )}
      {overwriteModalVisible && (
        <OverwriteModal
          plantilla={plantillaSeleccionada}
          onClose={() => setOverwriteModalVisible(false)}
          onOverwrite={(datos) => {
            overwriteTemplate(datos); // PUT
            setOverwriteModalVisible(false);
          }}
        />
      )}
      {banner && (
        <Banner
          message={banner}
          type={bannerType}
          onClose={() => setBanner(null)}
        />
      )}
      {loading && <Spinner />}
        {banner && <Banner message={banner} type={bannerType} onClose={() => setBanner(null)} />}
      {/* Debug opcional */}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {user?.rol_id === 3 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Vista previa JSON</h2>
          <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(groups, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

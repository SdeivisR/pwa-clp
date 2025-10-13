export function clasificarChecklists(jsonData) {
  return jsonData.map((checklist) => {
    const errores = [];
    let fields = [];

    // Parseamos JSON si es string
    let json;
    try {
      json = typeof checklist.contenido_json === "string"
        ? JSON.parse(checklist.contenido_json)
        : checklist.contenido_json;
    } catch (e) {
      console.error(`Checklist ${checklist.id} JSON inválido`, e);
      return {
        checklistId: checklist.id,
        estado: "Pendiente",
        errores: ["JSON inválido"]
      };
    }

    // Verificamos estructura_json
    if (!json || !json.estructura_json) {
      console.warn(`Checklist ${checklist.id} no tiene estructura_json`);
      return {
        checklistId: checklist.id,
        estado: "Pendiente",
        errores: ["No tiene estructura_json"]
      };
    }

    // Aplanamos todos los fields
    json.estructura_json.forEach((grupo) => {
      if (grupo.fields && Array.isArray(grupo.fields)) {
        fields.push(...grupo.fields);
      }
    });

    // Clasificamos errores sobre items planos
        fields.forEach((field) => {
        let respuesta = "";

        if (field.type === "Checkbox") {
            respuesta = field.cB;
        } else if (field.type === "Texto + Si/No") {
            respuesta = field.cB;
        }

        if (respuesta === "no") {
            errores.push(field.label);
        }
        });
    return {
      checklistId: checklist.id || "N/A",
      folio: checklist.folio || "SIN-FOLIO",
      estado: errores.length > 0 ? "Mantenimiento" : "Completado",
      errores,
    };
  });
}
export function calcularScoreSalud(jsonData) {
  return jsonData.map((checklist) => {
    let fields = [];

    // Parseamos JSON si es string
    let json;
    try {
      json = typeof checklist.contenido_json === "string"
        ? JSON.parse(checklist.contenido_json)
        : checklist.contenido_json;
    } catch (e) {
      console.error(`Checklist ${checklist.id} JSON inválido`, e);
      return {
        checklistId: checklist.id,
        score: 0,
        color: "gray",
      };
    }

    if (!json || !json.estructura_json) {
      console.warn(`Checklist ${checklist.id} no tiene estructura_json`);
      return {
        checklistId: checklist.id,
        score: 0,
        color: "gray",
      };
    }

    // Aplanamos todos los fields
    json.estructura_json.forEach((grupo) => {
      if (grupo.fields && Array.isArray(grupo.fields)) {
        fields.push(...grupo.fields);
      }
    });

    // Filtramos solo los campos evaluables
    const camposEvaluables = fields.filter(f => f.type === "Checkbox" || f.type === "Texto + Si/No");
    
    const total = camposEvaluables.length;

    // Contamos los correctos según el tipo
    const correctos = camposEvaluables.filter(f => {
      if (f.type === "Checkbox") {
        return f.cB?.toLowerCase() === "si"; // Checkbox marcado como sí
      }
      if (f.type === "Texto" || f.type === "Texto + Si/No") {
        return f.cB?.toLowerCase() === "si"; // Texto que diga "si"
      }
      return false;
    }).length;
    const score = total > 0 ? Math.round((correctos / total) * 100) : 0;

    // Asignamos color según score
    let color = "text-red-500";       // Muy bajo
    if (score >= 90) color = "text-green-600";  // Excelente
    else if (score >= 80) color = "text-green-500"; // Muy bueno
    else if (score >= 70) color = "text-lime-500";  // Bueno
    else if (score >= 50) color = "text-yellow-500"; // Medio
    else if (score >= 30) color = "text-orange-500"; // Bajo

    return {
      checklistId: checklist.id || "N/A",
      folio: checklist.folio || "SIN-FOLIO",
      score,
      color,
    };
  });
}
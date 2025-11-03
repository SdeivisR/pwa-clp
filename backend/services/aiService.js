// aiService.js en backend
const { DecisionTreeClassifier } = require("ml-cart");

/**
 * Entrena un modelo con los checklists históricos.
 * @param {Array} jsonData - Lista de checklists con score y estado real.
 * @returns {Object|null} modelo entrenado listo para predecir
 */
function entrenarModeloChecklists(jsonData) {
  const data = [];
  const labels = [];

  jsonData.forEach((checklist) => {
    try {
      const contenido =
        typeof checklist.contenido_json === "string"
          ? JSON.parse(checklist.contenido_json)
          : checklist.contenido_json;

      if (!contenido || !contenido.estructura_json) return;

      const fields = [];
      contenido.estructura_json.forEach((grupo) => {
        if (grupo.fields && Array.isArray(grupo.fields)) {
          fields.push(...grupo.fields);
        }
      });

      const total = fields.length;
      const negativos = fields.filter(
        (f) => f.cB?.toLowerCase() === "no"
      ).length;
      const positivos = fields.filter(
        (f) => f.cB?.toLowerCase() === "si"
      ).length;

      const score = total > 0 ? Math.round((positivos / total) * 100) : 0;

      data.push([score, negativos]);
      labels.push(checklist.estado === "Completado" ? 1 : 0);
    } catch (err) {
      console.error("Error procesando checklist IA:", err);
    }
  });

  if (data.length === 0) {
    console.warn("⚠️ No hay datos suficientes para entrenar el modelo IA");
    return null;
  }

  // Entrenamos el modelo
  const model = new DecisionTreeClassifier({
    gainFunction: "gini",
    maxDepth: 5,
  });
  model.train(data, labels);
  return model;
}


/**
 * Predice el estado de un checklist nuevo basado en el modelo IA.
 * @param {Object} model - Modelo entrenado
 * @param {Object} checklist - Nuevo checklist
 * @returns {Object} Resultado con predicción
 */
function predecirEstadoChecklist(model, checklist) {
  try {
    const contenido =
      typeof checklist.contenido_json === "string"
        ? JSON.parse(checklist.contenido_json)
        : checklist.contenido_json;

    if (!contenido || !contenido.estructura_json) {
      return { prediccion: "Desconocido", probabilidad: 0 };
    }

    const fields = contenido.estructura_json.flatMap(
      (g) => g.fields || []
    );

    const total = fields.length;
    const negativos = fields.filter(
      (f) => f.cB?.toLowerCase() === "no"
    ).length;
    const positivos = fields.filter(
      (f) => f.cB?.toLowerCase() === "si"
    ).length;

    const score = total > 0 ? Math.round((positivos / total) * 100) : 0;

    // Predicción del modelo
    const pred = model.predict([[score, negativos]])[0];
    const estadoPredicho = pred === 1 ? "Completado" : "Pendiente";

    return {
      checklistId: checklist.id || "N/A",
      score,
      negativos,
      estadoPredicho,
    };
  } catch (err) {
    console.error("Error al predecir con IA:", err);
    return { estadoPredicho: "Error", probabilidad: 0 };
  }
}

module.exports = { entrenarModeloChecklists, predecirEstadoChecklist };

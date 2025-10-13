//aiController
const { entrenarModeloChecklists, predecirEstadoChecklist } = require("../services/aiService.js");
const pool = require("../db.js"); 

let modeloEntrenado = null;

// 🧠 Entrenar el modelo con los checklists históricos desde la base de datos
async function entrenarModelo(req, res) {
  try {
    // 1️⃣ Obtener datos de la BD
    const [rows] = await pool.query(`
      SELECT contenido_json, estado_id
      FROM checklists
      WHERE estado_id IS NOT NULL
    `);

    if (!rows || rows.length === 0) {
      console.warn("⚠️ [IA] No se encontraron checklists en la base de datos");
      return res
        .status(404)
        .json({ error: "No hay datos suficientes para entrenar el modelo" });
    }

    // 2️⃣ Transformar los datos
    const datos = rows
      .map((row) => {
        try {
          const contenido =
            typeof row.contenido_json === "string"
              ? JSON.parse(row.contenido_json)
              : row.contenido_json;

          if (!contenido || !contenido.estructura_json) return null;

        const fields = [];
        contenido.estructura_json.forEach((grupo) => {
          if (grupo.fields && Array.isArray(grupo.fields)) {
            fields.push(...grupo.fields);
          }
        });

        return {
            estado: row.estado_id === 1 ? "Completado" : "Pendiente", // 🟢 Ajuste clave
            contenido_json: contenido,
          };
        } catch (err) {
          console.error("⚠️ Error procesando checklist:", err);
          return null;
        }
      })
      .filter(Boolean);

    if (datos.length === 0) {
      console.warn("⚠️ [IA] Ningún checklist válido para entrenar");
      return res.status(400).json({
        error: "No se pudieron procesar los datos del checklist",
      });
    }
    // 3️⃣ Entrenar el modelo con los datos reales
    modeloEntrenado = entrenarModeloChecklists(datos);

    if (modeloEntrenado) {
      return res.json({
        message: "Modelo IA entrenado correctamente",
        registros: datos.length,
      });
    } else {
      console.error("❌ [IA] No se pudo entrenar el modelo IA");
      return res.status(400).json({
        error: "No se pudo entrenar el modelo IA (sin datos útiles)",
      });
    }
  } catch (error) {
    console.error("💥 [IA] Error al entrenar el modelo:", error);
    return res.status(500).json({
      error: "Error interno al entrenar el modelo IA",
      detalle: error.message,
    });
  }
}
// 🤖 Predecir el estado de un nuevo checklist
function predecirChecklist(req, res) {
  if (!modeloEntrenado) {
    return res.status(400).json({ error: "El modelo IA no está entrenado" });
  }

  try {
    const checklist = req.body;
    const resultado = predecirEstadoChecklist(modeloEntrenado, checklist);
    return res.json(resultado);
  } catch (err) {
    console.error("💥 [IA] Error durante la predicción:", err);
    return res.status(500).json({ error: "Error interno al predecir el checklist" });
  }
}

module.exports = { entrenarModelo, predecirChecklist };
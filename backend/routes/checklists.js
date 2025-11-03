//routes/checklists.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const moment = require("moment-timezone");
// POST /checklists -> guardar un checklist
router.post("/", async (req, res) => {
  try {
    const { vehiculo_id, plantilla_id, contenido_json } = req.body;

    // Hora actual de Lima (-05:00)
    const fecha_creacion = moment()
      .tz("America/Lima")
      .format("YYYY-MM-DD HH:mm:ss");

    // 1️⃣ Buscar código de la plantilla
    const [plantillas] = await pool.query(
      "SELECT codigo FROM plantillas WHERE id = ?",
      [plantilla_id]
    );

    if (plantillas.length === 0) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    const codigo = plantillas[0].codigo;

    // 2️⃣ Buscar el último número de plantilla para esta plantilla_id
    const [rows] = await pool.query(
      "SELECT MAX(numero_plantilla) AS ultimo FROM checklists WHERE plantilla_id = ?",
      [plantilla_id]
    );

    const ultimo = rows[0].ultimo || 0;
    const nuevoNumero = ultimo + 1;

    // 3️⃣ Generar folio
    const folio = `${codigo}-${String(nuevoNumero).padStart(3, "0")}`;

    // 4️⃣ Insertar checklist
    const query = `
      INSERT INTO checklists
      (vehiculo_id, plantilla_id, numero_plantilla, folio, estado_id, contenido_json, fecha_creacion, fecha_salida)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      vehiculo_id,
      plantilla_id,
      nuevoNumero,
      folio,            // ← Nuevo campo folio
      1,                // Estado inicial: Pendiente
      contenido_json,
      fecha_creacion,
      null,
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      message: "Checklist guardado correctamente",
      insertId: result.insertId,
      numero_plantilla: nuevoNumero,
      folio: folio
    });
  } catch (err) {
    console.error("Error al guardar checklist:", err);
    res.status(500).json({ message: "Error al guardar el checklist" });
  }
});
// GET /checklists -> listar todos
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.vehiculo_id,
        c.plantilla_id,
        p.codigo AS plantilla_codigo,       -- 🔥 Traemos el código
        c.numero_plantilla,
        c.estado_id,
        e.nombre AS estado_nombre,
        c.contenido_json,
        c.fecha_creacion,
        c.fecha_salida
      FROM checklists c
      LEFT JOIN estados e ON c.estado_id = e.id
      LEFT JOIN plantillas p ON c.plantilla_id = p.id   -- 🔥 Join con plantillas
      ORDER BY c.fecha_creacion DESC
    `;

    const [rows] = await pool.query(query);

    // 🔥 Formamos el folio tipo "PLA-001"
    const checklists = rows.map(chk => ({
      ...chk,
      folio: `${chk.plantilla_codigo || "SIN"}-${String(chk.numero_plantilla).padStart(3, "0")}`
    }));

    res.json(checklists);
  } catch (err) {
    console.error("Error al obtener checklists:", err);
    res.status(500).json({ message: "Error al obtener checklists" });
  }
});
// GET /checklists/:id -> obtener un checklist específico
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        c.id,
        c.vehiculo_id,
        c.plantilla_id,
        p.codigo AS plantilla_codigo,
        c.numero_plantilla,
        c.estado_id,
        e.nombre AS estado_nombre,
        c.contenido_json,
        c.fecha_creacion,
        c.fecha_salida
      FROM checklists c
      LEFT JOIN estados e ON c.estado_id = e.id
      LEFT JOIN plantillas p ON c.plantilla_id = p.id
      WHERE c.id = ?
    `;

    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Checklist no encontrado" });
    }
    // Armar el folio
    const chk = rows[0];
    const checklist = {
      ...chk,
      folio: `${chk.plantilla_codigo || "SIN"}-${String(chk.numero_plantilla).padStart(3, "0")}`
    };
    res.json(checklist);
  } catch (err) {
    console.error("Error al obtener checklist:", err);
    res.status(500).json({ message: "Error al obtener checklist" });
  }
});
// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const [result] = await pool.query("DELETE FROM checklists WHERE id = ?", [id]);


    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Checklist no encontrada" });
    }

    res.json({ message: "Checklist eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar Checklist:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});
// PUT
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { estado_id } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
    if (!estado_id) return res.status(400).json({ error: "estado_id requerido" });

    const [result] = await pool.query(
      "UPDATE checklists SET estado_id = ? WHERE id = ?",
      [estado_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Checklist no encontrada" });
    }

    res.json({ message: "Checklist actualizada con éxito" });
  } catch (error) {
    console.error("Error actualizando checklist:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
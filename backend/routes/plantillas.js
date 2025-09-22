const express = require("express");
const router = express.Router();
const pool = require("../db");

// 📌 Crear una nueva plantilla
router.post("/", async (req, res) => {
  try {
    const { titulo, descripcion, estructura_json, creado_por } = req.body;

    if (!titulo || !estructura_json) {
      return res.status(400).json({ error: "Título y estructura_json son obligatorios" });
    }

    const fecha = new Date().toISOString();

    const [result] = await pool.query(
      "INSERT INTO plantillas (titulo, descripcion, estructura_json, creado_por, fecha_creacion, fecha_modificacion) VALUES (?, ?, ?, ?, ?, ?)",
      [titulo, descripcion, JSON.stringify(estructura_json), creado_por, fecha, fecha]
    );

    res.status(201).json({ 
      message: "Plantilla creada con éxito", 
      id: result.insertId,
      fecha_creacion: fecha,
      fecha_modificacion: fecha
    });
  } catch (error) {
    console.error("Error al crear plantilla:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 📌 Obtener todas las plantillas
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM plantillas ORDER BY fecha_modificacion DESC");

    // 🔥 Aquí parseamos el JSON antes de enviarlo al frontend
    const plantillas = rows.map((p) => ({
      ...p,
      estructura_json: p.estructura_json ? JSON.parse(p.estructura_json) : null
    }));

    res.json(plantillas);
  } catch (error) {
    console.error("Error al obtener plantillas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});



// 📌 Actualizar plantilla existente
// PUT /api/plantillas/:id/full
router.put("/:id/full", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estructura_json } = req.body;

  try {
    const fecha = new Date().toISOString();
    const [result] = await pool.query(
      "UPDATE plantillas SET titulo = ?, descripcion = ?, estructura_json = ?, fecha_modificacion = ? WHERE id = ?",
      [titulo, descripcion, JSON.stringify(estructura_json || {}), fecha, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    res.json({ mensaje: "Plantilla actualizada correctamente" });
  } catch (err) {
    console.error("❌ Error en PUT /plantillas/:id/full:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// PUT /api/plantillas/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estructura_json } = req.body;

  if (!estructura_json) {
    return res.status(400).json({ error: "estructura_json es obligatorio" });
  }

  try {
    const fecha = new Date().toISOString();
    const [result] = await pool.query(
      `UPDATE plantillas
       SET titulo = ?, descripcion = ?, estructura_json = ?, fecha_modificacion = ?
       WHERE id = ?`,
      [titulo, descripcion, JSON.stringify(estructura_json), fecha, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    res.json({ mensaje: "Plantilla actualizada correctamente", id });
  } catch (err) {
    console.error("❌ Error al actualizar plantilla:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});




// 🗑️ Eliminar plantilla
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log("Intentando eliminar plantilla con id:", id);

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const [result] = await pool.query("DELETE FROM plantillas WHERE id = ?", [id]);
    console.log("Resultado del DELETE:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    res.json({ message: "Plantilla eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar plantilla:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;

//routes/dashboards.js
const express = require("express");
const router = express.Router();
const { clasificarChecklists, calcularScoreSalud } = require("../services/dashboardService");
const db = require("../db");
// GET /checklist
router.get("/checklists", async (req, res) => {
  try {
    const [checklists] = await db.query(
      "SELECT id, contenido_json, folio FROM checklists"
    );

    const resultados = clasificarChecklists(checklists);
    res.json(resultados);
  } catch (err) {
    console.error("Error dashboard:", err);
    res.status(500).json({ error: err.message });
  }
});
// GET /scoreSalud
router.get('/scoreSalud', async (req, res) => {
  try {
    const [checklists] = await db.query(
      'SELECT id, contenido_json, folio FROM checklists'
    );
    const checklistsConErrores = clasificarChecklists(checklists);
    const scoreSalud = calcularScoreSalud(checklists);
    res.json({
      checklists: checklistsConErrores,
      scoreSalud,
    });
  } catch (error) {
    console.error("Error dashboard:", error);
    res.status(500).json({ error: "Error al obtener datos del dashboard" });
  }
});
// GET /checklists/:id
router.get("/checklists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT id, contenido_json, folio FROM checklists WHERE id = ? OR folio = ?",
      [id, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Checklist no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error obteniendo checklist por ID:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;

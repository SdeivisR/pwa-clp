//routes/pdf.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
// GET/generate-pdf/:id
router.get("/generate-pdf/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT contenido_json FROM checklists WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    if (!rows.length) return res.status(404).send("Checklist no encontrado");
    const contenido = JSON.parse(rows[0].contenido_json);
    res.json(contenido);
  } catch (err) {
    console.error("Error al obtener checklist:", err);
    res.status(500).send("Error al obtener checklist");
  }
});

module.exports = router;

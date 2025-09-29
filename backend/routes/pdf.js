const express = require("express");
const router = express.Router(); // 🔥 Esto faltaba
const pool = require("../db"); // tu conexión a DB

router.get("/generate-pdf/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `SELECT contenido_json FROM checklists WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);

    if (!rows.length) return res.status(404).send("Checklist no encontrado");

    const contenido = JSON.parse(rows[0].contenido_json);
    console.log("Contenido JSON recibido:", contenido); // Verificación en consola

    // Por ahora solo devolvemos el JSON para verificar
    res.json(contenido);

  } catch (err) {
    console.error("Error al obtener checklist:", err);
    res.status(500).send("Error al obtener checklist");
  }
});

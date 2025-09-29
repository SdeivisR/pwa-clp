const express = require("express");
const router = express.Router();
const pool = require("../db"); // tu conexión MySQL

// Crear vehículo nuevo
router.post("/", async (req, res) => {
  try {
    const { placa, conductor } = req.body;

    // Insertar vehículo
    const [result] = await pool.execute(
      "INSERT INTO vehiculos (placa, conductor) VALUES (?, ?)",
      [placa ?? null, conductor ?? null]
    );

    res.json({ vehiculo_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el vehículo" });
  }
});

// Buscar vehículo por placa
router.get("/", async (req, res) => {
  try {
    const { placa } = req.query;

    if (!placa) {
      return res.status(400).json({ error: "Se requiere una placa" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM vehiculos WHERE placa = ?",
      [placa]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al buscar vehículo" });
  }
});

module.exports = router;

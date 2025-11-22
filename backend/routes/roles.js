//routes/roles.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET todos los roles
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, rol_nombre FROM roles");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error obteniendo roles:", err);
    res.status(500).json({ error: "Error obteniendo roles" });
  }
});


// PUT /Actualizar datos del usuario (nombre, email, rol)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol_id } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE usuarios SET nombre = ?, email = ?, rol_id = ? WHERE id = ?",
      [nombre, email, rol_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error actualizando usuario:", err);
    res.status(500).json({ error: "Error actualizando usuario" });
  }
});

router.post("/", async (req, res) => {
  const { nombre, email, rol_id, password } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, rol_id, password) VALUES (?, ?, ?, ?)",
      [nombre, email, rol_id, password]
    );

    res.json({ id: result.insertId, nombre, email, rol_id, password });

  } catch (err) {
    console.error("❌ Error creando usuario:", err);
    res.status(500).json({ error: "Error creando usuario" });
  }
});



module.exports = router;

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
//PUT/Actualizar rol de usuario
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { rol_id } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE usuarios SET rol_id = ? WHERE id = ?",
      [rol_id, id]
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


module.exports = router;

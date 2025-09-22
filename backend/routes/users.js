// routes/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db"); // tu archivo db.js

const router = express.Router();

// 📌 Verificar si correo existe
router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "El correo es requerido" });

  try {
    const [rows] = await db.query(
      "SELECT id, nombre, email FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      res.json({ exists: true, user: rows[0] });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Registrar usuario nuevo
router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ error: "Todos los campos son requeridos" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, 2] // rol_id = 2 por defecto
    );

    res.json({ success: true, userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Todos los campos son requeridos" });

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (rows.length === 0)
      return res.status(400).json({ error: "Correo no registrado" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ error: "Contraseña incorrecta" });

    res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol_id: user.rol_id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const plantillasRoutes = require("./routes/plantillas");
const usersRoutes = require("./routes/users"); // <-- importante

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/plantillas", plantillasRoutes);
app.use("/api/users", usersRoutes); // <-- la ruta base debe ser /api/users

// Test
app.get("/api/hola", (req, res) => {
  res.json({ mensaje: "Hola desde el backend 🚀" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

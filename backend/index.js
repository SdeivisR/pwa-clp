require("dotenv").config();
const express = require("express");
const cors = require("cors");

const plantillasRoutes = require("./routes/plantillas");
const usersRoutes = require("./routes/users");
const rolesRoutes = require("./routes/roles");
const checklistsRouter = require("./routes/checklists");
const vehiculosRouter = require("./routes/vehiculos");
const pdfRoutes = require("./routes/pdf"); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas
app.use("/api/plantillas", plantillasRoutes);
app.use("/api/users", usersRoutes); 
app.use("/api/roles", rolesRoutes);
app.use("/api/checklists", checklistsRouter); 
app.use("/api/vehiculos", vehiculosRouter); 
app.use("/api/pdf", pdfRoutes);


// Test
app.get("/api/hola", (req, res) => {
  res.json({ mensaje: "Hola desde el backend 🚀" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

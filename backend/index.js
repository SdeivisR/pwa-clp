//index..js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const plantillasRoutes = require("./routes/plantillas");
const usersRoutes = require("./routes/users");
const rolesRoutes = require("./routes/roles");
const checklistsRouter = require("./routes/checklists");
const vehiculosRouter = require("./routes/vehiculos");
const pdfRoutes = require("./routes/pdf"); 
const recomendacionesRouter = require("./routes/recomendaciones");
const dashboardsRouter = require("./routes/dashboards");
const aiRoutes = require("./routes/aiRoutes.js") ;
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
app.use("/api/recomendaciones", recomendacionesRouter);
app.use('/api/dashboards', dashboardsRouter);
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

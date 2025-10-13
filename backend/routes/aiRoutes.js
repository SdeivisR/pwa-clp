const express = require("express");
const router = express.Router();
const { entrenarModelo, predecirChecklist } = require("../controllers/aiController.js");

// Rutas IA
router.post("/entrenar", entrenarModelo);
router.post("/predecir", predecirChecklist);

module.exports = router;
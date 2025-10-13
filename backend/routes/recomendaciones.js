//routes/recomendaciones.js
const express = require('express');
const { generarRecomendaciones } = require('../services/geminiService');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const recomendaciones = await generarRecomendaciones(data);

    res.json({ recomendaciones });
  } catch (error) {
    console.error('Error en recomendaciones:', error);
    res.status(500).json({ error: 'Error generando recomendaciones' });
  }
});

module.exports = router;
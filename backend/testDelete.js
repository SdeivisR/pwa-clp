const pool = require("./db"); // la ruta a tu pool de conexión
(async () => {
  try {
    const id = 4; // cambia al id que quieres borrar
    console.log("Intentando borrar plantilla con id:", id);

    const [result] = await pool.query("DELETE FROM plantillas WHERE id = ?", [id]);
    console.log("Resultado DELETE:", result);

    const [rows] = await pool.query("SELECT * FROM plantillas WHERE id = ?", [id]);
    console.log("Verificando si queda algo:", rows);
  } catch (err) {
    console.error("Error al borrar plantilla:", err);
  } finally {
    pool.end();
  }
})();

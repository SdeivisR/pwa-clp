// aiService.js en Frontend
// 🧠 Entrenar modelo IA (NO envía datos, el backend los obtiene de la BD)
export async function entrenarModeloIA() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/entrenar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error al entrenar el modelo IA:", error);
    return { error: error.message };
  }
}

// 🤖 Predicción de un checklist específico
export async function predecirChecklistIA(checklist) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/predecir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checklist),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error al predecir checklist:", error);
    return { error: error.message };
  }
}

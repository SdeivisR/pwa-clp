// services/geminiService.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generarRecomendaciones(checklistData) {
  try {
    // Filtrar solo los campos necesarios antes de enviar al modelo
    const filteredData = checklistData.map(item => ({
      fields: item.fields.filter(f =>
        f.type === "Checkbox" || f.type === "Texto" || f.type === "Si/No"
      )
    }));

    const prompt = `
Analiza este checklist JSON filtrado.
- Checkbox con valor "no" -> "LABEL:Reparar".
- Texto vacío o null -> "LABEL:Completar".
- Devuelve **una línea con todos los errores separados por coma**.
- Máximo 80 caracteres en total.

Checklist:
${JSON.stringify(filteredData)}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    // Quitar saltos de línea y truncar a 80 caracteres
    let texto = result.response[0].content[0].text.replace(/\n/g, '');
    if (texto.length > 80) texto = texto.slice(0, 80);

    return texto;
  } catch (error) {
    console.error("❌ Error en generarRecomendaciones:", error);
    throw error;
  }
}

import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function testGemini() {
  try {
    const checklistSample = {
      placa: "ABC-123",
      conductor: "Juan Perez",
      fields: [
        { label: "Motor", value: "Revisado" },
        { label: "Frenos", value: "Necesita mantenimiento" },
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza este checklist y genera recomendaciones breves:\n${JSON.stringify(checklistSample)}`
    });

    console.log("✅ Recomendaciones generadas:");
    console.log(response.text);

  } catch (err) {
    console.error("❌ Error al probar Gemini:", err);
  }
}

testGemini();

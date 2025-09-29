import { generatePDF } from "../utils/pdfGenerator";

export const generatePDFFromJSON = async (checklistJSON) => {
  const { placa, conductor, secciones, images } = checklistJSON;

  const content = [];

  // Información general
  content.push({ type: "text", value: `Placa: ${placa}` });
  content.push({ type: "text", value: `Conductor: ${conductor}` });
  content.push({ type: "text", value: " " });

  // Secciones dinámicas
  for (const [key, val] of Object.entries(secciones || {})) {
    content.push({ type: "text", value: `${key}: ${val}` });
  }

  content.push({ type: "text", value: " " });

  // Imágenes
  for (const imgBase64 of images || []) {
    content.push({ type: "image", value: imgBase64 });
  }

  const pdfBytes = await generatePDF({
    title: "Checklist",
    content,
  });

  return pdfBytes;
};

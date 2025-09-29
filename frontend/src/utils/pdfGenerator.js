import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generatePDF = async ({ title, content }) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 tamaño en puntos

  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50; // Margen superior

  // Título
  page.drawText(title, {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  // Iterar sobre contenido
  for (const block of content) {
    if (block.type === "text") {
      page.drawText(block.value, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 20;
    } else if (block.type === "image") {
      // block.value debe ser base64 o Uint8Array
      const image = await pdfDoc.embedPng(block.value);
      const imgDims = image.scale(0.5);
      page.drawImage(image, {
        x: 50,
        y: y - imgDims.height,
        width: imgDims.width,
        height: imgDims.height,
      });
      y -= imgDims.height + 20;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

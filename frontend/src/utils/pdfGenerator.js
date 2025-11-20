import * as fontkit from "fontkit";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generatePDF = async ({ title, content = {}, logoPath = "/images/logo.png", logoBase64 = null }) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontPdf = await fetch("/fonts/NotoSans-VariableFont.ttf").then(res => res.arrayBuffer());
  const unicodeFont = await pdfDoc.embedFont(fontPdf);
  let page = pdfDoc.addPage([595, 842]); // A4
  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const PAGE_TOP = PAGE_HEIGHT - 50;
  const font = unicodeFont;
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = PAGE_TOP;
  let pageNumber = 1;
  let index = 0;
  let embeddedLogo = null;
  // crea página y añade encabezado
  const addPageIfNeeded = async (minSpace = 120) => {
    if (y < minSpace) {
      addFooter();
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      pageNumber++;
      y = PAGE_TOP;
      await addHeader();
    }
  };
  const loadLogoIfNeeded = async () => {
    if (embeddedLogo) return embeddedLogo;
    try {
      if (logoBase64) {
        const bytes = Uint8Array.from(atob(logoBase64.split(",")[1]), c => c.charCodeAt(0));
        embeddedLogo = await pdfDoc.embedPng(bytes).catch(() => pdfDoc.embedJpg(bytes));
      } else if (logoPath) {
        // fetch the image from public folder (browser context)
        const resp = await fetch(logoPath);
        if (!resp.ok) throw new Error("No se pudo cargar logo");
        const arrayBuffer = await resp.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        // try PNG then JPG
        embeddedLogo = await pdfDoc.embedPng(bytes).catch(() => pdfDoc.embedJpg(bytes));
      }
    } catch (e) {
      // si falla, embeddedLogo queda null (no rompemos)
      embeddedLogo = null;
    }
    return embeddedLogo;
  };
  // Encabezado
  const addHeader = async () => {
    // dimensiones y paddings del "cuadro"
    const headerWidth = PAGE_WIDTH * 0.87;          
    const headerX = (PAGE_WIDTH - headerWidth) / 2;  
    const headerHeight = 68;
    const headerTop = PAGE_HEIGHT - 30;             
    const headerY = headerTop - headerHeight;    
    const padding = 10;

    // fondo claro + borde
    page.drawRectangle({
      x: headerX,
      y: headerY,
      width: headerWidth,
      height: headerHeight,
      color: rgb(0.97, 0.97, 0.97), // fondo muy claro
      borderColor: rgb(0.85, 0.85, 0.85),
      borderWidth: 1,
    });
        // cargar logo (si existe)
    const logo = await loadLogoIfNeeded();
    const logoAreaX = headerX + padding;
    const logoAreaY = headerY + padding;
    const logoAreaHeight = headerHeight - padding * 2;
    const logoAreaWidth = 100; // ancho máximo del área del logo

    if (logo) {
      // calcular escala manteniendo proporciones
      const scale = Math.min(logoAreaWidth / logo.width, logoAreaHeight / logo.height, 1);
      const dims = logo.scale(scale); // { width, height }
      // posicionar centrado vertical dentro del header
      const logoDrawX = logoAreaX;
      const logoDrawY = headerY + (headerHeight - dims.height) / 2;
      page.drawImage(logo, { x: logoDrawX, y: logoDrawY, width: dims.width, height: dims.height });
    }
        // Título centrado (en el centro del cuadro)
    const titleText = String(title || "Checklist");
    const titleSize = 14;
    const titleWidth = fontBold.widthOfTextAtSize(titleText, titleSize);
    const titleX = headerX + (headerWidth / 2) - (titleWidth / 2);
    // ajustar para que no pise el logo área (si el logo ocupa mucho)
    const minTitleX = headerX + logoAreaWidth + padding * 2;
    const maxTitleX = headerX + headerWidth - 140; // dejar espacio para fecha
    const finalTitleX = Math.max(minTitleX, Math.min(titleX, maxTitleX));
    const titleY = headerY + headerHeight / 2 + (titleSize / 2) - 6; // ajustar vertical
    page.drawText(titleText, { x: finalTitleX, y: titleY, size: titleSize, font: fontBold, color: rgb(0.06, 0.06, 0.06) });

    // Fecha a la derecha dentro del cuadro
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const dateSize = 8;
    const timeSize = 8;

    // Calculamos el ancho máximo (el de la fecha, para alinear bien)
    const maxWidth = Math.max(
      font.widthOfTextAtSize(dateStr, dateSize),
      font.widthOfTextAtSize(timeStr, timeSize)
    );

    const dateX = headerX + headerWidth - maxWidth - padding - 10;
    const dateY = headerY + headerHeight / 2 + 2; // posición vertical superior

    // Dibuja la fecha (arriba)
    page.drawText(dateStr, {
      x: dateX,
      y: dateY,
      size: dateSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Dibuja la hora (debajo de la fecha)
    page.drawText(timeStr, {
      x: dateX,
      y: dateY - dateSize - 2, // desplazamiento hacia abajo
      size: timeSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    // bajar el cursor Y para el contenido (un poco más de separación)
    y = headerY;
  };
  const addFooter = () => {
    const footerY = 20;
    page.drawText(String(`Página ${pageNumber}`), {
      x: PAGE_WIDTH - 100,
      y: footerY,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  };
  // Dividir texto en líneas que entren en el ancho de la celda
  const splitText = (text, maxWidth, font, fontSize) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? currentLine + " " + word : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };
  /// Dibujar grupo ancho completo (primer grupo)
  const drawFullWidthGroup = async (groupName, fieldsRaw, pdfDoc, page, font, fontBold) => {
    const fields = Array.isArray(fieldsRaw) ? fieldsRaw : Object.values(fieldsRaw || {});

    // Normalizar campos (ej. FechasP → Fecha Inicio + Fecha Fin)
    const expandedFields = [];
    fields.forEach((f) => expandedFields.push(...normalizeField(f)));

    // Configuración del cuadro de título
    const totalWidth = PAGE_WIDTH * 0.87;
    const startX = (PAGE_WIDTH - totalWidth) / 2;
    const titleFontSize = 8;
    const titlePaddingY = 3; // padding vertical
    const boxHeight = titleFontSize + titlePaddingY * 2;

    // Dibujar fondo azul del título usando startX y totalWidth existentes
    page.drawRectangle({
      x: startX,
      y: y - boxHeight,
      width: totalWidth,
      height: boxHeight,
      color: rgb(0.2, 0.55, 0.9), // azul moderno
      borderColor: rgb(0.15, 0.45, 0.8),
      borderWidth: 1,
      borderRadius: 4,
    });

    // Centrar texto horizontalmente dentro de totalWidth
    const textWidth = fontBold.widthOfTextAtSize(groupName, titleFontSize);
    const textX = startX + (totalWidth - textWidth) / 2;
    const textY = y - boxHeight + titlePaddingY;

    page.drawText(groupName, { x: textX, y: textY, size: titleFontSize, font: fontBold, color: rgb(1, 1, 1) });

    // Ajustar cursor Y para las celdas
    y -= boxHeight + 0;


    // Configuración grilla
    const colWidth = totalWidth / 3;
    const colXs = [startX, startX + colWidth, startX + colWidth * 2];
    const fontSize = 6;

    //Usamos expandedFields
    for (let i = 0; i < expandedFields.length; i += 3) {
      const rowFields = expandedFields.slice(i, i + 3);

      // Calcular alturas
      const cellHeights = rowFields.map((field) => {
        if (!field) return 0;
        const safeText = `${field.label || ""}: ${field.value ?? ""}`;
        const lines = splitText(safeText, colWidth - 20, font, fontSize);
        const lineHeight = fontSize + 1; // reducimos de +2 a +1
        const padding = 10; // reducimos de 12 a 10
        const totalHeight = lines.length * lineHeight + padding;
        return totalHeight;
      });

      const rowHeight = Math.max(...cellHeights)-2;
      const minRowHeight = 14;
      const finalRowHeight = Math.max(rowHeight, minRowHeight);
      await addPageIfNeeded(rowHeight + 20);

      // Dibujar celdas
      rowFields.forEach((field, c) => {
        if (!field) return;

        const cellX = colXs[c];
        const cellY = y;
        const safeText = `${field.label || ""}: ${field.value ?? ""}`;
        const lines = splitText(safeText, colWidth - 20, font, fontSize);
        const lineHeight = fontSize + 2;

        if (lines.length === 1) {
          const textY = cellY - (rowHeight / 2) + (lineHeight / 2) - fontSize / 1;
          page.drawText(lines[0], { x: cellX + 8, y: textY, size: fontSize, font });
        } else {
          let textY = cellY - (rowHeight / 2) + ((lines.length * lineHeight) / 2) - fontSize / 1;
          for (const line of lines) {
            page.drawText(line, { x: cellX + 8, y: textY, size: fontSize, font });
            textY -= lineHeight;
          }
        }

        // Dibujar bordes de celda
        page.drawRectangle({
          x: cellX,
          y: cellY - rowHeight,
          width: colWidth,
          height: rowHeight,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 1,
        });
      });

      // Avanzar a la siguiente fila
      y -= rowHeight ;
    }
      return y;
  };
  const estimateFieldHeight = async (field, colWidth, font, fontSize = 11, pdfDoc = null) => {
    if (!field) return 0;
    const type = field.type ?? "Texto";

    if (type === "Firma" || type === "FirmText") {
      // estimación base: label + firma pequeña
      return 95 ;
    }
    if (type === "Imágenes Marcadas") {
      // estimación base: label + firma pequeña
      return 150 ;
    }

    if (type === "Kilometraje") {
    const safeText = `${field.label || ""}: ${field.value ?? ""} KM`;
    const lines = splitText(safeText, colWidth - 20, font, fontSize);
    const lineHeight = fontSize + 2;
    return Math.max(lines.length * lineHeight + 12, 28);
    }
    // Texto / TextoSiNo
    const safeText = `${field.label || ""}: ${field.value ?? ""}`;
    const lines = splitText(safeText, colWidth - 20, font, fontSize);
    const lineHeight = fontSize + 2;
    return Math.max(lines.length * lineHeight + 12, 28);
  };
  const drawFieldInCell = async (field, x, yTop, colWidth, rowHeight, font, fontSize = 11, page, pdfDoc = null) => {
  const type = field.type ?? "Texto";
  const padding = 8;

  if (type === "Firma" || type === "FirmText") {
    const label = `${field.label || ""}${type === "FirmText" && field.com ? ` - ${field.com}` : ""}`;
    page.drawText(label, { 
      x: x + padding - 2 , 
      y: yTop - padding - (fontSize) + 4 , 
      size: fontSize, 
      font: unicodeFont
    });

    const imgBase64 = field.value;
    if (imgBase64 && imgBase64.startsWith("data:image")) {
      try {
        const bytes = Uint8Array.from(atob(imgBase64.split(",")[1]), c => c.charCodeAt(0));
        const image = await pdfDoc.embedPng(bytes).catch(() => pdfDoc.embedJpg(bytes));

        if (image) {
          // scale to fit width minus paddings
          const maxW = colWidth - padding * 2;
          const maxH = rowHeight - padding * 2 - fontSize + 20;
          const scale = Math.min(maxW / image.width, maxH / image.height);
          const dims = image.scale(scale);

          const imgX = x + (colWidth - dims.width) / 2;
          const imgY = yTop - rowHeight + padding;
          
          page.drawImage(image, { 
            x: imgX, 
            y: imgY - 6 ,
            width: dims.width - 12, 
            height: dims.height - 12 });
        }
      } catch {
        page.drawText("(Firma inválida)", { 
          x: x + padding, 
          y: (yTop - rowHeight / 2), 
          size: 10, 
          font, 
          color: rgb(0.7, 0, 0) });
      }
    }
    return;
  }
  if (type === "Imágenes Marcadas") {
    const imgBase64 = field.value;
    if (imgBase64 && imgBase64.startsWith("data:image")) {
      try {
        const bytes = Uint8Array.from(atob(imgBase64.split(",")[1]), c => c.charCodeAt(0));
        const image = await pdfDoc.embedPng(bytes).catch(() => pdfDoc.embedJpg(bytes));

        if (image) {
          const maxW = colWidth - padding * 2;
          const squareSize = maxW - 110;
          const imgX = x + (colWidth - squareSize) / 2;
          const imgY = yTop - rowHeight + padding;
          page.drawImage(image, {
            x: imgX + 10,
            y: imgY - 6,
            width: squareSize + 50,
            height: squareSize
          });
          // 📋 Lista de observaciones al costado derecho
          const textX = imgX + squareSize - 180; // posición al costado de la imagen
          let textY = imgY + squareSize - 40;   // parte superior de la lista

        const items = [
          { label: "Otros", color: rgb(0, 0, 0) }, 
          { label: "Fisura", color: rgb(1, 0, 0) },    
          { label: "Golpe", color: rgb(1, 0.5, 0) }, 
          { label: "Rayon", color: rgb(1, 1, 0) }, 
          { label: "Suciedad", color: rgb(0, 0, 1) }, 
        ];

        for (const { label, color } of items) {
          // Dibuja el círculo
          page.drawCircle({
            x: textX - 8,
            y: textY + 3,
            size: 3,
            color,
            borderColor: color,
            borderWidth: 1,
          });

          // Dibuja el texto
          page.drawText(label, {
            x: textX + 2,
            y: textY,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });

          textY -= 14;
        }
      }
    } catch {
      page.drawText("(Firma inválida)", {
        x: x + padding,
        y: yTop - rowHeight / 2,
        size: 10,
        font,
        color: rgb(0.7, 0, 0),
      });
    }
  }
  return;
}

  // --- TEXTO NORMAL ---
    const label = field.label ? field.label.trim() : "";
    const value = field.value ? String(field.value).trim() : "";
    let line = "";
    if (label && value) line = `${label}: ${value}`;
    else if (label) line = label;
    else if (value) line = value;

    if (type === "Kilometraje") {
      line = `${field.label}: ${val} KM`;
    }
    if (type === "TextoSiNo" && field.cB) {
      const imgSrc = field.cB.toLowerCase() === "si"
        ? "/images/check.png"
        : "/images/cross.png";

      const response = await fetch(imgSrc);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const image = await pdfDoc.embedPng(bytes);

      const size = 7;
      const iconY = yTop - padding - size;

      // Dibujar ícono
      page.drawImage(image, {
        x: x + padding - 1,
        y: iconY + 4,
        width: size,
        height: size,
      });

      // Texto después del ícono
      const labelText = `${field.label}: ${field.value || ""}`;

      // 👉 Dividir texto si supera el límite
      const MAX_CHARS = 68;
      let lines = [];

      if (labelText.length > MAX_CHARS) {
        for (let i = 0; i < labelText.length; i += MAX_CHARS) {
          lines.push(labelText.slice(i, i + MAX_CHARS));
        }
      } else {
        lines = [labelText];
      }

      const lineHeight = fontSize + 1; // más compacto
      const textHeight = lines.length * lineHeight + 2 * padding;
      const effectiveRowHeight = textHeight > rowHeight ? textHeight : rowHeight;
      
      // Alinear verticalmente
      let yText = yTop - padding - (effectiveRowHeight - 2 * padding - lines.length * lineHeight) / 2 - fontSize + lineHeight;

      // Dibujar líneas con margen respecto al ícono
        if (lines.length === 1) {
      // 👉 Caso 1 línea: al lado del ícono
      page.drawText(lines[0], {
        x: x + padding + size + 4,
        y: yText - 3,
        size: fontSize,
        font: unicodeFont,
      });
    } else {
      // 👉 Caso varias líneas: debajo, alineadas
      for (const ln of lines) {
        page.drawText(ln, {
          x: x + padding + size + 4,
          y: yText,
          size: fontSize,
          font: unicodeFont,
        });
        yText -= lineHeight;
      }
    }
      return;
    }
    if (type === "Checkbox" && field.value) {
      const imgSrc = field.value.toLowerCase() === "si"
        ? "/images/check.png"
        : "/images/cross.png";

      const response = await fetch(imgSrc);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const image = await pdfDoc.embedPng(bytes);

      const size = 7;
      const iconY = yTop - padding - size;

      // Dibujar el ícono
      page.drawImage(image, {
        x: x + padding - 1,
        y: iconY + 4,
        width: size,
        height: size,
      });

      // Dibujar solo el label al lado
      const textY = iconY + (size - fontSize) / 2 + 3; 
      page.drawText(field.label || "", {
        x: x + padding + size + 4,
        y: textY+1,
        size: fontSize,
        font: unicodeFont,
      });

      return;
    }

    // Dividir en líneas de máximo 70 caracteres
    const MAX_CHARS = 70;
    const size = 7;
    let lines = [];
    if (line.length > MAX_CHARS) {
      // Dividir en varias líneas
      for (let i = 0; i < line.length; i += MAX_CHARS) {
        lines.push(line.slice(i, i + MAX_CHARS));
      }
    } else {
      // Una sola línea
      lines = [line];
    }

    const lineHeight = fontSize + 1;
    const textHeight = lines.length * lineHeight + 2 * padding;
    const effectiveRowHeight = textHeight > rowHeight ? textHeight : rowHeight;

    let yText = yTop - padding - (effectiveRowHeight - 2 * padding - lines.length * lineHeight) / 2 - fontSize + lineHeight;

    if (lines.length === 1) {
      // 👉 Caso 1 línea: al lado del ícono
      page.drawText(lines[0], {
        x: x + padding + size ,
        y: yText - 3,
        size: fontSize,
        font: unicodeFont,
      });
    } else {
      // 👉 Caso varias líneas: debajo, alineadas
      for (const ln of lines) {
        page.drawText(ln, {
          x: x + padding + size ,
          y: yText,
          size: fontSize,
          font: unicodeFont,
        });
        yText -= lineHeight; // bajar cada línea
      }
    }
  };
  const drawColumnGroup = async (groupName, fieldsRaw, pdfDoc, page, font, fontBold, yStart) => {
    const fields = Array.isArray(fieldsRaw) ? fieldsRaw : Object.values(fieldsRaw || {});
    const PAGE_W = PAGE_WIDTH * 0.87;
    const colWidth = (PAGE_W ) / 2;   // ancho de cada columna
    const startX = (PAGE_WIDTH - PAGE_W) / 2;
    const colXs = [startX, startX + colWidth];
    const titleFontSize = 8;
    let y = yStart;

      const titleHeight = 14;
      page.drawRectangle({
        x: startX,
        y: y - titleHeight,
        width: colWidth * 2,
        height: titleHeight,
        color: rgb(0.2, 0.5, 0.9),
        borderColor: rgb(0.15, 0.45, 0.8),
        borderWidth: 1,
      });

      const textWidth = fontBold.widthOfTextAtSize(groupName, titleFontSize);
      const textX = startX + ((colWidth * 2) - textWidth) / 2;
      const textY = y - titleHeight / 2 - titleFontSize / 3;
      page.drawText(groupName, { x: textX, y: textY, size: titleFontSize, font: fontBold, color: rgb(1, 1, 1) });

      y -= titleHeight;

      // --- Iterar filas de 2 columnas ---
      for (let i = 0; i < fields.length; i += 2) {
        const leftField = normalizeField(fields[i])?.[0] ?? null;
        const rightField = normalizeField(fields[i + 1])?.[0] ?? null;

        const fontSize = 6;
        const leftHeight = leftField ? await estimateFieldHeight(leftField, colWidth, font, fontSize, pdfDoc)- 12 : 0;
        const rightHeight = rightField ? await estimateFieldHeight(rightField, colWidth, font, fontSize, pdfDoc)- 12 : 0;
        const rowHeight = Math.max(leftHeight, rightHeight, 14);

        await addPageIfNeeded(rowHeight + 30);

        // --- izquierda ---
        if (leftField) {
          page.drawRectangle({
            x: colXs[0],
            y: y - rowHeight,
            width: colWidth,
            height: rowHeight,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
          });
          await drawFieldInCell(leftField, colXs[0], y, colWidth, rowHeight, font, fontSize, page, pdfDoc);
        }
        // --- derecha ---
        if (rightField) {
          page.drawRectangle({
            x: colXs[1],
            y: y - rowHeight,
            width: colWidth,
            height: rowHeight,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
          });
          await drawFieldInCell(rightField, colXs[1], y, colWidth, rowHeight, font, fontSize, page, pdfDoc);
        } else {
          // ⚠️ Caso impar → celda vacía
          page.drawRectangle({
            x: colXs[1],
            y: y - rowHeight,
            width: colWidth,
            height: rowHeight,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
          });
        }
        // bajar cursor (solo por las filas normales)
        y -= rowHeight;
      }
      return y;
    };
    // === Normalizar campos especiales ===
  function normalizeField(field) {
        if (!field) return [];

        // Caso especial: FechasP → 2 campos
        if (field.type === "FechasP") {
          return [
            { label: "Fecha Inicio", value: field.sd ?? "" },
            { label: "Fecha Fin", value: field.ed ?? "" },
          ];
        } 
        // Caso normal 
        return [field];
      }
  await addHeader();
  for (const [groupNameRaw, fieldsRaw] of Object.entries(content || {})) {
        await addPageIfNeeded(120);
        
        const groupName = String(groupNameRaw || "");

        if (index === 0) {
          // Primer grupo (3 columnas ancho completo)
          y = await drawFullWidthGroup(groupName, fieldsRaw, pdfDoc, page, font, fontBold);
        } else {
          // Los demás (2 columnas)
          y = await drawColumnGroup(groupName, fieldsRaw, pdfDoc, page, font, fontBold, y);
        }

        index++;
      }
      
      // espacio entre grupos
    
    // footer final de la última página
    addFooter();
  
  return await pdfDoc.save();
};


// generatePDFFromJSON.js

export const generatePDFFromJSON = (checklistJSON) => {
  const content = {};
  

  if (!checklistJSON || typeof checklistJSON !== "object") return content;

 const moveMediaToEnd = (fields) => {
  if (!Array.isArray(fields)) return fields;

  // separamos normales y medias
  const normales = fields.filter(
    f => f.type !== "Imágenes tipo lista" && f.type !== "Firma" && f.type !== "FirmText"
  );
  const medias = fields.filter(
    f => f.type === "Imágenes tipo lista" || f.type === "Firma" || f.type === "FirmText"
  );

  // ⚠️ Si los normales son impares → empujamos un campo vacío como "relleno"
  if (normales.length % 2 !== 0) {
    normales.push({ type: "Empty", label: "", value: null });
  }

  return [...normales, ...medias];
};

  // Normaliza un bloque a {type, label, value, com?, images?}
  const normalizeField = (block, keyFallback = "") => {
    if (!block || typeof block !== "object") return null;
    const type = block.type || "Texto";
    const label = block.label || block.name || keyFallback || "";
    const field = { type, label };

    // Checkbox: soporta cB (texto/booleano) o value booleano/texto
    if (type === "Checkbox") {
      if (block.cB !== undefined) {
        field.value = (typeof block.cB === "boolean") ? (block.cB ? "Sí" : "No") : block.cB;
      } else if (typeof block.value === "boolean") {
        field.value = block.value ? "Sí" : "No";
      } else {
        field.value = block.value ?? null;
      }
      return field;
    }

    // Selección múltiple
    if (type === "Selección Múltiple") {
      field.value = Array.isArray(block.value) ? block.value.join(", ") : block.value ?? null;
      return field;
    }

    // Texto + Si/No
    if (type === "Texto + Si/No" || type === "TextoSiNo") {
      field.type = "TextoSiNo";
      field.value = block.value ?? null;
      if (block.cB !== undefined) {
        field.cB =
          typeof block.cB === "boolean" ? (block.cB ? "Sí" : "No") : block.cB;
      } else {
        field.cB = null;
      }
      return field;
    }

    // Imágenes tipo lista
    if (type === "Imágenes tipo lista") {
      let images = [];

      // Si existe un subgrupo con items definidos
      if (Array.isArray(block.items) && block.value) {
        const match = block.items.find((item) => item.value === String(block.value));
        if (match && match.imageUrl) {
          images = [match.imageUrl]; // Guardamos la URL encontrada
        }
      } 
      // Si ya vienen como imágenes directas (por ejemplo base64 o array de urls)
      else if (Array.isArray(block.images)) {
        images = block.images;
      } else if (Array.isArray(block.value)) {
        images = block.value;
      } else if (block.value) {
        images = [block.value];
      }

      field.type = "Imágenes tipo lista";
      field.images = images;
      return field;
    }

    // Firma + Texto
    if (type === "Firma + Texto" || type === "FirmText") {
      field.type = "FirmText";
      field.value = block.value ?? null;
      field.com = block.com ?? null;
      return field;
    }

    // Firma sola
    if (type === "Firma") {
      field.value = block.value ?? null;
      return field;
    }

    // Fechas periodo (FechasP)
    if (type === "FechasP") {
      field.type = "FechasP";
      field.sd = block.startDate ?? null;
      field.ed = block.endDate ?? null;
      return field;
    }
    if (type === "Kilometraje") {
      field.type = "Kilometraje";
      field.value = block.value ?? null;
      field.label = block.label ?? null;
      return field;
    }

    // Default: cualquier otro tipo -> value directo
    field.value = block.value ?? null;
    return field;
  };

  // Procesa un objeto "grupo" (obj con keys -> blocks) y devuelve array de fields
  const processGroupObj = (groupObj) => {
    if (!groupObj || typeof groupObj !== "object") return [];
    // Si tiene propiedad .fields convertimos Object.values
    const maybeFields = groupObj.fields ?? groupObj; // algunos JSON anidan en .fields
    const rawEntries = Array.isArray(maybeFields) ? maybeFields : Object.values(maybeFields || {});
    const out = [];
    for (const [idx, block] of Object.entries(rawEntries)) {
      const field = normalizeField(block, block?.label || `campo_${idx}`);
      if (field) out.push(field);
    }
    return out;
  };


  if (checklistJSON.estructura_json) {
    for (const [i, grupoObj] of Object.entries(checklistJSON.estructura_json)) {
      const groupName =
        (grupoObj && (grupoObj.name || grupoObj.nombre || grupoObj.titulo || grupoObj.title || grupoObj.label)) ||
        `Grupo ${parseInt(i, 10) + 1}`;
      content[groupName] = processGroupObj(grupoObj);
    }
  } else {
    // 2) Si no hay estructura_json, recorrer entradas principales (excepto titulo)
    for (const [key, value] of Object.entries(checklistJSON)) {
      if (key === "titulo") continue;
      // si value parece un grupo (obj con fields o obj con bloques)
      if (value && typeof value === "object") {
        content[key] = processGroupObj(value);
      }
    }
  }

  // 3) Opcional: incluir campos sueltos si existen (fields top-level)
  if (checklistJSON.fields && Object.keys(checklistJSON.fields).length > 0) {
    content["Campos"] = processGroupObj({ fields: checklistJSON.fields });
  }
    for (const groupName of Object.keys(content)) {
    content[groupName] = moveMediaToEnd(content[groupName]);
  }

  return content;
};

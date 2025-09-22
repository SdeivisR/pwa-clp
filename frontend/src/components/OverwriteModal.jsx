import React, { useState, useEffect } from "react";

const OverwriteModal = ({ plantilla, onOverwrite, onClose }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // ⚡ Cargar datos de la plantilla al abrir el modal
  useEffect(() => {
    if (plantilla) {
      setTitulo(plantilla.titulo || "");
      setDescripcion(plantilla.descripcion || "");
    }
  }, [plantilla]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Sobreescribir Plantilla</h2>

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onOverwrite({ titulo, descripcion })}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Sobreescribir
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverwriteModal;

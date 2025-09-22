import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import { useState } from "react";

export default function TemplatesModal({ isOpen, onClose, templates, onSelect }) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  // Filtrado en base al query
  const filteredTemplates = templates.filter((tpl) =>
    tpl.titulo.toLowerCase().includes(query.toLowerCase()) ||
    tpl.descripcion.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col"
      >
        {/* Header con X y búsqueda */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <h2 className="text-xl font-semibold">Plantillas</h2>

          <div className="flex items-center gap-2">
            {/* Input búsqueda */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>

            {/* Botón cerrar */}
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Lista scrolleable */}
        <ul className="space-y-2 overflow-y-auto pr-2 flex-1">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((tpl) => (
              <li 
                key={tpl.id}
                className="p-3 rounded-lg border hover:bg-gray-100 cursor-pointer"
                onClick={() => { onSelect(tpl); onClose(); }}
              >
                <div className="font-semibold">{tpl.titulo}</div>
                <div className="text-sm text-gray-500">{tpl.descripcion}</div>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic text-center py-6">
              No se encontraron plantillas
            </li>
          )}
        </ul>
      </motion.div>
    </div>
  );
}

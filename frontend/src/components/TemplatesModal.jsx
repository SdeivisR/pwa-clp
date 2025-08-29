import { motion } from "framer-motion";

export default function TemplatesModal({ isOpen, onClose, templates, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 w-[400px]"
      >
        <h2 className="text-xl font-semibold mb-4">Plantillas</h2>

        <ul className="space-y-2">
          {templates.map((tpl, index) => (
            <li 
              key={index}
              className="p-3 rounded-lg border hover:bg-gray-100 cursor-pointer"
              onClick={() => { onSelect(tpl); onClose(); }}
            >
              {tpl.name}
            </li>
          ))}
        </ul>

        <button 
          className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={onClose}
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  );
}

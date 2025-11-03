import React, { Fragment,useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Search } from "lucide-react";


export default function TemplatesModal({onClose, templates, onSelect,visible }) {
  const [query, setQuery] = useState("");

  if (!visible) return null;

  // Filtrado en base al query
  const filteredTemplates = templates.filter((tpl) =>
    tpl.titulo.toLowerCase().includes(query.toLowerCase()) ||
    tpl.descripcion.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog 
        as="div" 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClose={onClose}
      >
        {/* Animación del modal */}
        <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-75 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-75 scale-100"
            leaveTo="opacity-0 scale-95"
          >
          <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-bold">Plantillas</Dialog.Title>
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
            <ul className="space-y-2 overflow-y-auto flex-1 pr-2">
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
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

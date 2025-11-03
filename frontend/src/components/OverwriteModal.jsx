import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

const OverwriteModal = ({ plantilla, onOverwrite, onClose, visible }) => {
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
    <Transition appear show={visible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <Dialog.Title className="text-xl font-bold mb-4">Sobreescribir Plantilla</Dialog.Title>

            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => onOverwrite({ titulo, descripcion })}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Sobreescribir
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default OverwriteModal;

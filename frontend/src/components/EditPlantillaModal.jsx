import React, { Fragment,useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function EditPlantillaQuickModal({ visible, onClose, plantilla, setPlantilla, onSave }) {
  const [loading, setLoading] = useState(false);
  if (!visible) return null;
  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(plantilla.id, plantilla.titulo, plantilla.descripcion);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  };
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
            <Dialog.Title className="text-lg font-bold">Editar Título y Descripción</Dialog.Title>
            <label className="block mb-2 text-sm font-medium">Título</label>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded"
              value={plantilla.titulo}
              onChange={(e) => setPlantilla(prev => ({ ...prev, titulo: e.target.value }))}
            />
            <label className="block mb-2 text-sm font-medium">Descripción</label>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded"
              value={plantilla.descripcion}
              onChange={(e) => setPlantilla(prev => ({ ...prev, descripcion: e.target.value }))}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

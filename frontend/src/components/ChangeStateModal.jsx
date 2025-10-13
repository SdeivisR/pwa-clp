import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

export default function ChangeStateModal({ visible, onClose, onConfirm, checklist }) {
  // No renderizar si no está visible o no hay checklist válido
  if (!visible || !checklist) return null;

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" 
      onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          {/* Centrado vertical */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-lg rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-bold">Cambiar Estado</Dialog.Title>
                <button onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              <p className="mb-4">
                Seleccione el estado que desea asignar al checklist{" "}
                <strong>{checklist.folio}</strong>:
              </p>

              <div className="flex justify-between gap-4">
                <button
                  onClick={() => onConfirm(3)} // 3 = Anulado
                  className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition"
                >
                  Anulado
                </button>

                <button
                  onClick={() => onConfirm(5)} // 5 = Completado
                  className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition"
                >
                  Completado
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}


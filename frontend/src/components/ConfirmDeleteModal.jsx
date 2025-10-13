import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
  itemName = "este elemento",
  loading = false,
}) {
  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" 
        onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          {/* Centrado vertical */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-75 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-75 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-lg rounded-lg">
              <Dialog.Title as="h3" className="text-lg font-semibold mb-2">
                Eliminar
              </Dialog.Title>

              <Dialog.Description className="mb-4 text-sm text-gray-700">
                ¿Estás seguro que quieres eliminar{" "}
                <span className="font-medium">{itemName}</span>?
              </Dialog.Description>

              <p className="mb-6 text-sm text-red-600">
                <strong>Esto no se podrá deshacer.</strong> "{itemName}" se eliminará permanentemente.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                  disabled={loading}
                >
                  Cancelar
                </button>

                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}


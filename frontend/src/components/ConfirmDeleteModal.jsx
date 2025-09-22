//Cuadro de Confirmacio de Eliminacion de gPlant
import React from "react";

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
  itemName = "este elemento",
  loading = false,
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">Eliminar plantilla</h3>

        <p className="mb-4 text-sm text-gray-700">
          ¿Estás seguro que quieres eliminar <span className="font-medium">{itemName}</span>?
        </p>

        <p className="mb-6 text-sm text-red-600">
          <strong>Esto no se puede deshacer.</strong> La plantilla se eliminará permanentemente.
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
            aria-label="Confirmar eliminación"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

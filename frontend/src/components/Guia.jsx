import React, {Fragment} from "react";
import { X} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

export default function Guia({onClose, templates, onSelect,visible }) {
    if (!visible) return null;

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
            <Dialog.Title className="text-lg font-bold">Guia</Dialog.Title>
              <div className="flex items-center gap-2">
                {/* Botón cerrar */}
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            {/* Contenido de la guía */}
            <div className="max-h-[75vh] overflow-y-auto pr-3 space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h3 className="font-semibold text-lg">🧩 1. Estructura del formulario</h3>
                <p>El checklist está organizado por grupos de revisión. A continuación se explica cada uno:</p>

                <h4 className="mt-2 font-semibold">🔹 Datos generales del vehículo</h4>
                <ul className="list-disc list-inside ml-3">
                  <li>Placa</li>
                  <li>Empresa</li>
                  <li>Conductor</li>
                  <li>Fecha y hora de ingreso</li>
                  <li>Fecha de salida</li>
                  <li>Kilometraje</li>
                </ul>
                <p className="mt-1 text-green-700 font-medium">
                  🟢 Esta información se usa para nombrar la carpeta de guardado (por ejemplo: ABC123_2025-11-09).
                </p>

                <h4 className="mt-3 font-semibold">🔹 Elementos de seguridad y herramientas</h4>
                <p>Revisa y marca cada ítem como:</p>
                <ul className="list-disc list-inside ml-3">
                  <li>✅ Sí (funciona o está presente)</li>
                  <li>❌ No (no funciona o falta)</li>
                  <li>📝 Comentario (observaciones opcionales)</li>
                </ul>
                <p className="mt-1 italic">Ejemplo: “Extintor: Sí – Última recarga en septiembre 2025”</p>

                <h4 className="mt-3 font-semibold">🔹 Sistema de luces, Vidrios y espejos, Motor y combustible, etc.</h4>
                <p>Cada grupo sigue el mismo formato:</p>
                <ul className="list-disc list-inside ml-3">
                  <li>Selecciona “Sí” o “No”.</li>
                  <li>Agrega observaciones si es necesario.</li>
                </ul>
                <p className="text-yellow-600 mt-1">
                  ⚠️ Todos los grupos son editables. Puedes desplazarte libremente y completar en cualquier orden.
                </p>

                <h4 className="mt-3 font-semibold">🔹 Nivel de combustible</h4>
                <ul className="list-disc list-inside ml-3">
                  <li>Nivel 1 🔴 (Vacío)</li>
                  <li>Nivel 2 🟠</li>
                  <li>Nivel 3 🟡</li>
                  <li>Nivel 4 🟢</li>
                  <li>Nivel 5 🟩 (Lleno)</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg">✍️ 2. Captura de firmas</h3>
                <p>Al final del formulario encontrarás dos espacios de firma:</p>
                <ul className="list-disc list-inside ml-3">
                  <li>Firma de ingreso</li>
                  <li>Firma de salida</li>
                </ul>
                <p>Para firmar: usa el mouse (en PC) o tu dedo (en pantalla táctil).</p>
                <p>Si deseas borrar la firma, presiona el botón <strong>“Borrar”</strong>.</p>
                <p>La firma de salida puede completarse después, al reabrir el proyecto.</p>
              </section>

              <section>
                <h3 className="font-semibold text-lg">💾 3. Guardar progreso del checklist</h3>
                <p>Pulsa el botón 🖫 “Guardar proyecto”.</p>
                <p>El sistema generará un archivo <strong>.txt</strong> con toda la información ingresada (incluidas las firmas).</p>
                <p>📁 Se crea una carpeta automáticamente con el nombre del vehículo y la fecha (por ejemplo: <strong>ABC123_2025-11-09</strong>).</p>
              </section>

              <section>
                <h3 className="font-semibold text-lg">📂 4. Abrir un proyecto guardado</h3>
                <p>Pulsa el botón 📂 “Abrir proyecto”. Selecciona el archivo .txt que guardaste anteriormente.</p>
                <p>El sistema cargará todos los datos y firmas automáticamente.</p>
                <p className="text-green-700">🟢 Ideal para completar la firma de salida u observaciones pendientes.</p>
              </section>

              <section>
                <h3 className="font-semibold text-lg">🧹 5. Generar nuevo checklist</h3>
                <p>Haz clic en “🆕 Generar nuevo checklist”.</p>
                <p>El sistema limpiará todos los campos y firmas, y volverás al inicio del formulario.</p>
                <p className="text-yellow-600 font-medium">
                  ⚠️ Asegúrate de guardar el proyecto anterior antes de generar uno nuevo.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-lg">📄 6. Generar PDF final</h3>
                <p>Pulsa el botón 📑 “Generar PDF”.</p>
                <p>El sistema creará un archivo PDF con todo el contenido:</p>
                <ul className="list-disc list-inside ml-3">
                  <li>Datos del vehículo</li>
                  <li>Resultados del checklist</li>
                  <li>Comentarios</li>
                  <li>Firmas (ingreso y salida)</li>
                </ul>
                <p>El archivo se descargará automáticamente o se mostrará para guardar.</p>
              </section>

              <section>
                <h3 className="font-semibold text-lg">⚙️ 7. Recomendaciones finales</h3>
                <ul className="list-disc list-inside ml-3 space-y-1">
                  <li>Guarda el proyecto antes de cerrar el aplicativo.</li>
                  <li>Revisa que las firmas estén completas antes de generar el PDF.</li>
                  <li>Usa siempre el mismo formato de nombre para mantener los registros ordenados.</li>
                  <li>Si un campo no se ve correctamente, actualiza la página (Ctrl + F5).</li>
                </ul>
              </section>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}


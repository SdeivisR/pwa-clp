// src/pages/Soporte.jsx
import React, { useState} from "react";
import { FileText, Mail, Phone } from "lucide-react";
import Guia from "../components/Guia";

export default function Soporte() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Centro de Soporte</h1>
      <p className="text-gray-600">Encuentra aquí ayuda rápida o contáctanos directamente.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FileText className="text-blue-600" /> Guías y Manuales
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><a 
              onClick={() => setVisible(true)}
              target="_blank" 
              className="text-blue-600 hover:underline"
              >Guía de uso del sistema</a>
            </li>
          </ul>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Mail className="text-green-600" /> Contacto
          </h2>
          <p><strong>Correo:</strong> groupsitemsac@gmail.com</p>
          <p><strong>Teléfono:</strong> <Phone className="inline w-4 h-4 text-gray-500" /> +51 964 102 495</p>
        </div>
      </div>
      {visible && (
        <Guia
          visible={visible}
          onClose={() => setVisible(false)}/>
      )}
    </div>
  );
}

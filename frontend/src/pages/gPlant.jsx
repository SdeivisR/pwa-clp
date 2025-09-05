// src/pages/gPlant.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GPlant() {
  const navigate = useNavigate();
  const [plantillas, setPlantillas] = useState([]);

  // 📂 Cargar plantillas desde JSON en public/data
  useEffect(() => {
    fetch("/data/plantillas.json")
      .then((res) => res.json())
      .then((json) => setPlantillas(json))
      .catch((err) => console.error("Error cargando JSON:", err));
  }, []);

  // 👉 Eliminar plantilla
  const eliminarPlantilla = (id) => {
    setPlantillas(plantillas.filter((p) => p.id !== id));
  };

  // 👉 Editar plantilla
  const editarPlantilla = (nombreArchivo) => {
    navigate(`/cPlant/${encodeURIComponent(nombreArchivo)}`);
  };

  // 👉 Crear nueva plantilla
  const nuevaPlantilla = () => {
    navigate("/cplant/nueva");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Plantillas</h1>
        <button
          onClick={nuevaPlantilla}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Nueva Plantilla
        </button>
      </div>

      {/* 📋 Lista de plantillas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Plantillas</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Nombre</th>
                <th className="p-2">Empresa</th>
                <th className="p-2">Fecha Modif.</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plantillas.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.empresa}</td>
                  <td className="p-2">{p.fechamodif}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => editarPlantilla(`${p.name}.json`)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => eliminarPlantilla(p.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 📊 Gráfico de uso de plantillas */}
      <Card>
        <CardHeader>
          <CardTitle>Uso de Plantillas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <BarChart data={plantillas}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usos" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { entrenarModeloIA, predecirChecklistIA } from "../services/aiService.js";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function DashboardChecklists() {
  const [checklists, setChecklists] = useState([]);
  const [scoreSalud, setScoreSalud] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [selectedChecklist, setSelectedChecklist] = useState("");
  const [resultadoId, setResultadoId] = useState(null);
  const [mostrarTodo, setMostrarTodo] = useState(false);
  const mantenimientos = checklists.filter(c => c.estado === "Mantenimiento").length;
  const sinProblemas = checklists.length - mantenimientos;
  const filasAMostrar = mostrarTodo ? checklists : checklists.slice(0, 3);
  const estadoOptions = {
    chart: { type: "pie" },
    title: { text: "Distribución de Estados" },
    credits: { enabled: false },
    series: [
      {
        name: "Checklists",
        data: [
          { name: "Mantenimiento", y: mantenimientos, color: "#f87171" },
          { name: "Sin Problemas", y: sinProblemas, color: "#86efac" }
        ]
      }
    ],
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>"
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %"
        }
      }
    }
  };
  // Datos para gráfico de barras de Score
  const scoreOptions = {
    chart: { type: "column" },
    title: { text: "Score de Salud por Checklist" },
    credits: { enabled: false },
    xAxis: {
      categories: scoreSalud.map(s => s.folio || s.checklistId),
      title: { text: "Checklist" }
    },
    yAxis: {
      min: 0,
      max: 100,
      title: { text: "Score (%)" }
    },
    series: [
      {
        name: "Score",
        data: scoreSalud.map(s => s.score),
        color: "#facc15"
      }
    ],
    tooltip: {
      pointFormat: "<b>{point.y}%</b>"
    },
    plotOptions: {
      column: {
        dataLabels: { enabled: true, format: "{y}%" }
      }
    }
  };
  async function predecirSeleccionado(id) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboards/checklists/${id}`);
      const checklist = await res.json();

      if (!checklist || !checklist.contenido_json) {
        setResultadoId({ error: "Checklist no contiene datos para predecir" });
        return;
      }

      const resPrediccion = await predecirChecklistIA(checklist);
      setResultadoId(resPrediccion);
    } catch (err) {
      console.error(err);
      setResultadoId({ error: "Error al predecir" });
    }
  }
  useEffect(() => {
    if (selectedChecklist) predecirSeleccionado(selectedChecklist);
  }, [selectedChecklist]);

  useEffect(() => {
    async function entrenarYPredecir() {
      try {        
        const resEntrenamiento = await entrenarModeloIA();
        if (!resEntrenamiento.error) {
          const checklistEjemplo = {
            contenido_json: {
              estructura_json: [
                { fields: [{ cB: "si" }, { cB: "no" }, { cB: "si" }] },
              ],
            },
          };
          const resPrediccion = await predecirChecklistIA(checklistEjemplo);

          setResultado(resPrediccion);
        }
      } catch (err) {
        console.error("❌ Error en IA:", err);
      }
    }

    entrenarYPredecir();
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboards/checklists`)
      .then(res => res.json())
      .then(data => setChecklists(data))
      .catch(err => console.error('Error fetching checklists:', err));
  }, []);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboards/scoreSalud`)
      .then((res) => {
        if (!res.ok) throw new Error("API no disponible");
        return res.json();
      })
      .then((data) => setScoreSalud(data.scoreSalud))
      .catch((err) => {
        console.error("Error fetching scoreSalud:", err);
        setScoreSalud(mockScoreSalud);
      });
  }, []);


 return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Título principal */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Dashboard de Checklists
      </h2>
      {/* Sección de métricas resumidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200">
          <p className="text-gray-500 text-sm">Total Checklists</p>
          <h3 className="text-2xl font-bold text-blue-600">{checklists.length}</h3>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200">
          <p className="text-gray-500 text-sm">En Mantenimiento</p>
          <h3 className="text-2xl font-bold text-red-500">
            {mantenimientos}
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200">
          <p className="text-gray-500 text-sm">Sin Problemas</p>
          <h3 className="text-2xl font-bold text-green-500">
            {sinProblemas}
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer border border-gray-200">
          <p className="text-gray-500 text-sm">Score Promedio</p>
          <h3 className="text-2xl font-bold text-yellow-500">
            {scoreSalud.length > 0
              ? Math.round(scoreSalud.reduce((a, s) => a + s.score, 0) / scoreSalud.length)
              : 0}%
          </h3>
        </div>
      </div>
      {/* Tabla principal */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto mb-8">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="p-3 border-b">ID</th>
            <th className="p-3 border-b">Estado</th>
            <th className="p-3 border-b">Errores</th>
          </tr>
        </thead>
        <tbody>
          {filasAMostrar.map((c) => (
            <tr
              key={c.checklistId}
              className={`${
                c.estado === "Mantenimiento"
                  ? "bg-red-50"
                  : "bg-green-50"
              } border-b hover:bg-gray-100 transition`}
            >
              <td className="p-3 font-semibold">{c.folio || c.checklistId}</td>
              <td className="p-3 font-semibold">{c.estado}</td>
              <td className="p-3 text-gray-700">
                {c.errores.length > 0
                  ? `Problemas: ${c.errores
                      .map((e) => e.replace(": Reparar", ""))
                      .join(", ")}`
                  : "Sin problemas"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón "Ver más" solo si hay más de 3 filas */}
      {checklists.length > 3 && (
          <button
            onClick={() => setMostrarTodo(!mostrarTodo)}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-b px-4 py-2 transition-colors"
            >
            {mostrarTodo ? "Ver menos" : "Ver más"}
          </button>
      )}
      </div>
      {/* Resultados de IA */}
      <div className="bg-blue-50 border rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-2 text-gray-800">Consultar Checklist</h3>

        <select
          value={selectedChecklist}
          onChange={(e) => setSelectedChecklist(e.target.value)}
          className="border p-2 rounded-xl w-full mb-3"
        >
          <option value="">-- Selecciona un checklist --</option>
          {checklists.map((c) => (
            <option key={c.checklistId} value={c.checklistId}>
              {c.folio || c.checklistId} - {c.estado}
            </option>
          ))}
        </select>

        {resultadoId ? (
          resultadoId.error ? (
            <p className="text-red-500 font-semibold mt-2">
              ❌ {resultadoId.error}
            </p>
          ) : (
            <div className="mt-3 bg-white rounded-xl shadow-inner overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold text-gray-600">ID del Checklist</td>
                    <td className="px-4 py-2">{resultadoId.checklistId}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold text-gray-600">Score</td>
                    <td className="px-4 py-2">{resultadoId.score}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold text-gray-600">Errores detectados</td>
                    <td className="px-4 py-2">{resultadoId.negativos}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold text-gray-600">Estado predicho</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        resultadoId.estadoPredicho === "Completado"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {resultadoId.estadoPredicho}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        ) : (
          <p className="text-gray-500 italic mt-2">
            Selecciona un checklist para predecir
          </p>
        )}
      </div>
      {/* Sección de dashboards visuales con Highcharts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-4 shadow">
          <HighchartsReact highcharts={Highcharts} options={estadoOptions} />
        </div>
        <div className="bg-white rounded-2xl p-4 shadow">
          <HighchartsReact highcharts={Highcharts} options={scoreOptions} />
        </div>
      </div>
    </div>
  );
}
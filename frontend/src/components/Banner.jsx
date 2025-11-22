// src/components/Banner.jsx
import React from "react";

export default function Banner({ message, type = "info", onClose }) {
  const colors = {
    success: "text-green-600 border-green-500",
    error: "text-red-600 border-red-500",
    info: "text-blue-600 border-blue-500",
  };

  return (
    <div
      className={`
        fixed right-5 top-20
        p-4
        rounded-xl
        shadow-xl
        bg-white
        border-2
        ${colors[type]}
        animate-slide-in
        z-50
      `}
      style={{ minWidth: "280px" }}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{message}</span>

        <button
          className={`
            ml-3 font-bold text-xl
            hover:scale-110 transition-transform
            ${colors[type].split(" ")[0]}  // Solo el color del texto
          `}
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

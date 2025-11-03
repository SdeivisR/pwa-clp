// src/components/Banner.jsx
import React from "react";

export default function Banner({ message, type = "info", onClose }) {
  const colors = {
    success: "from-green-500 to-green-600 text-white",
    error: "from-red-500 to-red-600 text-white",
    info: "from-blue-500 to-blue-600 text-white",
  };

  return (
    <div
      className={`
        fixed right-5
        top-20
        p-4
        rounded-xl
        shadow-2xl
        bg-gradient-to-r ${colors[type]}
        border border-white/20
        backdrop-blur-sm
        animate-slide-in
        z-50
      `}
      style={{ minWidth: "280px" }}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{message}</span>
        <button
          className="ml-3 font-bold text-xl hover:scale-110 transition-transform"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}


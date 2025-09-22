// src/components/Spinner.jsx
import React from "react";

export default function Spinner({ size = 64, color = "blue" }) {
  const colors = {
    blue: "border-blue-500 border-t-transparent",
    green: "border-green-500 border-t-transparent",
    red: "border-red-500 border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-[9999]">
      <div
        className={`border-4 border-solid rounded-full animate-spin ${colors[color]}`}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}

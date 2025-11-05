import { useRef, useEffect, useState } from "react";
import { Trash2, Save, X, Image as ImageIcon } from "lucide-react";

const ImagenPad = ({
  width = 400,
  height = 200,
  onSave,
  onCancel,
}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [color, setColor] = useState("black");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLocked, setIsLocked] = useState(false);


  // Inicializa canvas con DPR para nitidez
  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctxRef.current = ctx;

    if (backgroundImage) drawBackground(backgroundImage);
  }, [width, height]);

  // Actualiza color de dibujo
  useEffect(() => {
    if (ctxRef.current) ctxRef.current.strokeStyle = color;
  }, [color]);

  // Dibuja fondo si hay imagen cargada
  const drawBackground = (imgSrc) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = imgSrc;
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const start = (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    drawingRef.current = true;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    if (isEmpty) setIsEmpty(false);
  };

  const end = (e) => {
    e?.preventDefault?.();
    drawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    if (backgroundImage) drawBackground(backgroundImage);
    setIsEmpty(true);
  };

  const saveImagen = () => {
    const dataURL = canvasRef.current.toDataURL("image/png");
    onSave?.(dataURL);
  };

  // Cargar imagen de fondo
  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBackgroundImage(ev.target.result);
      drawBackground(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

return (
  <div className="w-full flex flex-col gap-4">
    {/* 🔹 Barra superior de acciones */}
    <div className="flex flex-wrap items-center justify-between bg-gray-50 p-2 rounded-lg shadow-sm">

      {/* Fondo */}
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-blue-600" />
        <select
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500"
          onChange={(e) => {
            const selected = e.target.value;
            if (!selected || isLocked) return; // Si ya está bloqueado, no permitir cambios

            if (selected === "custom") {
              document.getElementById("bg-upload").click();
            } else {
              setBackgroundImage(selected);
              drawBackground(selected);
              setIsLocked(true); // Bloquear después de seleccionar
            }
          }}
          disabled={isLocked}
        >
          <option value="">Seleccionar fondo...</option>
          <option value="/fondos/carro_frontal.png">Carro (Frontal)</option>
          <option value="/fondos/carro_lateral.png">Carro (Lateral)</option>
          <option value="/fondos/carro_posterior.png">Carro (Posterior)</option>
          <option value="/fondos/van.png">Van</option>
          <option value="/fondos/camion.png">Camión</option>
          <option value="custom">Subir imagen...</option>
        </select>

        <input
          id="bg-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleBackgroundUpload(e);
            setIsLocked(true); // También bloquear si se subió una imagen personalizada
          }}
        />
      </div>
      {/* Botones de acción */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={clearCanvas}
          className="p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-900"
          title="Borrar todo"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={saveImagen}
          className="p-2 rounded-full hover:bg-green-100 text-green-600 hover:text-green-900"
          title="Guardar imagen"
        >
          <Save className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-900"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>

    {/* 🖌️ Canvas */}
    <div className="relative border-2 border-gray-300 rounded-xl bg-white shadow-inner">
      {isEmpty && !backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
          Dibuje o cargue una imagen de fondo
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="rounded-xl touch-none"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        width={width}
        height={height}
      />
    </div>
    
    {/* 🎨 Colores */}
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-center flex-wrap gap-5">
        {[
          { color: "black", label: "Otros" },
          { color: "red", label: "Fisura" },
          { color: "orange", label: "Golpe" },
          { color: "yellow", label: "Rayon" },
          { color: "blue", label: "Suciedad" },
        ].map((c) => (
          <div key={c.color} className="flex flex-col items-center">
            <button
              onClick={() => setColor(c.color)}
              className={`w-7 h-7 rounded-full border-2 ${
                color === c.color ? "ring-2 ring-blue-400" : ""
              }`}
              style={{ backgroundColor: c.color }}
              title={c.label}
            />
            <span className="text-xs mt-2 text-gray-700">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
    
  </div>
);

};

export default ImagenPad;

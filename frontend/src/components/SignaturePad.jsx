import { useRef, useEffect, useState } from "react";
import { Trash2, Save, X } from "lucide-react";

const SignaturePad = ({
  width = 400,
  height = 200,
  onSave,
  onCancel,
}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Inicializa canvas con DPR para nitidez
  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
  }, [width, height]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Touch
    if (e.touches && e.touches.length > 0) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    // Mouse
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
    setIsEmpty(true);
  };

  const saveSignature = () => {
    const dataURL = canvasRef.current.toDataURL("image/png");
    onSave?.(dataURL);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 text-gray-600 hover:text-red-600"
          title="Cerrar"
        >
          <X className="w-5 h-5" /> Cerrar
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 text-gray-600 hover:text-red-600"
            title="Borrar"
          >
            <Trash2 className="w-5 h-5" /> Borrar
          </button>
          <button
            type="button"
            onClick={saveSignature}
            className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium"
            title="Guardar"
          >
            <Save className="w-5 h-5" /> Guardar
          </button>
        </div>
      </div>

      <div className="relative border-2 border-gray-300 rounded-xl bg-white shadow-inner">
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            Firme dentro del recuadro
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
          width={400}
          height={200}
        />
      </div>
    </div>
  );
};

export default SignaturePad;

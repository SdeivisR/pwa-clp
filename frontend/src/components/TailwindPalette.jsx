// src/components/ColorPalette.jsx
const colors = [
  "gray", "slate", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime",
  "green", "emerald", "teal", "cyan", "sky",
  "blue", "indigo", "violet", "purple",
  "fuchsia", "pink", "rose"
];

const shades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900
];

export default function ColorPalette() {
  return (
    <div className="p-6 space-y-6">
      {colors.map((color) => (
        <div key={color}>
          <h2 className="mb-2 font-semibold text-lg capitalize">{color}</h2>
          <div className="grid grid-cols-10 gap-2">
            {shades.map((shade) => (
              <div
                key={`${color}-${shade}`}
                className={`h-16 w-16 rounded-lg border flex items-center justify-center bg-${color}-${shade}`}
              >
                <span
                  className={`text-xs ${
                    shade < 400 ? "text-black" : "text-white"
                  }`}
                >
                  {shade}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

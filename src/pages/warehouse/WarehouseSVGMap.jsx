import { useState } from "react";

export default function WarehouseSVGMap() {
  const [selectedZone, setSelectedZone] = useState(null);

  const zones = [
    { id: "Z1", name: "Receiving", x: 50, y: 60, color: "#4ade80" },
    { id: "Z2", name: "Sorting", x: 220, y: 60, color: "#a78bfa" },
    { id: "Z3", name: "Storage", x: 50, y: 200, color: "#60a5fa" },
    { id: "Z4", name: "Packing", x: 220, y: 200, color: "#facc15" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🏭 Warehouse SVG Map
      </h1>

      <svg width="600" height="400" className="border-4 border-gray-400 bg-gray-50 rounded-xl shadow-lg">
        {/* جدران */}
        <rect x="10" y="10" width="580" height="380" fill="none" stroke="#6b7280" strokeWidth="3" />
        <text x="250" y="35" fill="#374151" fontSize="14">Main Warehouse</text>

        {/* Zones */}
        {zones.map((zone) => (
          <g key={zone.id} onClick={() => setSelectedZone(zone)} className="cursor-pointer hover:opacity-80 transition">
            <rect
              x={zone.x}
              y={zone.y}
              width="120"
              height="80"
              fill={zone.color}
              stroke="#1f2937"
              strokeWidth="2"
              rx="6"
            />
            <text x={zone.x + 30} y={zone.y + 45} fill="white" fontWeight="bold">
              {zone.id}
            </text>
            <text x={zone.x + 20} y={zone.y + 65} fill="white" fontSize="10">
              {zone.name}
            </text>
          </g>
        ))}

        {/* Entrance */}
        <rect x="270" y="360" width="60" height="20" fill="#9ca3af" />
        <text x="275" y="375" fill="white" fontSize="10">Entrance</text>
      </svg>

      {/* نافذة عند الضغط على Zone */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h3 className="text-xl font-bold mb-3">📦 {selectedZone.name} Zone</h3>
            <p className="text-gray-700 mb-3">This is a visual SVG zone representation.</p>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>🧱 Area ID: {selectedZone.id}</li>
              <li>🗄 Contains: 8 Shelves</li>
              <li>🚶 Aisles: 2</li>
            </ul>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setSelectedZone(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

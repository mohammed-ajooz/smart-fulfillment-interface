import { useState } from "react";

export default function LocationMap() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);

  const warehouse = {
    name: "Main Warehouse - Erbil",
    zones: [
      { id: "Z1", name: "Receiving Zone", top: "10%", left: "10%", color: "bg-green-400" },
      { id: "Z2", name: "Sorting Zone", top: "10%", left: "45%", color: "bg-purple-400" },
      { id: "Z3", name: "Storage Zone", top: "55%", left: "10%", color: "bg-blue-400" },
      { id: "Z4", name: "Packing Zone", top: "55%", left: "45%", color: "bg-yellow-400" },
    ],
  };

  const zoneStructure = {
    Z1: [
      { aisle: "Aisle 1", shelves: [{ id: "A1", label: "Shelf A1" }, { id: "A2", label: "Shelf A2" }] },
      { aisle: "Aisle 2", shelves: [{ id: "B1", label: "Shelf B1" }, { id: "B2", label: "Shelf B2" }] },
    ],
    Z3: [
      { aisle: "Rack Line 1", shelves: [{ id: "R1A", label: "Rack 1A" }, { id: "R1B", label: "Rack 1B" }] },
      { aisle: "Rack Line 2", shelves: [{ id: "R2A", label: "Rack 2A" }, { id: "R2B", label: "Rack 2B" }] },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🏭 <span>{warehouse.name}</span>
      </h1>

      {/* خريطة المناطق */}
      <div className="relative bg-gray-100 border-4 border-gray-400 rounded-xl h-[500px] w-full shadow-inner overflow-hidden">
        {warehouse.zones.map((zone) => (
          <div
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            className={`absolute ${zone.color} text-white text-center rounded-lg cursor-pointer shadow-md hover:scale-105 transition-all`}
            style={{ top: zone.top, left: zone.left, width: "200px", height: "120px" }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-lg font-bold">{zone.id}</span>
              <span className="text-sm">{zone.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* تفاصيل الـ Zone */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[800px] shadow-lg max-h-[600px] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">📦 {selectedZone.name}</h3>

            {/* رسم aisles */}
            <div className="relative bg-gray-100 border-2 border-gray-300 rounded-xl p-6 h-[400px]">
              <div className="grid grid-cols-3 gap-6 justify-center">
                {zoneStructure[selectedZone.id]?.map((aisle, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <h4 className="font-semibold text-gray-700 mb-2">{aisle.aisle}</h4>
                    <div className="flex flex-col gap-2">
                      {aisle.shelves.map((shelf) => (
                        <div
                          key={shelf.id}
                          onClick={() => setSelectedShelf(shelf)}
                          className="bg-blue-500 text-white px-3 py-2 rounded text-sm text-center shadow hover:bg-blue-600 cursor-pointer"
                        >
                          {shelf.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setSelectedZone(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* تفاصيل Shelf */}
      {selectedShelf && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h3 className="text-xl font-bold mb-3">🗄 {selectedShelf.label}</h3>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>📦 Items: 120</li>
              <li>✅ Status: In Use</li>
              <li>📍 Location: Aisle 2 / Zone 3</li>
              <li>👤 Client: EaglePost</li>
            </ul>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setSelectedShelf(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

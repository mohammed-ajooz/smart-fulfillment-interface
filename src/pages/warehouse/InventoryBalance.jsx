import { useState } from "react";
import {
  Search,
  Barcode,
  Warehouse,
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const InventoryBalance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [filter, setFilter] = useState("All");

  // 🧱 بيانات مؤقتة — لاحقًا من API
  const inventoryData = [
    {
      id: 1,
      sku: "SKU-1001",
      name: "Wireless Mouse",
      qty: 180,
      minQty: 50,
      maxQty: 200,
      location: "Aisle 3 - Shelf B2",
      warehouse: "Erbil WH",
      lastUpdated: "2025-10-17",
      history: [160, 170, 155, 180, 190, 175, 180],
    },
    {
      id: 2,
      sku: "SKU-1002",
      name: "Mechanical Keyboard",
      qty: 60,
      minQty: 100,
      maxQty: 300,
      location: "Aisle 1 - Shelf A1",
      warehouse: "Erbil WH",
      lastUpdated: "2025-10-16",
      history: [220, 210, 190, 120, 80, 70, 60],
    },
    {
      id: 3,
      sku: "SKU-1003",
      name: "Laptop Stand",
      qty: 15,
      minQty: 30,
      maxQty: 150,
      location: "Zone B - Shelf D5",
      warehouse: "Duhok WH",
      lastUpdated: "2025-10-15",
      history: [50, 40, 30, 25, 20, 15, 15],
    },
  ];

  // 🔍 فلترة حسب البحث
  const filteredData = inventoryData.filter(
    (item) =>
      (filter === "All" || item.warehouse === filter) &&
      (item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 📦 الباركود
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const found = inventoryData.find(
      (item) => item.sku.toLowerCase() === barcodeInput.toLowerCase()
    );
    if (found) {
      alert(`✅ Found item: ${found.name} (${found.sku})`);
      setSearchTerm(found.sku);
    } else {
      alert("❌ No item found with this barcode");
    }
    setBarcodeInput("");
  };

  // 🎨 الحالة اللونية حسب الكمية
  const getStatusColor = (qty, min, max) => {
    const percent = (qty / max) * 100;
    if (qty <= min) return { color: "text-red-600", label: "Critical", percent };
    if (qty <= max * 0.4) return { color: "text-yellow-600", label: "Low", percent };
    return { color: "text-green-600", label: "Sufficient", percent };
  };

  // 🧠 حساب الاتجاه العام
  const getTrend = (history) => {
    if (!history || history.length < 2) return "stable";
    const diff = history[history.length - 1] - history[0];
    return diff > 0 ? "up" : diff < 0 ? "down" : "stable";
  };

  return (
    <div className="p-2">
      {/* ===== العنوان ===== */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Warehouse className="text-blue-600" /> Inventory Balance
        </h2>
        <div className="flex items-center gap-3">
          {/* فلترة حسب المستودع */}
          <select
            className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Warehouses</option>
            <option value="Erbil WH">Erbil Warehouse</option>
            <option value="Duhok WH">Duhok Warehouse</option>
          </select>

          {/* بحث */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search SKU, Name, or Location..."
              className="bg-transparent outline-none ml-2 text-sm w-52"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* باركود */}
          <form
            onSubmit={handleBarcodeSubmit}
            className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200"
          >
            <Barcode size={16} className="text-blue-600" />
            <input
              type="text"
              placeholder="Scan barcode..."
              className="bg-transparent outline-none ml-2 text-sm w-40"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 text-blue-700 font-semibold hover:text-blue-900"
            >
              Find
            </button>
          </form>
        </div>
      </div>

      {/* ===== الجدول ===== */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-3">Stock Overview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">SKU</th>
                <th className="border px-3 py-2 text-left">Item Name</th>
                <th className="border px-3 py-2 text-center">Qty</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Trend</th>
                <th className="border px-3 py-2 text-center">Chart</th>
                <th className="border px-3 py-2 text-left">Location</th>
                <th className="border px-3 py-2 text-left">Warehouse</th>
                <th className="border px-3 py-2 text-center">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const { color, label, percent } = getStatusColor(
                    item.qty,
                    item.minQty,
                    item.maxQty
                  );
                  const trend = getTrend(item.history);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="border px-3 py-2 font-medium">{item.sku}</td>
                      <td className="border px-3 py-2">{item.name}</td>
                      <td className="border px-3 py-2 text-center font-semibold">
                        {item.qty}
                      </td>

                      {/* الحالة */}
                      <td className="border px-3 py-2 text-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex items-center gap-1 ${color} text-sm font-semibold`}
                          >
                            {label === "Critical" ? (
                              <AlertTriangle size={14} />
                            ) : label === "Low" ? (
                              <TrendingDown size={14} />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                            {label}
                          </div>
                          <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                label === "Critical"
                                  ? "bg-red-500"
                                  : label === "Low"
                                  ? "bg-yellow-400"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* الاتجاه */}
                      <td className="border px-3 py-2 text-center">
                        {trend === "up" ? (
                          <div className="text-green-600 flex items-center gap-1 font-semibold">
                            <TrendingUp size={14} /> Up
                          </div>
                        ) : trend === "down" ? (
                          <div className="text-red-600 flex items-center gap-1 font-semibold">
                            <TrendingDown size={14} /> Down
                          </div>
                        ) : (
                          <span className="text-gray-500">Stable</span>
                        )}
                      </td>

                      {/* المخطط المصغر */}
                      <td className="border px-3 py-2">
                        <ResponsiveContainer width={100} height={35}>
                          <LineChart data={item.history.map((v, i) => ({ x: i, y: v }))}>
                            <Line
                              type="monotone"
                              dataKey="y"
                              stroke={
                                trend === "up"
                                  ? "#16a34a"
                                  : trend === "down"
                                  ? "#dc2626"
                                  : "#9ca3af"
                              }
                              strokeWidth={2}
                              dot={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #ccc",
                                fontSize: "12px",
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </td>

                      <td className="border px-3 py-2">{item.location}</td>
                      <td className="border px-3 py-2">{item.warehouse}</td>
                      <td className="border px-3 py-2 text-center text-gray-600 text-xs">
                        {item.lastUpdated}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 py-4">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryBalance;

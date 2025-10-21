import { useState } from "react";
import { Search, Barcode, Package, Clock, PauseCircle, CheckCircle } from "lucide-react";

const Inbound = () => {
  const tabs = ["Pending Scanning", "Pending Holding", "Pending Sorting"];
  const [activeTab, setActiveTab] = useState("Pending Scanning");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newLocation, setNewLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");

  // بيانات مؤقتة
  const data = {
    "Pending Scanning": [
      { id: 1, itemSKU: "SKU-12345", QTY: 50, Info: "From Driver A" },
      { id: 2, itemSKU: "SKU-67890", QTY: 20, Info: "From Driver B" },
    ],
    "Pending Holding": [
      { id: 5, itemSKU: "SKU-99999", QTY: 40, Info: "Opened package" },
      { id: 6, itemSKU: "SKU-11111", QTY: 10, Info: "Broken carton" },
    ],
    "Pending Sorting": [
      { id: 7, itemSKU: "SKU-54321", QTY: 12, Info: "Mixed Items" },
    ],
  };

  // ⚙️ إحصائيات تجريبية
  const stats = [
    {
      title: "Total Received",
      value: 120,
      icon: <CheckCircle size={20} className="text-green-600" />,
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      title: "Pending Scanning",
      value: data["Pending Scanning"].length,
      icon: <Clock size={20} className="text-blue-600" />,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "On Hold",
      value: data["Pending Holding"].length,
      icon: <PauseCircle size={20} className="text-orange-600" />,
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      title: "Pending Sorting",
      value: data["Pending Sorting"].length,
      icon: <Package size={20} className="text-purple-600" />,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  // 🔍 البحث
  const filteredData = data[activeTab].filter(
    (item) =>
      item.itemSKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Info.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📦 الباركود
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const matched = data[activeTab].find(
      (item) => item.itemSKU.toLowerCase() === barcodeInput.toLowerCase()
    );
    if (matched) {
      alert(`📦 Found: ${matched.itemSKU} — Ready to Receive!`);
      setSearchTerm(matched.itemSKU);
    } else {
      alert("❌ No matching item found for this barcode.");
    }
    setBarcodeInput("");
  };

  // 📍 تحديد الموقع
  const handleSetLocation = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSaveLocation = () => {
    if (!newLocation.trim()) {
      alert("Please enter a valid location!");
      return;
    }
    alert(`✅ ${selectedItem.itemSKU} assigned to: ${newLocation}`);
    setShowModal(false);
  };

  // ✅ الأكشن
  const handleAction = (id, action) => {
    alert(`Action "${action}" applied on record ID: ${id}`);
  };

  return (
    <div className="p-2">
      {/* ===== إحصائيات ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${stat.color}`}
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">{stat.icon}</div>
            <div>
              <div className="text-sm font-semibold">{stat.title}</div>
              <div className="text-xl font-bold">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Header ===== */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-wrap justify-between items-center mb-4">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* البحث + الباركود */}
        <div className="flex gap-3 items-center">
          {/* Search Box */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by SKU or Info..."
              className="bg-transparent outline-none ml-2 text-sm w-52"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Barcode Scanner */}
          <form
            onSubmit={handleBarcodeSubmit}
            className="flex items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200"
          >
            <Barcode size={16} className="text-green-600" />
            <input
              type="text"
              placeholder="Scan barcode..."
              className="bg-transparent outline-none ml-2 text-sm w-40"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 text-green-700 font-semibold hover:text-green-900"
            >
              Receive
            </button>
          </form>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-3">{activeTab}</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">ItemSKU</th>
                <th className="border px-3 py-2 text-left">QTY</th>
                <th className="border px-3 py-2 text-left">Info</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="border px-3 py-2 font-medium text-gray-700">
                      {item.itemSKU}
                    </td>
                    <td className="border px-3 py-2">{item.QTY}</td>
                    <td className="border px-3 py-2">{item.Info}</td>
                    <td className="border px-3 py-2 text-center">
                      {activeTab === "Pending Scanning" ? (
                        <select
                          className="border rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onChange={(e) => handleAction(item.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="receive">✅ Receive</option>
                          <option value="reject">❌ Reject</option>
                          <option value="hold">⏸ Hold</option>
                        </select>
                      ) : activeTab === "Pending Holding" ? (
                        <button
                          onClick={() => handleSetLocation(item)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                        >
                          ➡️ Send to Sorting
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetLocation(item)}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                        >
                          📍 Set Location
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No records found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Set New Location for{" "}
              <span className="text-blue-600">{selectedItem.itemSKU}</span>
            </h3>
            <input
              type="text"
              placeholder="Enter new location..."
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbound;

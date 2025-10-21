import { useState } from "react";
import {
  Search,
  Barcode,
  PackageSearch,
  PackageCheck,
  ShieldCheck,
  XCircle,
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const Returns = () => {
  const tabs = ["Pending Return", "Quality Check", "Restocked"];
  const [activeTab, setActiveTab] = useState("Pending Return");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qualityNote, setQualityNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");

  // بيانات تجريبية
  const data = [
    {
      id: 1,
      returnNo: "RET-001",
      itemSKU: "SKU-12345",
      reason: "Damaged box",
      qty: 2,
      status: "Pending Return",
    },
    {
      id: 2,
      returnNo: "RET-002",
      itemSKU: "SKU-98765",
      reason: "Wrong item",
      qty: 1,
      status: "Quality Check",
    },
    {
      id: 3,
      returnNo: "RET-003",
      itemSKU: "SKU-55555",
      reason: "Customer Return",
      qty: 3,
      status: "Restocked",
    },
  ];

  // الإحصائيات
  const stats = [
    {
      title: "Pending Return",
      value: data.filter((d) => d.status === "Pending Return").length,
      icon: <PackageSearch size={20} className="text-orange-600" />,
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      title: "Quality Check",
      value: data.filter((d) => d.status === "Quality Check").length,
      icon: <ClipboardCheck size={20} className="text-blue-600" />,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Restocked",
      value: data.filter((d) => d.status === "Restocked").length,
      icon: <ShieldCheck size={20} className="text-green-600" />,
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      title: "Rejected",
      value: 1,
      icon: <XCircle size={20} className="text-red-600" />,
      color: "bg-red-50 text-red-700 border-red-200",
    },
  ];

  // 🔍 البحث
  const filteredData = data.filter(
    (item) =>
      item.itemSKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.returnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📦 الباركود
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const found = data.find(
      (item) => item.itemSKU.toLowerCase() === barcodeInput.toLowerCase()
    );
    if (found) {
      alert(`✅ Found ${found.itemSKU} (${found.returnNo})`);
      setSearchTerm(found.itemSKU);
    } else {
      alert("❌ No item found for this barcode");
    }
    setBarcodeInput("");
  };

  // 🧠 فحص الجودة
  const handleQualityCheck = (item) => {
    setSelectedItem(item);
    setQualityNote("");
    setShowModal(true);
  };

  const handleSaveQuality = () => {
    alert(`Item ${selectedItem.itemSKU} marked as inspected`);
    setShowModal(false);
  };

  // ✅ شريط تقدم الحالة
  const getStatusFlow = (status) => {
    const steps = ["Pending Return", "Quality Check", "Restocked"];
    const currentStep = steps.indexOf(status);

    return (
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;

          const icon =
            step === "Pending Return" ? (
              <AlertTriangle size={16} />
            ) : step === "Quality Check" ? (
              <ClipboardCheck size={16} />
            ) : (
              <CheckCircle2 size={16} />
            );

          return (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-600"
                } ${isCurrent ? "animate-pulse" : ""}`}
              >
                {icon}
                <span>{step}</span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight
                  size={14}
                  className={`${
                    isActive ? "text-blue-600" : "text-gray-400"
                  } transition`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-2">
      {/* ===== الإحصائيات ===== */}
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

      {/* ===== شريط البحث والتبويبات ===== */}
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

        <div className="flex gap-3 items-center">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by SKU or Return No..."
              className="bg-transparent outline-none ml-2 text-sm w-52"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <form
            onSubmit={handleBarcodeSubmit}
            className="flex items-center bg-purple-50 px-3 py-2 rounded-lg border border-purple-200"
          >
            <Barcode size={16} className="text-purple-600" />
            <input
              type="text"
              placeholder="Scan barcode..."
              className="bg-transparent outline-none ml-2 text-sm w-40"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 text-purple-700 font-semibold hover:text-purple-900"
            >
              Find
            </button>
          </form>
        </div>
      </div>

      {/* ===== الجدول ===== */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-3">Return Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">Return No</th>
                <th className="border px-3 py-2 text-left">ItemSKU</th>
                <th className="border px-3 py-2 text-left">Reason</th>
                <th className="border px-3 py-2 text-center">Qty</th>
                <th className="border px-3 py-2 text-center">Progress</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition">
                    <td className="border px-3 py-2">{item.returnNo}</td>
                    <td className="border px-3 py-2">{item.itemSKU}</td>
                    <td className="border px-3 py-2">{item.reason}</td>
                    <td className="border px-3 py-2 text-center">{item.qty}</td>
                    <td className="border px-3 py-2 text-center">
                      {getStatusFlow(item.status)}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {item.status === "Pending Return" ? (
                        <select
                          className="border rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onChange={(e) =>
                            alert(`Action "${e.target.value}" on ${item.itemSKU}`)
                          }
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="accept">✅ Accept</option>
                          <option value="reject">❌ Reject</option>
                        </select>
                      ) : item.status === "Quality Check" ? (
                        <button
                          onClick={() => handleQualityCheck(item)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                        >
                          🧠 Inspect
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          ✔ Restocked
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-4">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== نافذة الفحص ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Quality Check for{" "}
              <span className="text-blue-600">{selectedItem.itemSKU}</span>
            </h3>
            <textarea
              placeholder="Add quality notes..."
              value={qualityNote}
              onChange={(e) => setQualityNote(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm h-24 focus:ring-2 focus:ring-blue-400 outline-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuality}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;

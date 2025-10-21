import { useState } from "react";
import {
  Search,
  Barcode,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  ArrowRight,
  PackageCheck,
} from "lucide-react";

const Outbound = () => {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");

  const tabs = ["All Orders", "Pending Dispatch", "Dispatched", "Delivered"];

  // بيانات مؤقتة (محاكاة)
  const data = [
    {
      id: 1,
      orderNo: "ORD-1001",
      customer: "Ali Ahmed",
      items: 3,
      status: "Pending Dispatch",
      info: "Erbil Branch",
    },
    {
      id: 2,
      orderNo: "ORD-1002",
      customer: "Blue Store",
      items: 1,
      status: "Dispatched",
      info: "Duhok",
    },
    {
      id: 3,
      orderNo: "ORD-1003",
      customer: "SmartTech",
      items: 2,
      status: "Delivered",
      info: "Sulaymaniyah",
    },
  ];

  // 📊 الإحصائيات
  const stats = [
    {
      title: "Pending Dispatch",
      value: data.filter((o) => o.status === "Pending Dispatch").length,
      icon: <Clock size={20} className="text-orange-600" />,
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      title: "Dispatched",
      value: data.filter((o) => o.status === "Dispatched").length,
      icon: <Truck size={20} className="text-blue-600" />,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Delivered",
      value: data.filter((o) => o.status === "Delivered").length,
      icon: <CheckCircle size={20} className="text-green-600" />,
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      title: "Failed / Rejected",
      value: 1,
      icon: <XCircle size={20} className="text-red-600" />,
      color: "bg-red-50 text-red-700 border-red-200",
    },
  ];

  // 🔍 البحث
  const filteredData = data.filter(
    (order) =>
      (activeTab === "All Orders" || order.status === activeTab) &&
      (order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.info.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 📦 الباركود
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const matched = data.find(
      (order) => order.orderNo.toLowerCase() === barcodeInput.toLowerCase()
    );
    if (matched) {
      alert(`🚚 Order ${matched.orderNo} found and ready for dispatch.`);
      setSearchTerm(matched.orderNo);
    } else {
      alert("❌ No order found with this barcode.");
    }
    setBarcodeInput("");
  };

  // 🚀 تأكيد الشحن
  const handleDispatch = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleConfirmDispatch = () => {
    alert(`✅ Order ${selectedOrder.orderNo} marked as dispatched!`);
    setShowModal(false);
  };

  // 🔁 شريط التقدم (Progress Flow)
  const getStatusFlow = (status) => {
    const steps = ["Pending Dispatch", "Dispatched", "Delivered"];
    const currentStep = steps.indexOf(status);

    return (
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;

          const icon =
            step === "Pending Dispatch" ? (
              <Clock size={16} />
            ) : step === "Dispatched" ? (
              <Truck size={16} />
            ) : (
              <CheckCircle size={16} />
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

      {/* ===== التبويبات + البحث ===== */}
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
              placeholder="Search by Order or Customer..."
              className="bg-transparent outline-none ml-2 text-sm w-52"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <form
            onSubmit={handleBarcodeSubmit}
            className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200"
          >
            <Barcode size={16} className="text-blue-600" />
            <input
              type="text"
              placeholder="Scan Order barcode..."
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
        <h2 className="text-lg font-semibold mb-3">Outbound Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">Order No</th>
                <th className="border px-3 py-2 text-left">Customer</th>
                <th className="border px-3 py-2 text-center">Items</th>
                <th className="border px-3 py-2 text-left">Info</th>
                <th className="border px-3 py-2 text-center">Progress</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="border px-3 py-2 font-medium text-gray-700">
                      {order.orderNo}
                    </td>
                    <td className="border px-3 py-2">{order.customer}</td>
                    <td className="border px-3 py-2 text-center">
                      {order.items}
                    </td>
                    <td className="border px-3 py-2">{order.info}</td>
                    <td className="border px-3 py-2 text-center">
                      {getStatusFlow(order.status)}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {order.status === "Pending Dispatch" ? (
                        <button
                          onClick={() => handleDispatch(order)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                        >
                          🚚 Dispatch
                        </button>
                      ) : order.status === "Dispatched" ? (
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
                          ✅ Mark Delivered
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          ✔ Delivered
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-4">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== نافذة التأكيد ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Dispatch for{" "}
              <span className="text-blue-600">{selectedOrder.orderNo}</span>
            </h3>
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-600">
                Driver / Courier Name:
              </label>
              <input
                type="text"
                placeholder="Enter driver name..."
                className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-600">
                Vehicle Plate:
              </label>
              <input
                type="text"
                placeholder="Enter vehicle info..."
                className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Outbound;

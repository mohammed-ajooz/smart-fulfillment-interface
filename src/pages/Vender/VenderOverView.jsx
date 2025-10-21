import { useState, useMemo } from "react";
import { Clock, Calendar, Filter, FileDown, X } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const VenderOverView = () => {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  // بيانات مؤقتة
  const orders = [
    {
      id: 1,
      poNumber: "PO-2025-001",
      itemName: "Wireless Mouse",
      status: "With Driver",
      sendDate: "2025-10-15T10:20:00",
      qty: 12,
      destination: "Erbil Warehouse",
    },
    {
      id: 2,
      poNumber: "PO-2025-002",
      itemName: "Keyboard RGB",
      status: "At Warehouse",
      sendDate: "2025-10-16T09:00:00",
      qty: 8,
      destination: "Duhok Hub",
    },
    {
      id: 3,
      poNumber: "PO-2025-003",
      itemName: "Power Bank 20,000mAh",
      status: "Out For Delivery",
      sendDate: "2025-10-17T12:30:00",
      qty: 5,
      destination: "Sulaymaniyah",
    },
    {
      id: 4,
      poNumber: "PO-2025-004",
      itemName: "Smart Watch X7",
      status: "Delivered",
      sendDate: "2025-10-14T15:10:00",
      qty: 3,
      destination: "Erbil",
    },
  ];

  // 🕒 حساب المدة
  const calcHours = (date) =>
    Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));

  const formatDuration = (date) => {
    const diff = calcHours(date);
    if (diff < 24) return `${diff} hrs`;
    const days = Math.floor(diff / 24);
    const hrs = diff % 24;
    return `${days}d ${hrs}h`;
  };

  // 🧩 الفلاتر
  const filteredOrders = useMemo(() => {
    const list = orders.filter((o) => {
      const matchStatus =
        statusFilter === "All" || o.status === statusFilter;
      const matchDate =
        !dateFilter ||
        new Date(o.sendDate).toDateString() ===
          new Date(dateFilter).toDateString();
      const matchSearch =
        o.itemName.toLowerCase().includes(search.toLowerCase()) ||
        o.poNumber.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === "All Orders" || o.status === "Delivered";
      return matchStatus && matchDate && matchSearch && matchTab;
    });

    // ترتيب حسب المدة
    return list.sort((a, b) =>
      sortOrder === "asc"
        ? calcHours(a.sendDate) - calcHours(b.sendDate)
        : calcHours(b.sendDate) - calcHours(a.sendDate)
    );
  }, [orders, statusFilter, dateFilter, search, activeTab, sortOrder]);

  // 🎨 ألوان الحالات
  const statusColors = {
    "With Driver": "#3b82f6",
    "At Warehouse": "#facc15",
    "Out For Delivery": "#fb923c",
    Delivered: "#22c55e",
  };

  // 📊 بيانات الرسم
  const chartData = useMemo(() => {
    const counts = {};
    filteredOrders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [filteredOrders]);

  // 📤 عمليات التصدير
  const exportToExcel = () => {
    alert("📗 Export to Excel (coming soon)");
    setShowExportModal(false);
  };

  const exportToPDF = () => {
    alert("📄 Export to PDF (coming soon)");
    setShowExportModal(false);
  };

  return (
    <div className="p-6">
      {/* العنوان + زر التقارير */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Vendor Order Overview
        </h2>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm shadow-sm"
        >
          <FileDown size={16} /> Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-5 border-b">
        {["All Orders", "Delivered Items"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-3 mb-6 rounded-xl border shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="With Driver">With Driver</option>
            <option value="At Warehouse">At Warehouse</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="desc">Longest Duration</option>
            <option value="asc">Shortest Duration</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="🔍 Search by PO or Item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1.5 rounded-lg w-64 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
        />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Orders by Status
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={statusColors[entry.name] || "#ccc"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm italic text-center py-8">
            No data to display for selected filters.
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">PO Number</th>
              <th className="border px-3 py-2 text-left">Item Name</th>
              <th className="border px-3 py-2 text-center">Qty</th>
              <th className="border px-3 py-2 text-center">Destination</th>
              <th className="border px-3 py-2 text-center">Status</th>
              <th className="border px-3 py-2 text-center">Sent</th>
              <th className="border px-3 py-2 text-center">Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{order.poNumber}</td>
                  <td className="border px-3 py-2">{order.itemName}</td>
                  <td className="border px-3 py-2 text-center">{order.qty}</td>
                  <td className="border px-3 py-2 text-center">
                    {order.destination}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor:
                          statusColors[order.status] + "20",
                        color: statusColors[order.status],
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="border px-3 py-2 text-center text-gray-600">
                    {new Date(order.sendDate).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 text-center text-gray-800">
                    {formatDuration(order.sendDate)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📤 Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Export Report
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose the format you want to export the report in:
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                📗 Export to Excel
              </button>
              <button
                onClick={exportToPDF}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                📄 Export to PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenderOverView;

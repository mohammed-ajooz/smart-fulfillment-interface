import { useState, useEffect } from "react";
import { TrendingUp, Package, Truck, Users, ClipboardList, RefreshCcw } from "lucide-react";

const Dashboard = () => {
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStale, setIsStale] = useState(false);

  // 🔄 محاكاة المزامنة (نفس فكرة Sidebar)
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const mins = Math.floor(diff / 60000);
      setMinutesAgo(mins);
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 1000);
      setIsStale(mins >= 10);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: "Inbound Shipments", value: 124, icon: <Truck className="text-blue-500 w-6 h-6" />, color: "bg-blue-100" },
    { title: "Outbound Shipments", value: 87, icon: <Package className="text-indigo-500 w-6 h-6" />, color: "bg-indigo-100" },
    { title: "Inventory Items", value: 1432, icon: <TrendingUp className="text-green-600 w-6 h-6" />, color: "bg-green-100" },
    { title: "Active Employees", value: 26, icon: <Users className="text-amber-600 w-6 h-6" />, color: "bg-amber-100" },
    { title: "Open Tasks", value: 12, icon: <ClipboardList className="text-purple-600 w-6 h-6" />, color: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📊 Smart Dashboard</h1>
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            isStale ? "text-red-600" : "text-gray-500"
          }`}
          title={
            isStale
              ? `⚠️ No sync for ${minutesAgo} min`
              : `Last sync ${
                  minutesAgo === 0 ? "just now" : `${minutesAgo} min ago`
                }`
          }
        >
          <RefreshCcw
            size={16}
            className={`${
              isUpdating
                ? "text-green-500 rotate-180 transition-transform"
                : "text-blue-500"
            }`}
          />
          {isStale
            ? "Connection Lost"
            : minutesAgo === 0
            ? "Synced just now"
            : `Updated ${minutesAgo}m ago`}
        </div>
      </div>

      {/* الكروت الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 ${item.color}`}
          >
            <div>
              <p className="text-gray-500 text-sm font-medium">{item.title}</p>
              <h2 className="text-3xl font-bold text-gray-800">{item.value}</h2>
            </div>
            <div className="bg-white p-3 rounded-full shadow-sm">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* الرسم البياني البسيط */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Weekly Inbound & Outbound Overview
        </h2>
        <div className="h-48 flex items-end gap-3">
          {[40, 60, 35, 75, 50, 90, 70].map((val, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className="w-6 rounded-t-md bg-gradient-to-t from-blue-400 to-blue-200 transition-all hover:opacity-80"
                style={{ height: `${val}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* جدول مختصر للأنشطة */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activities
        </h2>
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left border">Time</th>
              <th className="px-3 py-2 text-left border">Action</th>
              <th className="px-3 py-2 text-left border">User</th>
              <th className="px-3 py-2 text-left border">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                time: "09:12 AM",
                action: "Received shipment SO-459",
                user: "Ali Receiver",
                status: "Completed",
              },
              {
                time: "09:20 AM",
                action: "Outbound prepared for client #332",
                user: "Sara Dispatcher",
                status: "Ready",
              },
              {
                time: "09:42 AM",
                action: "Updated shelf A4-12",
                user: "Hassan Sorter",
                status: "In Progress",
              },
            ].map((a, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-3 py-2 border">{a.time}</td>
                <td className="px-3 py-2 border">{a.action}</td>
                <td className="px-3 py-2 border">{a.user}</td>
                <td className="px-3 py-2 border text-blue-600 font-medium">
                  {a.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

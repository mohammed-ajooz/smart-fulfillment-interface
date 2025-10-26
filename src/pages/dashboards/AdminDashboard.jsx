// src/pages/dashboards/AdminDashboard.jsx
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  Truck,
  Users,
  ClipboardList,
  RefreshCcw,
} from "lucide-react";

const AdminDashboard = () => {
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStale, setIsStale] = useState(false);

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📊 Admin Dashboard</h1>
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            isStale ? "text-red-600" : "text-gray-500"
          }`}
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

      {/* 🧮 الكروت */}
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
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  RefreshCcw,
  LayoutDashboard,
  MapPin,
} from "lucide-react";

const SmartSidebar = () => {
  const location = useLocation();
  const [openSystem, setOpenSystem] = useState("warehouse");
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [userRole, setUserRole] = useState("GUEST"); // 👈 الدور الحالي

  // 🧩 قراءة الدور من localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserRole(parsed.role || "GUEST");
    }
  }, []);

  // 🏢 قائمة الفروع المتاحة
  const branches = ["Erbil Main Warehouse", "Duhok Branch", "Sulaymaniyah Hub"];
  const [activeBranch, setActiveBranch] = useState(branches[0]);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  // 🔄 تحديث حالة المزامنة
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const diffMs = Date.now() - startTime;
      const mins = Math.floor(diffMs / 60000);
      setMinutesAgo(mins);
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 1000);
      setIsStale(mins >= 10);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 💼 جميع الأنظمة (قبل التصفية)
  const systems = [
    {
      id: "warehouse",
      label: "🏭 Warehouse",
      color: "text-blue-600",
      roles: ["warehouse"],
      links: [
        { to: "/Inbound", label: "Inbound", icon: "🚚" },
        { to: "/Outbound", label: "Outbound", icon: "🚛" },
        { to: "/Locations", label: "Locations", icon: "🗺️" },
        { to: "/InventoryBalance", label: "Inventory", icon: "📦" },
        { to: "/Returns", label: "Returns", icon: "🔁" },
      ],
    },
    {
      id: "dispatching",
      label: "⚙️ Dispatching",
      color: "text-purple-600",
      roles: ["ADMIN", "STAFF", "DRIVER"],
      links: [
        { to: "/SalesOrders", label: "Sales Orders", icon: "🧾" },
        { to: "/POOrders", label: "PO Orders", icon: "🛒" },
        { to: "/drivers", label: "Drivers", icon: "🚗" },
        { to: "/routes", label: "Routes", icon: "🛣️" },
        { to: "/tasks", label: "Tasks", icon: "📋" },
      ],
    },
    {
      id: "hr",
      label: "👥 HR",
      color: "text-green-600",
      roles: ["ADMIN", "FINANCE"],
      links: [
        { to: "/employees", label: "Employees", icon: "🧑‍💼" },
        { to: "/attendance", label: "Attendance", icon: "🕒" },
        { to: "/payroll", label: "Payroll", icon: "💰" },
      ],
    },
    {
      id: "vendor",
      label: "🏪 Vendor",
      color: "text-yellow-600",
      roles: ["ADMIN", "VENDOR"],
      links: [
        { to: "/VenderOverView", label: "Overview", icon: "📊" },
        { to: "/VenderInventory", label: "Inventory Items", icon: "📦" },
        { to: "/VenderOrders", label: "Vendor Orders", icon: "🧾" },
        { to: "/ExpressShipping", label: "Express Shipping", icon: "🚀" },
        { to: "/returnedOrders", label: "Returned Orders", icon: "↩️" },
        { to: "/finance", label: "Finance", icon: "💰" },
      ],
    },
  ];

  // ✅ تصفية الأنظمة حسب الدور
  const visibleSystems = systems.filter((sys) =>
    sys.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
      {/* 🔹 شعار النظام */}
      <div className="p-4 text-2xl font-bold text-blue-600 border-b flex items-center gap-2">
        <LayoutDashboard className="text-blue-600" />
        SmartLogix
      </div>

      {/* 🏢 الفرع */}
      <div className="relative bg-blue-50 px-4 py-2 border-b border-blue-100">
        <button
          onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
          className="flex items-center justify-between w-full text-sm font-medium text-blue-800"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{activeBranch}</span>
          </div>
          <ChevronDown
            size={14}
            className={`transition-transform ${
              branchDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {branchDropdownOpen && (
          <div className="absolute z-50 bg-white border border-blue-200 shadow-md rounded-md mt-2 w-[90%] left-1/2 -translate-x-1/2">
            {branches.map((branch) => (
              <button
                key={branch}
                onClick={() => {
                  setActiveBranch(branch);
                  setBranchDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                  branch === activeBranch
                    ? "text-blue-700 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🏠 Dashboard */}
      <Link
        to="/"
        className={`mx-3 mt-3 flex items-center justify-between px-3 py-2 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-all ${
          location.pathname === "/" ? "bg-indigo-100" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          🏠 <span>Dashboard</span>
        </div>
        <div
          className={`flex items-center justify-center w-4 h-4 rounded-full ${
            isStale
              ? "bg-red-500"
              : isUpdating
              ? "bg-green-400 animate-pulse"
              : "bg-blue-400"
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
            size={10}
            className={`text-white ${
              isUpdating ? "rotate-180 transition-transform" : ""
            }`}
          />
        </div>
      </Link>

      {/* 🔹 الأنظمة */}
      <nav className="flex-1 overflow-y-auto p-3">
        {visibleSystems.length === 0 && (
          <p className="text-center text-gray-400 text-sm">
            No modules available for your role.
          </p>
        )}
        {visibleSystems.map((sys) => (
          <div key={sys.id} className="mb-3">
            <button
              onClick={() =>
                setOpenSystem(openSystem === sys.id ? null : sys.id)
              }
              className={`flex justify-between items-center w-full px-3 py-2 text-left font-semibold rounded-lg transition-all hover:bg-gray-100 ${sys.color}`}
            >
              <span>{sys.label}</span>
              {openSystem === sys.id ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openSystem === sys.id && (
              <div className="ml-5 mt-2 space-y-1 transition-all">
                {sys.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-all ${
                      location.pathname === link.to
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* الفوتر */}
      <div className="p-3 text-center text-xs text-gray-400 border-t">
        © 2025 SmartLogix
      </div>
    </aside>
  );
};

export default SmartSidebar;

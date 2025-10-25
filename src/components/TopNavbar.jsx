import { useState, useEffect } from "react";
import { Bell, RefreshCcw, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopNavbar = () => {
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🧩 جلب بيانات المستخدم من localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // 🔁 مؤقت لحالة التزامن
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

  // 🚪 دالة تسجيل الخروج
  const handleLogout = () => {
    // تأكيد
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    // حذف البيانات من localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // إعادة التوجيه إلى صفحة الدخول
    navigate("/login");
  };

  return (
    <header className="w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 py-3">
        {/* شعار */}
        <div className="flex items-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1048/1048949.png"
            alt="logo"
            className="w-8 h-8"
          />
          <h1 className="text-xl font-semibold text-gray-800">SmartLogix ERP</h1>
        </div>

        {/* أدوات */}
        <div className="flex items-center gap-5">
          {/* 🔄 حالة التحديث */}
          <div
            className={`relative flex items-center justify-center w-5 h-5 rounded-full ${
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
              size={12}
              className={`text-white ${
                isUpdating ? "rotate-180 transition-transform" : ""
              }`}
            />
          </div>

          {/* الجرس */}
          <div className="relative cursor-pointer hover:scale-110 transition">
            <Bell className="w-5 h-5 text-gray-600" />
          </div>

          {/* المستخدم */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-medium text-gray-700 text-sm">
                  {user?.name || "Guest"}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.role || "No Role"}
                </span>
              </div>
            </div>

            {/* زر تسجيل الخروج */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium border border-red-300 px-2 py-1 rounded-md transition hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

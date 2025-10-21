import SmartSidebar from "./SmartSidebar";
import TopNavbar from "./TopNavbar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ✅ الشريط الجانبي الذكي */}
      <SmartSidebar />

      {/* ✅ القسم الرئيسي */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ الشريط العلوي */}
        <TopNavbar />

        {/* ✅ المحتوى الرئيسي */}
        <main className="p-6 overflow-auto bg-gray-50 flex-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

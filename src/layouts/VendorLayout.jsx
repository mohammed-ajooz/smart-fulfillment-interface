import VendorSidebar from "../components/VendorSidebar";

const VendorLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <VendorSidebar />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default VendorLayout;

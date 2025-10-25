import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  // ✅ أضف هذا
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";

// Warehouse pages
import Dashboard from "./pages/Dashboard";
import Inbound from "./pages/warehouse/Inbound";
import Outbound from "./pages/warehouse/Outbound";
import InventoryBalance from "./pages/warehouse/InventoryBalance";
import Returns from "./pages/warehouse/Returns";
import LocationMap from "./pages/warehouse/LocationMap";

// operations
import SalesOrders from "./pages/operations/SalesOrders";
import POOrders from "./pages/operations/POOrders";

// Vendor
import VenderOrders from "./pages/Vender/VenderOrders";
import VenderInventory from "./pages/Vender/VenderInventory";
import VenderOverView from "./pages/Vender/VenderOverView";
import ExpressShipping from "./pages/Vender/ExpressShipping";

// Settings
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* صفحة تسجيل الدخول بدون حماية */}
          <Route path="/login" element={<Login />} />

          {/* باقي الصفحات محمية */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* Warehouse Routes */}
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Inbound" element={<Inbound />} />
                    <Route path="/Outbound" element={<Outbound />} />
                    <Route path="/InventoryBalance" element={<InventoryBalance />} />
                    <Route path="/Locations" element={<LocationMap />} />
                    <Route path="/Returns" element={<Returns />} />

                    {/* Operation Routes */}
                    <Route path="/SalesOrders" element={<SalesOrders />} />
                    <Route path="/POOrders" element={<POOrders />} />

                    {/* Vendor Routes */}
                    <Route path="/VenderOrders" element={<VenderOrders />} />
                    <Route path="/VenderInventory" element={<VenderInventory />} />
                    <Route path="/VenderOverView" element={<VenderOverView />} />
                    <Route path="/ExpressShipping" element={<ExpressShipping />} />

                    {/* General */}
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

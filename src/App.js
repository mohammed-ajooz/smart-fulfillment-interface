import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Warehouse pages
import Dashboard from "./pages/Dashboard";
import Inbound from "./pages/warehouse/Inbound";
import Outbound from "./pages/warehouse/Outbound";
import InventoryBalance from "./pages/warehouse/InventoryBalance";
import Returns from "./pages/warehouse/Returns";
import LocationMap from "./pages/warehouse/LocationMap";

// operations
import SalesOrders from "./pages/operations/SalesOrders";
import POOOrders from "./pages/operations/POOrders";


//Vendor
import VenderOrders from "./pages/Vender/VenderOrders";
import VenderInventory from "./pages/Vender/VenderInventory";
import VenderOverView from "./pages/Vender/VenderOverView";
import ExpressShipping from "./pages/Vender/ExpressShipping"

// Settings
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Warehouse Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/Inbound" element={<Inbound />} />
          <Route path="/Outbound" element={<Outbound />} />

          <Route path="/InventoryBalance" element={<InventoryBalance />} />
          <Route path="/Locations" element={<LocationMap />} />
          <Route path="/Returns" element={<Returns />} />

          {/* Operation Routes */}
          <Route path="/SalesOrders" element={<SalesOrders />} />
          <Route path="/POOrders" element={<POOOrders />} />

          {/* Vendor Routes */}
          <Route path="/VenderOrders" element={<VenderOrders />} />
          <Route path="/VenderInventory" element={<VenderInventory />} />
          <Route path="/VenderOverView" element={<VenderOverView />} />
          <Route path="/ExpressShipping" element={<ExpressShipping/>}/>
          {/* General */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

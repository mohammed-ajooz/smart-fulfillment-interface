import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Package, TrendingUp, DollarSign, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import VendorLayout from "../../layouts/VendorLayout";

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    activeOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setVendor(user);

    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/vendors/${user.id}/inventory`);
        const data = res.data || [];

        const totalProducts = data.length;
        const revenue = data.reduce(
          (sum, item) => sum + parseFloat(item.price || 0) * (item.stock || 0),
          0
        );

        setProducts(data.slice(0, 5));
        setSummary({ totalProducts, revenue, activeOrders: 3 });
      } catch (err) {
        console.error("Error fetching vendor overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <VendorLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🏪 Vendor Dashboard{" "}
          <span className="text-sm text-gray-500">({vendor?.name || "Vendor"})</span>
        </h1>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatCard title="Total Products" value={summary.totalProducts} color="blue" icon={<Package />} />
          <StatCard title="Revenue" value={`$${summary.revenue.toLocaleString()}`} color="green" icon={<DollarSign />} />
          <StatCard title="Active Orders" value={summary.activeOrders} color="yellow" icon={<TrendingUp />} />
        </div>

        {/* آخر المنتجات */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Latest Products</h2>
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left border">SKU</th>
                <th className="px-3 py-2 text-left border">Name</th>
                <th className="px-3 py-2 text-center border">Price</th>
                <th className="px-3 py-2 text-center border">Stock</th>
                <th className="px-3 py-2 text-center border">Status</th>
                <th className="px-3 py-2 text-center border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{p.sku}</td>
                  <td className="border px-3 py-2">{p.name}</td>
                  <td className="border px-3 py-2 text-center">${parseFloat(p.price).toFixed(2)}</td>
                  <td className="border px-3 py-2 text-center">{p.stock}</td>
                  <td className="border px-3 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <Link
                      to={`/vendor/product/${p.id}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                    >
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </VendorLayout>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div className={`flex items-center justify-between p-5 bg-${color}-50 rounded-xl shadow-sm`}>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold text-${color}-700`}>{value}</h2>
    </div>
    <div className={`text-${color}-600`}>{icon}</div>
  </div>
);

export default VendorDashboard;

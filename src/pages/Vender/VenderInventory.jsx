import { useState, useEffect } from "react";
import { Edit3, Check, X, PlusCircle } from "lucide-react";
import axiosInstance from "../../api/axiosInstance"; // ✅ تأكد من المسار الصحيح

const VenderInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    sku: "",
    name: "",
    category: "",
    price: "",
    qty: "",
  });

  // 🔹 تحميل بيانات المخزون عند فتح الصفحة
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) throw new Error("User not found");

        // ✅ طلب API (يمكنك تعديل الرابط حسب مسارك)
        const response = await axiosInstance.get(
          `/products`
        );

        // 🔹 تحويل البيانات إلى الشكل المطلوب في الجدول
        const data = response.data.map((item) => ({
          id: item.id,
          sku: item.sku,
          name: item.name,
          category: item.categoryId || "Uncategorized",
          price: parseFloat(item.price),
          qty: item.stock,
          status: item.active ? "Active" : "Inactive",
          updatedAt: new Date(item.createdAt).toLocaleString(),
          vendorName: item.vendor?.companyName,
        }));

        setInventory(data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // 🔍 بحث
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  // ✏️ بدء التعديل
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditedItem({ ...item });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedItem({});
  };

  const handleSave = () => {
    const updatedAt = new Date().toLocaleString();
    setInventory(
      inventory.map((i) =>
        i.id === editingId ? { ...editedItem, updatedAt } : i
      )
    );
    setEditingId(null);
    alert(`✅ Updated item: ${editedItem.name}`);
  };

  const handleAddNew = () => setShowModal(true);

  const handleSaveNew = () => {
    if (!newItem.name || !newItem.sku || !newItem.price || !newItem.qty) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    const status = newItem.qty > 10 ? "Active" : "Low Stock";
    const newEntry = {
      id: Date.now(),
      ...newItem,
      price: parseFloat(newItem.price),
      qty: parseInt(newItem.qty),
      status,
      updatedAt: new Date().toLocaleString(),
    };

    setInventory([...inventory, newEntry]);
    setShowModal(false);
    alert(`✅ Added new item: ${newItem.name}`);
  };

  // ⏳ حالة التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80 text-gray-600">
        <span className="animate-pulse">Loading inventory...</span>
      </div>
    );
  }

  // ⚠️ في حالة الخطأ
  if (error) {
    return (
      <div className="text-center text-red-500 font-medium mt-10">{error}</div>
    );
  }

  return (
    <div className="p-6">
      {/* العنوان + البحث + زر الإضافة */}
      <div className="flex flex-wrap justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          Vendor Inventory
          {inventory.length > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({inventory.length} items)
            </span>
          )}
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Search by name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg w-72 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
          />
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm shadow-sm"
          >
            <PlusCircle size={16} /> Add Item
          </button>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">SKU</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Category</th>
              <th className="border px-3 py-2 text-center">Price</th>
              <th className="border px-3 py-2 text-center">Qty</th>
              <th className="border px-3 py-2 text-center">Status</th>
              <th className="border px-3 py-2 text-center">Last Updated</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-all">
                <td className="border px-3 py-2">{item.sku}</td>
                <td className="border px-3 py-2">{item.name}</td>
                <td className="border px-3 py-2 text-center">
                  {item.category}
                </td>
                <td className="border px-3 py-2 text-center">
                  ${item.price.toFixed(2)}
                </td>
                <td className="border px-3 py-2 text-center">{item.qty}</td>
                <td className="border px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="border px-3 py-2 text-center text-gray-500 text-xs">
                  {item.updatedAt}
                </td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1 mx-auto"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                </td>
              </tr>
            ))}

            {filteredInventory.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VenderInventory;

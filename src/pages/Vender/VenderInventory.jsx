import { useState } from "react";
import { Edit3, Check, X, PlusCircle } from "lucide-react";

const VenderInventory = () => {
  // ✅ قائمة الفئات (يمكن لاحقًا جلبها من API)
  const categories = [
    "Accessories",
    "Chargers",
    "Cables",
    "Batteries",
    "Smart Devices",
    "Home Electronics",
  ];

  const [inventory, setInventory] = useState([
    {
      id: 1,
      sku: "SKU-001",
      name: "Wireless Mouse",
      category: "Accessories",
      price: 8.5,
      qty: 120,
      status: "Active",
      updatedAt: "2025-10-17 14:32",
    },
    {
      id: 2,
      sku: "SKU-002",
      name: "Mechanical Keyboard",
      category: "Accessories",
      price: 22.3,
      qty: 45,
      status: "Active",
      updatedAt: "2025-10-16 09:25",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    sku: "",
    name: "",
    category: categories[0],
    price: "",
    qty: "",
  });

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

  // ❌ إلغاء التعديل
  const handleCancel = () => {
    setEditingId(null);
    setEditedItem({});
  };

  // 💾 حفظ التعديل
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

  // ➕ فتح نافذة إضافة مادة جديدة
  const handleAddNew = () => {
    setNewItem({
      sku: "",
      name: "",
      category: categories[0],
      price: "",
      qty: "",
    });
    setShowModal(true);
  };

  // 💾 حفظ المادة الجديدة
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

  return (
    <div className="p-6">
      {/* العنوان + البحث + زر الإضافة */}
      <div className="flex flex-wrap justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">Vendor Inventory</h2>

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

                {/* الفئة */}
                <td className="border px-3 py-2 text-center">
                  {editingId === item.id ? (
                    <select
                      value={editedItem.category}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          category: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.category
                  )}
                </td>

                {/* السعر */}
                <td className="border px-3 py-2 text-center">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editedItem.price}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-20 text-center border rounded px-1 py-0.5 text-sm"
                    />
                  ) : (
                    `$${item.price.toFixed(2)}`
                  )}
                </td>

                {/* الكمية */}
                <td className="border px-3 py-2 text-center">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      value={editedItem.qty}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          qty: parseInt(e.target.value),
                        })
                      }
                      className="w-16 text-center border rounded px-1 py-0.5 text-sm"
                    />
                  ) : (
                    item.qty
                  )}
                </td>

                {/* الحالة */}
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

                {/* آخر تحديث */}
                <td className="border px-3 py-2 text-center text-gray-500 text-xs">
                  {item.updatedAt}
                </td>

                {/* الأكشن */}
                <td className="border px-3 py-2 text-center">
                  {editingId === item.id ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={handleSave}
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs flex items-center gap-1"
                      >
                        <Check size={14} /> Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1 mx-auto"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-6 italic">
                  No matching items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* نافذة إضافة مادة جديدة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl border w-[400px]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Add New Item</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <div>
                <label className="font-medium">SKU</label>
                <input
                  type="text"
                  value={newItem.sku}
                  onChange={(e) =>
                    setNewItem({ ...newItem, sku: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </div>
              <div>
                <label className="font-medium">Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </div>
              <div>
                <label className="font-medium">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1 mt-1"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="font-medium">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-medium">Qty</label>
                  <input
                    type="number"
                    value={newItem.qty}
                    onChange={(e) =>
                      setNewItem({ ...newItem, qty: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1 mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="border-t p-3 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNew}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenderInventory;

import { useState, useMemo } from "react";
import { Search, Eye, CheckCircle2, XCircle, Filter } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const seedPOs = [
  {
    id: 1,
    poNumber: "PO-2025-001",
    supplier: "Global Imports",
    createdAt: "2025-10-10",
    status: "Pending",
    items: [
      { id: "i1", itemName: "Cardboard Box", qty: 100, price: 0.45 },
      { id: "i2", itemName: "Packing Tape", qty: 50, price: 1.2 },
    ],
    note: "Awaiting approval from procurement manager.",
  },
  {
    id: 2,
    poNumber: "PO-2025-002",
    supplier: "Smart Supply Co.",
    createdAt: "2025-10-12",
    status: "Received",
    items: [
      { id: "i3", itemName: "Printer Ink", qty: 10, price: 18.0 },
      { id: "i4", itemName: "A4 Paper (Box)", qty: 5, price: 25.0 },
    ],
    note: "Delivered to main warehouse.",
  },
  {
    id: 3,
    poNumber: "PO-2025-003",
    supplier: "Modern Packaging",
    createdAt: "2025-10-13",
    status: "Rejected",
    items: [
      { id: "i5", itemName: "Plastic Pallets", qty: 30, price: 6.5 },
    ],
    note: "Price discrepancy in supplier invoice.",
  },
];

const tabs = [
  { id: "Pending", label: "Pending Approval" },
  { id: "Received", label: "Received" },
  { id: "Rejected", label: "Rejected" },
  { id: "All", label: "All POs" },
];

const POOrders = () => {
  const [orders, setOrders] = useState(seedPOs);
  const [activeTab, setActiveTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(null);

  const counts = useMemo(() => {
    const map = { Pending: 0, Received: 0, Rejected: 0 };
    for (const o of orders) if (map[o.status] !== undefined) map[o.status]++;
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab !== "All" && o.status !== activeTab) return false;
      const s = search.trim().toLowerCase();
      if (s && !(o.poNumber.toLowerCase().includes(s) || o.supplier.toLowerCase().includes(s))) return false;
      if (dateFrom && o.createdAt < dateFrom) return false;
      if (dateTo && o.createdAt > dateTo) return false;
      return true;
    });
  }, [orders, activeTab, search, dateFrom, dateTo]);

  const total = (po) => po.items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const approvePO = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "Received", note: "✅ Received and stored in warehouse." } : o
      )
    );
  };

  const rejectPO = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "Rejected", note: "❌ Rejected by procurement." } : o
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">Purchase Orders</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Search size={16} className="text-gray-500" />
              <input
                className="bg-transparent outline-none ml-2 text-sm w-56"
                placeholder="Search PO or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Filter size={16} className="text-gray-500" />
              <input
                type="date"
                className="border rounded-lg px-2 py-1"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                className="border rounded-lg px-2 py-1"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {tabs.map((t) => {
            const badge =
              t.id === "Pending"
                ? counts.Pending
                : t.id === "Received"
                ? counts.Received
                : t.id === "Rejected"
                ? counts.Rejected
                : orders.length;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                  activeTab === t.id
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {t.label}
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    activeTab === t.id ? "bg-white/20" : "bg-gray-200"
                  }`}
                >
                  {badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">PO Number</th>
                <th className="border px-3 py-2 text-left">Supplier</th>
                <th className="border px-3 py-2 text-center">Items</th>
                <th className="border px-3 py-2 text-right">Total</th>
                <th className="border px-3 py-2 text-center">Date</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 font-medium">{po.poNumber}</td>
                    <td className="border px-3 py-2">{po.supplier}</td>
                    <td className="border px-3 py-2 text-center">{po.items.length}</td>
                    <td className="border px-3 py-2 text-right font-semibold">{fmt(total(po))}</td>
                    <td className="border px-3 py-2 text-center">{po.createdAt}</td>
                    <td className="border px-3 py-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          po.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : po.status === "Received"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelected(po)}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                        {po.status === "Pending" && (
                          <>
                            <button
                              onClick={() => approvePO(po.id)}
                              className="px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 flex items-center gap-1"
                            >
                              <CheckCircle2 size={14} /> Receive
                            </button>
                            <button
                              onClick={() => rejectPO(po.id)}
                              className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center gap-1"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-6">
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Purchase Order — <span className="text-blue-600">{selected.poNumber}</span>
              </h3>
              <div className="flex gap-2">
                {selected.status === "Pending" && (
                  <>
                    <button
                      onClick={() => approvePO(selected.id)}
                      className="px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle2 size={16} /> Receive
                    </button>
                    <button
                      onClick={() => rejectPO(selected.id)}
                      className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border px-3 py-2 text-left">Item</th>
                    <th className="border px-3 py-2 text-center">Qty</th>
                    <th className="border px-3 py-2 text-right">Price</th>
                    <th className="border px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.items.map((i) => (
                    <tr key={i.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{i.itemName}</td>
                      <td className="border px-3 py-2 text-center">{i.qty}</td>
                      <td className="border px-3 py-2 text-right">{fmt(i.price)}</td>
                      <td className="border px-3 py-2 text-right">{fmt(i.price * i.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="border px-3 py-2 text-right">
                      Total
                    </td>
                    <td className="border px-3 py-2 text-right">{fmt(total(selected))}</td>
                  </tr>
                </tfoot>
              </table>

              {selected.note && (
                <div className="mt-3 text-sm text-gray-600">
                  Note: <span className="text-gray-700">{selected.note}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POOrders;

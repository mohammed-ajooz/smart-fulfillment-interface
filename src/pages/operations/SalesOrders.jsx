import { useMemo, useState } from "react";
import { Search, Eye, CheckCircle2, XCircle, Filter } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const seedOrders = [
  {
    id: 1,
    orderNo: "SO-2025-001",
    customer: "Blue Store",
    createdAt: "2025-10-14",
    status: "Pending",
    items: [
      { id: "i1", itemName: "Wireless Mouse", poId: "PO-7781", trader: "SmartTech", qty: 2, price: 18.5 },
      { id: "i2", itemName: "Keyboard",       poId: "PO-7781", trader: "Nazo Group", qty: 1, price: 32.0 },
    ],
    note: "Awaiting CS review",
  },
  {
    id: 2,
    orderNo: "SO-2025-002",
    customer: "Modern Shop",
    createdAt: "2025-10-15",
    status: "Approved",
    items: [
      { id: "i3", itemName: "USB-C Cable",    poId: "PO-7800", trader: "CableHub",  qty: 5, price: 4.2 },
      { id: "i4", itemName: "Laptop Stand",   poId: "PO-7800", trader: "CableHub",  qty: 1, price: 25.0 },
    ],
    note: "Approved by CS — visible to merchant",
  },
  {
    id: 3,
    orderNo: "SO-2025-003",
    customer: "Alpha Market",
    createdAt: "2025-10-16",
    status: "Rejected",
    items: [
      { id: "i5", itemName: "Webcam 1080p",   poId: "PO-7811", trader: "VisionX",   qty: 1, price: 49.9 },
    ],
    note: "Missing customer details",
  },
];

const tabs = [
  { id: "Pending",  label: "Pending Review" },
  { id: "Approved", label: "Approved" },
  { id: "Rejected", label: "Rejected" },
  { id: "All",      label: "All Orders" },
];

const SalesOrders = () => {
  const [orders, setOrders] = useState(seedOrders);
  const [activeTab, setActiveTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(null); // order in modal

  const counts = useMemo(() => {
    const map = { Pending: 0, Approved: 0, Rejected: 0 };
    for (const o of orders) if (map[o.status] !== undefined) map[o.status]++;
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      // tab filter
      if (activeTab !== "All" && o.status !== activeTab) return false;
      // search filter
      const s = search.trim().toLowerCase();
      if (
        s &&
        !(
          o.orderNo.toLowerCase().includes(s) ||
          o.customer.toLowerCase().includes(s) ||
          o.items.some(
            (it) =>
              it.itemName.toLowerCase().includes(s) ||
              it.poId.toLowerCase().includes(s) ||
              it.trader.toLowerCase().includes(s)
          )
        )
      )
        return false;
      // date filter
      if (dateFrom && o.createdAt < dateFrom) return false;
      if (dateTo && o.createdAt > dateTo) return false;
      return true;
    });
  }, [orders, activeTab, search, dateFrom, dateTo]);

  const orderTotal = (o) => o.items.reduce((sum, it) => sum + it.qty * it.price, 0);

  const approveOrder = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "Approved", note: "Approved by CS — visible to merchant" } : o
      )
    );
    if (selected?.id === id) setSelected((s) => s && { ...s, status: "Approved" });
  };

  const rejectOrder = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "Rejected", note: "Rejected by CS" } : o
      )
    );
    if (selected?.id === id) setSelected((s) => s && { ...s, status: "Rejected" });
  };

  return (
    <div className="space-y-5">
      {/* Header + Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <h2 className="text-xl font-bold text-gray-800">Sales Orders</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Search size={16} className="text-gray-500" />
              <input
                className="bg-transparent outline-none ml-2 text-sm w-56"
                placeholder="Search order, customer, item, PO…"
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
                : t.id === "Approved"
                ? counts.Approved
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
                <th className="border px-3 py-2 text-left">Order No</th>
                <th className="border px-3 py-2 text-left">Customer</th>
                <th className="border px-3 py-2 text-center">Items</th>
                <th className="border px-3 py-2 text-right">Total</th>
                <th className="border px-3 py-2 text-center">Date</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 font-medium">{o.orderNo}</td>
                    <td className="border px-3 py-2">{o.customer}</td>
                    <td className="border px-3 py-2 text-center">{o.items.length}</td>
                    <td className="border px-3 py-2 text-right font-semibold">
                      {fmt(orderTotal(o))}
                    </td>
                    <td className="border px-3 py-2 text-center">{o.createdAt}</td>
                    <td className="border px-3 py-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          o.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : o.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelected(o)}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                          title="View details"
                        >
                          <Eye size={14} /> Details
                        </button>
                        {o.status === "Pending" && (
                          <>
                            <button
                              onClick={() => approveOrder(o.id)}
                              className="px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 flex items-center gap-1"
                              title="Approve"
                            >
                              <CheckCircle2 size={14} /> Approve
                            </button>
                            <button
                              onClick={() => rejectOrder(o.id)}
                              className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center gap-1"
                              title="Reject"
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
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Once approved, the order becomes visible to the merchant side automatically.
        </p>
      </div>

      {/* Modal: Order Details */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order Details — <span className="text-blue-600">{selected.orderNo}</span>
                </h3>
                <div className="flex items-center gap-2">
                  {selected.status === "Pending" && (
                    <>
                      <button
                        onClick={() => approveOrder(selected.id)}
                        className="px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                      >
                        <CheckCircle2 size={16} /> Approve
                      </button>
                      <button
                        onClick={() => rejectOrder(selected.id)}
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
              <div className="mt-1 text-sm text-gray-500">
                Customer: <b className="text-gray-700">{selected.customer}</b> • Date:{" "}
                <b className="text-gray-700">{selected.createdAt}</b> • Status:{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selected.status === "Pending"
                      ? "bg-amber-100 text-amber-700"
                      : selected.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selected.status}
                </span>
              </div>
            </div>

            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border px-3 py-2 text-left">Item Name</th>
                      
                      <th className="border px-3 py-2 text-left">Trader</th>
                      <th className="border px-3 py-2 text-center">Qty</th>
                      <th className="border px-3 py-2 text-right">Price</th>
                      <th className="border px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((it) => (
                      <tr key={it.id} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">{it.itemName}</td>
                        
                        <td className="border px-3 py-2">{it.trader}</td>
                        <td className="border px-3 py-2 text-center">{it.qty}</td>
                        <td className="border px-3 py-2 text-right">{fmt(it.price)}</td>
                        <td className="border px-3 py-2 text-right">{fmt(it.price * it.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan={5} className="border px-3 py-2 text-right">
                        Order Total
                      </td>
                      <td className="border px-3 py-2 text-right">
                        {fmt(orderTotal(selected))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {selected.note && (
                <div className="mt-3 text-sm text-gray-600">
                  Note: <span className="text-gray-700">{selected.note}</span>
                </div>
              )}
              {selected.status === "Approved" && (
                <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">
                  ✅ Approved by Customer Support — this order is now visible to the merchant.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrders;

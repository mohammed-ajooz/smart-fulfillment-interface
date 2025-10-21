import { useState } from "react";
import { Printer, Info, CheckCircle, XCircle } from "lucide-react";

const VenderOrders = () => {
  const [activeTab, setActiveTab] = useState("Pending Approval");
  const [selected, setSelected] = useState(null);

  const tabs = ["Pending Approval", "Ready for Pickup"];

  // ✅ بيانات مؤقتة — لاحقًا سيتم استبدالها من الـ API
  const [orders, setOrders] = useState({
    "Pending Approval": [
      {
        id: 1,
        poNumber: "PO-2025-001",
        orderNo: "SO-2025-101",
        customer: "Modern Shop",
        trader: "SmartTech",
        status: "Pending",
        address: "Erbil - Zone A",
        phone: "+964 750 123 4567",
        note: "Urgent delivery today",
        items: [
          { name: "Wireless Mouse", qty: 10, price: 8.5 },
          { name: "HDMI Cable 2m", qty: 5, price: 3.2 },
        ],
      },
      {
        id: 2,
        poNumber: "PO-2025-002",
        orderNo: "SO-2025-102",
        customer: "Iraq Store",
        trader: "TechLine",
        status: "Pending",
        address: "Duhok - Warehouse 2",
        phone: "+964 751 222 3333",
        note: "",
        items: [
          { name: "Mechanical Keyboard", qty: 6, price: 22.3 },
          { name: "Mouse Pad XL", qty: 2, price: 5.5 },
        ],
      },
    ],
    "Ready for Pickup": [
      {
        id: 3,
        poNumber: "PO-2025-010",
        orderNo: "SO-2025-200",
        customer: "Elite Electronics",
        trader: "SmartTech",
        status: "Approved",
        address: "Sulaymaniyah - Zone B",
        phone: "+964 750 555 6666",
        note: "Customer pickup tomorrow",
        items: [
          { name: "USB-C Charger 65W", qty: 10, price: 15.0 },
        ],
      },
    ],
  });

  // ✅ الموافقة على الطلب
  const handleApprove = (id) => {
    const pendingList = [...orders["Pending Approval"]];
    const approvedOrder = pendingList.find((o) => o.id === id);
    if (!approvedOrder) return;

    approvedOrder.status = "Approved";
    setOrders({
      ...orders,
      "Pending Approval": pendingList.filter((o) => o.id !== id),
      "Ready for Pickup": [...orders["Ready for Pickup"], approvedOrder],
    });

    alert(`✅ Order ${approvedOrder.poNumber} approved.`);
  };

  // ❌ رفض الطلب
  const handleReject = (id) => {
    const pendingList = [...orders["Pending Approval"]];
    const rejectedOrder = pendingList.find((o) => o.id === id);
    if (!rejectedOrder) return;

    setOrders({
      ...orders,
      "Pending Approval": pendingList.filter((o) => o.id !== id),
    });

    alert(`❌ Order ${rejectedOrder.poNumber} rejected.`);
  };

  // 🖨️ طباعة الطلب الحرارية 10×15
  const handlePrintLabel = (order) => {
    const total = order.items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${order.poNumber}</title>
  <style>
    @page { size: 10cm 15cm; margin: 0; }
    html, body {
      width: 10cm; height: 15cm; margin: 0; padding: 0;
      font-family: Arial, sans-serif; color: #111;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .wrap { box-sizing: border-box; width: 10cm; height: 15cm; padding: 10px; }
    .title { text-align: center; color: #2563eb; font-weight: bold; font-size: 14px; margin-bottom: 2px; }
    .subtitle { text-align: center; color: #666; font-size: 11px; margin-bottom: 6px; }
    .row { font-size: 12px; margin: 2px 0; }
    .items { margin-top: 6px; font-size: 11px; border-collapse: collapse; width: 100%; }
    .items th, .items td { border: 1px solid #ccc; padding: 3px; }
    .footer { text-align: center; font-size: 10px; color: #999; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h3 class="title">SmartLogix ERP</h3>
    <div class="subtitle">Vendor Order Slip</div>
    <hr />
    <div class="row"><b>PO:</b> ${order.poNumber}</div>
    <div class="row"><b>Order:</b> ${order.orderNo}</div>
    <div class="row"><b>Customer:</b> ${order.customer}</div>
    <div class="row"><b>Trader:</b> ${order.trader}</div>

    <table class="items">
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>
        ${order.items
          .map(
            (i) =>
              `<tr><td>${i.name}</td><td>${i.qty}</td><td>$${i.price.toFixed(
                2
              )}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>

    <div class="row"><b>Total:</b> $${total.toFixed(2)}</div>
    <div class="row"><b>Address:</b> ${order.address}</div>
    <div class="row"><b>Phone:</b> ${order.phone}</div>
    ${order.note ? `<div class="row"><b>Note:</b> ${order.note}</div>` : ""}
    <div id="barcode" style="text-align:center;margin-top:10px;"></div>
    <div class="footer">© 2025 SmartLogix</div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
  <script>
    const svg = document.createElement("svg");
    document.getElementById("barcode").appendChild(svg);
    JsBarcode(svg, "${order.poNumber}", {
      format: "CODE128",
      width: 1.6, height: 45,
      lineColor: "#1e3a8a",
      displayValue: true,
      fontSize: 12,
    });
    setTimeout(()=>window.print(),200);
  </script>
</body>
</html>`;
    const w = window.open("", "_blank", "width=600,height=900");
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="p-6">
      {/* العنوان */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Vendor Orders</h2>
        <span className="text-sm text-gray-500">
          Showing {orders[activeTab].length} orders
        </span>
      </div>

      {/* التبويبات */}
      <div className="flex gap-3 border-b mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* الجدول */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">PO</th>
              <th className="border px-3 py-2 text-left">Trader</th>
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2 text-center">Items</th>
              <th className="border px-3 py-2 text-center">Status</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders[activeTab].map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{order.poNumber}</td>
                <td className="border px-3 py-2">{order.trader}</td>
                <td className="border px-3 py-2">{order.customer}</td>
                <td className="border px-3 py-2 text-center">
                  {order.items.length}
                </td>
                <td className="border px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border px-3 py-2 text-center">
                  {activeTab === "Pending Approval" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelected(order)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1 mx-auto"
                    >
                      <Info size={14} /> Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة التفاصيل */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl border w-[450px]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                {selected.poNumber} — Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>

            <div className="p-4 text-sm text-gray-700 space-y-2">
              <p><b>Customer:</b> {selected.customer}</p>
              <p><b>Trader:</b> {selected.trader}</p>
              <p><b>Phone:</b> {selected.phone}</p>
              <p><b>Address:</b> {selected.address}</p>
              <p><b>Note:</b> {selected.note || "-"}</p>

              <h4 className="font-semibold mt-3 mb-1 text-gray-800">Items:</h4>
              <table className="w-full text-xs border border-gray-200">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="border px-2 py-1 text-left">Item</th>
                    <th className="border px-2 py-1 text-center">Qty</th>
                    <th className="border px-2 py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{item.name}</td>
                      <td className="border px-2 py-1 text-center">{item.qty}</td>
                      <td className="border px-2 py-1 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right mt-2 font-semibold">
                Total: $
                {selected.items
                  .reduce((sum, i) => sum + i.qty * i.price, 0)
                  .toFixed(2)}
              </div>
            </div>

            <div className="border-t p-3 flex justify-center">
              <button
                onClick={() => handlePrintLabel(selected)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Printer size={16} /> Print 10×15
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenderOrders;

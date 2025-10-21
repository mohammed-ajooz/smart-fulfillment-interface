import React from "react";
import Barcode from "react-barcode";

const PrintSlip = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  const fmt = (n) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(n);

  return (
    <div
      ref={ref}
      style={{
        width: "10cm",
        height: "15cm",
        margin: "0 auto",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        color: "#111",
        border: "1px solid #ddd",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <h2 style={{ margin: "0", color: "#2563eb", fontSize: "14px" }}>
          SmartLogix ERP
        </h2>
        <small style={{ color: "#666" }}>Vendor Order Slip</small>
      </div>

      <hr style={{ borderColor: "#ddd", margin: "4px 0" }} />

      <div style={{ lineHeight: "1.5" }}>
        <p><b>PO:</b> {order.poNumber}</p>
        <p><b>Order:</b> {order.orderNo}</p>
        <p><b>Customer:</b> {order.customer}</p>
        <p><b>Trader:</b> {order.trader}</p>
        <p><b>Item:</b> {order.itemName}</p>
        <p><b>Qty:</b> {order.qty}</p>
        <p><b>Total:</b> {fmt(order.qty * order.price)}</p>
      </div>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <Barcode
          value={order.poNumber}
          width={1.5}
          height={40}
          displayValue={true}
          fontSize={11}
          lineColor="#1e3a8a"
        />
      </div>

      <p
        style={{
          fontSize: "10px",
          textAlign: "center",
          marginTop: "6px",
          color: "#666",
        }}
      >
        © 2025 SmartLogix — Auto Generated
      </p>
    </div>
  );
});

export default PrintSlip;

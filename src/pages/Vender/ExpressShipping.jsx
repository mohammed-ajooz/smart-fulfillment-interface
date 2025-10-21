import { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Send, PlusCircle, Trash2 } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#e9ecef" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6c757d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f8f9fa" }] },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#dee2e6" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#adb5bd" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#495057" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#74c0fc" }],
  },
];

const ExpressShipping = () => {
  const [vendorLocation, setVendorLocation] = useState({ lat: 36.1911, lng: 43.993 }); // موقع المحل
  const [customerLocation, setCustomerLocation] = useState({ lat: 36.206, lng: 44.008 }); // الموقع الافتراضي للزبون
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(0);
  const mapRef = useRef();

  const [items, setItems] = useState([{ id: 1, name: "", qty: 1, price: 0 }]);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [submitted, setSubmitted] = useState(false);

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: vendorLocation,
        destination: customerLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          const distanceValue = result.routes[0].legs[0].distance.text;
          setDistance(distanceValue);
        }
      }
    );
  };

  const addItem = () => setItems([...items, { id: Date.now(), name: "", qty: 1, price: 0 }]);
  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));
  const updateItem = (id, field, value) =>
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const totalItems = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRoute();
    setSubmitted(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🚀 Express Shipping
      </h2>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-2xl shadow border border-gray-100"
        >
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Customer Address"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              className="md:col-span-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Map */}
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                📍 Select Vendor & Destination
              </h3>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={vendorLocation}
                zoom={13}
                options={{
                  styles: mapStyle,
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
                onLoad={(map) => (mapRef.current = map)}
              >
                {/* Vendor Marker */}
                <Marker
                  position={vendorLocation}
                  draggable
                  onDragEnd={(e) =>
                    setVendorLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                  }
                  label={{
                    text: "🏬",
                    fontSize: "22px",
                  }}
                />

                {/* Customer Marker */}
                <Marker
                  position={customerLocation}
                  draggable
                  onDragEnd={(e) =>
                    setCustomerLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                  }
                  label={{
                    text: "📍",
                    fontSize: "22px",
                  }}
                />

                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      polylineOptions: {
                        strokeColor: "#007bff",
                        strokeWeight: 5,
                        strokeOpacity: 0.8,
                      },
                      suppressMarkers: true,
                    }}
                  />
                )}
              </GoogleMap>
            </div>
          </LoadScript>

          <div className="text-right">
            <button
              type="submit"
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Send size={18} className="inline-block mr-1" />
              Show Route & Calculate Distance
            </button>
          </div>

          {/* Items Table */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex justify-between">
              Items to Ship
              <button
                type="button"
                onClick={addItem}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <PlusCircle size={18} /> Add
              </button>
            </h3>
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-3 py-2">Item Name</th>
                  <th className="border px-3 py-2">Qty</th>
                  <th className="border px-3 py-2">Price</th>
                  <th className="border px-3 py-2">Total</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        placeholder="Item name"
                        className="border rounded px-2 py-1 w-full outline-none"
                      />
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(item.id, "qty", Number(e.target.value))
                        }
                        min="1"
                        className="border rounded px-2 py-1 w-16 text-center"
                      />
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(item.id, "price", Number(e.target.value))
                        }
                        min="0"
                        className="border rounded px-2 py-1 w-20 text-center"
                      />
                    </td>
                    <td className="border px-3 py-2 text-center font-semibold">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <div className="text-gray-700 text-sm">
                Distance: <strong>{distance}</strong>
              </div>
              <div className="font-semibold text-blue-700 text-lg">
                Total: ${totalItems.toFixed(2)}
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-green-50 p-6 rounded-lg text-center shadow">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            ✅ Route Generated Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            You can now proceed with the pickup process.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpressShipping;

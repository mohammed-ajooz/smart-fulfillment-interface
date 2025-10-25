import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    console.log("Login button clicked ✅");

    try {
      // 🧩 إرسال بيانات تسجيل الدخول
      const res = await axiosInstance.post("/auth/login", {
        email, // استخدم username لو السيرفر يعتمد عليه
        password,
      });

      console.log("Response:", res.data);

      // 🧠 السيرفر يرجع access_token وليس accessToken
      const { access_token: accessToken, user } = res.data;

      if (!accessToken || !user) {
        setError("Invalid response from server.");
        return;
      }

      // 💾 حفظ البيانات في localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Login successful for:", user.role);

      // 🚀 توجيه المستخدم حسب دوره
      switch (user.role) {
        case "ADMIN":
          navigate("/dashboard");
          break;
        case "VENDOR":
          navigate("/vendor");
          break;
        case "FINANCE":
          navigate("/finance");
          break;
        case "STAFF":
          navigate("/staff");
          break;
        case "DRIVER":
          navigate("/driver");
          break;
        case "CUSTOMER":
          navigate("/customer");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(err.response.data?.message || "Invalid credentials.");
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Unexpected error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96 transform transition hover:scale-[1.02] duration-300">
        <div className="text-center mb-6">
          <img
            src="/logo192.png"
            alt="SmartLogix Logo"
            className="w-16 h-16 mx-auto mb-3"
          />
          <h2 className="text-2xl font-bold text-gray-800">SmartLogix Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Login to your account</p>
        </div>

        <div>
          {/* 🔹 حقل البريد أو اسم المستخدم */}
          <input
            type="text"
            placeholder="Email or Username"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🔹 كلمة المرور */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 🔹 عرض رسالة الخطأ */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          {/* 🔹 زر الدخول */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} SmartLogix. All rights reserved.
        </p>
      </div>
    </div>
  );
}

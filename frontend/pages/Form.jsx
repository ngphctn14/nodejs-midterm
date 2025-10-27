import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general-feedback",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gửi phản hồi thất bại");

      setSuccess("Phản hồi của bạn đã được gửi thành công!");
      setFormData({
        name: "",
        email: "",
        category: "general-feedback",
        message: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-8 border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          💬 Gửi phản hồi của bạn
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Họ và tên */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="ví dụ: tenban@gmail.com"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Danh mục
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition bg-white"
            >
              <option value="general-feedback">Phản hồi chung</option>
              <option value="bug-report">Báo lỗi</option>
              <option value="feature-request">Đề xuất tính năng</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Nhập nội dung phản hồi của bạn..."
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition"
            ></textarea>
          </div>

          {/* Nút gửi */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-60"
          >
            {loading ? "Đang gửi..." : <><Send size={18} /> Gửi phản hồi</>}
          </motion.button>

          {/* Thông báo trạng thái */}
          {success && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-green-600 text-center mt-3 font-medium"
            >
              <CheckCircle2 size={18} /> {success}
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-red-600 text-center mt-3 font-medium"
            >
              <AlertCircle size={18} /> {error}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default Form;

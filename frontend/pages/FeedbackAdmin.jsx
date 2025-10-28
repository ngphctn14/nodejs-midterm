import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../components/AdminLayout";
import FeedbackTable from "../components/FeedbackTable";

const PAGE_SIZE = 50; // number of rows per page

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [runTime, setRunTime] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const categoryLabels = {
    "bug-report": "Báo lỗi",
    "feature-request": "Yêu cầu tính năng",
    "general-feedback": "Phản hồi chung",
    "other": "Khác",
  };

  const statusLabels = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Bị từ chối",
  };

  const fetchFeedbacks = async (category = "Tất cả", status = "Tất cả") => {
    const start = performance.now();
    setLoading(true);

    try {
      let url = "http://localhost:5000/api/feedback";

      if (category !== "Tất cả" && status === "Tất cả") {
        url = `http://localhost:5000/api/feedback/category/${category}`;
      } else if (status !== "Tất cả" && category === "Tất cả") {
        url = `http://localhost:5000/api/feedback/status/${status}`;
      } else if (status !== "Tất cả" && category !== "Tất cả") {
        const [catRes, statRes] = await Promise.all([
          fetch(`http://localhost:5000/api/feedback/category/${category}`),
          fetch(`http://localhost:5000/api/feedback/status/${status}`),
        ]);

        const [catData, statData] = await Promise.all([catRes.json(), statRes.json()]);
        const intersection = catData.filter((c) => statData.some((s) => s.id === c.id));

        setFeedbacks(intersection);
        setCurrentPage(1);

        const end = performance.now();
        setRunTime((end - start).toFixed(1));
        setLoading(false);
        return;
      }

      const res = await fetch(url);
      const data = await res.json();
      setFeedbacks(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phản hồi:", error);
    } finally {
      const end = performance.now();
      setRunTime((end - start).toFixed(1));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(categoryFilter, statusFilter);
  }, [categoryFilter, statusFilter]);

  const categories = useMemo(
    () => ["Tất cả", "bug-report", "feature-request", "general-feedback", "other"],
    []
  );

  const statuses = useMemo(() => ["Tất cả", "pending", "approved", "rejected"], []);

  const handleEdit = (updatedFeedback) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === updatedFeedback.id ? updatedFeedback : fb))
    );
  };

  const handleDelete = (id) => {
    setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
  };

  // Pagination
  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
  const paginatedFeedbacks = feedbacks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Feedback</h1>
          <p className="text-gray-600 mt-1">Xem và lọc phản hồi từ người dùng.</p>
        </div>

        {runTime && (
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
            ⏱️ Thời gian tải: <span className="font-semibold">{runTime} ms</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex justify-end gap-3 mb-5 items-center">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "Tất cả" ? cat : categoryLabels[cat] || cat}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          {statuses.map((st) => (
            <option key={st} value={st}>
              {st === "Tất cả" ? st : statusLabels[st] || st}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Scrollable table */}
          <div className="overflow-x-auto">
            <FeedbackTable
              feedbacks={paginatedFeedbacks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-4 gap-2">
              {/* Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 transition"
              >
                {"<"}
              </button>

              {/* Dynamic 3 page buttons */}
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (currentPage === 1) pageNum = i + 1;
                else if (currentPage === totalPages) pageNum = totalPages - 2 + i;
                else pageNum = currentPage - 1 + i;

                if (pageNum < 1 || pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border rounded-lg transition ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Jump to page */}
              <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= totalPages) handlePageChange(val);
                  }}
                  className="w-16 px-2 py-1 text-center outline-none"
                  placeholder="Page"
                />
                <span className="px-2 bg-gray-100 text-gray-600 border-l">{`/ ${totalPages}`}</span>
              </div>

              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 transition"
              >
                {">"}
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminFeedbackPage;

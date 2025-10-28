import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import FeedbackTable from '../components/FeedbackTable';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/feedback');
        const data = await res.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách phản hồi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleEdit = (updatedFeedback) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === updatedFeedback.id ? updatedFeedback : fb))
    );
  };

  const handleDelete = (id) => {
    setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Feedback</h1>
        <p className="text-gray-600 mt-1">Xem, chỉnh sửa và xóa phản hồi từ người dùng.</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <FeedbackTable
          feedbacks={feedbacks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </AdminLayout>
  );
};

export default AdminFeedbackPage;

import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import FeedbackTable from '../components/FeedbackTable'; 

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      message: 'Dịch vụ rất tốt, nhân viên nhiệt tình!',
      rating: 5,
      status: 'approved',
      createdAt: '2025-10-18T10:30:00Z',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      message: 'Giao diện đẹp nhưng tốc độ load hơi chậm.',
      rating: 3,
      status: 'pending',
      createdAt: '2025-10-19T14:20:00Z',
    },
  ]);

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
      <FeedbackTable
        feedbacks={feedbacks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  );
};

export default AdminFeedbackPage;
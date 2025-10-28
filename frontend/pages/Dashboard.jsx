import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Header from "../components/Dashboard/Header";
import StatsCard from "../components/Dashboard/StatsCard";
import TrendChart from "../components/Dashboard/TrendChart";
import StatusPieChart from "../components/Dashboard/StatusPieChart";
import { MessageSquare, TrendingUp, Clock } from "lucide-react";

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧮 Stats derived from feedback data
  const stats = {
    totalFeedbacks: feedbacks.length,
    newToday: feedbacks.filter((fb) => {
      const today = new Date();
      const createdAt = new Date(fb.createdAt);
      return (
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      );
    }).length,
    pendingFeedbacks: feedbacks.filter((fb) => fb.status === "pending").length,
    approvedFeedbacks: feedbacks.filter((fb) => fb.status === "approved").length,
    rejectedFeedbacks: feedbacks.filter((fb) => fb.status === "rejected").length,
  };

  // 📈 Generate trend data (feedbacks per day for last 7 days)
  const trendData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const label = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    const count = feedbacks.filter((fb) => {
      const createdAt = new Date(fb.createdAt);
      return (
        createdAt.getDate() === date.getDate() &&
        createdAt.getMonth() === date.getMonth() &&
        createdAt.getFullYear() === date.getFullYear()
      );
    }).length;
    return { date: label, count };
  });

  const statusData = [
    { name: "Đã duyệt", value: stats.approvedFeedbacks, color: "#10b981" },
    { name: "Chờ duyệt", value: stats.pendingFeedbacks, color: "#f59e0b" },
    { name: "Bị từ chối", value: stats.rejectedFeedbacks, color: "#ef4444" },
  ];

  // 🚀 Fetch data from backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/feedback");
        if (!res.ok) throw new Error("Failed to fetch feedback data");
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          Đang tải dữ liệu...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Header />

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Tổng Feedback"
          value={stats.totalFeedbacks}
          icon={MessageSquare}
          bgColor="bg-blue-100"
        />
        <StatsCard
          title="Mới hôm nay"
          value={`+${stats.newToday}`}
          icon={TrendingUp}
          bgColor="bg-green-100"
        />
        <StatsCard
          title="Chờ duyệt"
          value={stats.pendingFeedbacks}
          icon={Clock}
          bgColor="bg-orange-100"
          color="text-orange-600"
        />
      </div>

      {/* 📈 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrendChart data={trendData} />
        <StatusPieChart data={statusData} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import Header from '../components/Dashboard/Header';
import StatsCard from '../components/Dashboard/StatsCard';
import TrendChart from '../components/Dashboard/TrendChart';
import StatusPieChart from '../components/Dashboard/StatusPieChart';
import { MessageSquare, Star, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = {
    totalFeedbacks: 142,
    avgRating: 4.3,
    newToday: 7,
    pendingFeedbacks: 18,
    approvedFeedbacks: 108,
    rejectedFeedbacks: 16,
  };

  const trendData = [
    { date: '14/10', count: 12 },
    { date: '15/10', count: 19 },
    { date: '16/10', count: 15 },
    { date: '17/10', count: 22 },
    { date: '18/10', count: 18 },
    { date: '19/10', count: 25 },
    { date: '20/10', count: 7 },
  ];

  const statusData = [
    { name: 'Đã duyệt', value: stats.approvedFeedbacks, color: '#10b981' },
    { name: 'Chờ duyệt', value: stats.pendingFeedbacks, color: '#f59e0b' },
    { name: 'Bị từ chối', value: stats.rejectedFeedbacks, color: '#ef4444' },
  ];


  return (
    <AdminLayout>
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Tổng Feedback" value={stats.totalFeedbacks} icon={MessageSquare} bgColor="bg-blue-100" />
        <StatsCard title="Đánh giá TB" value={`${stats.avgRating}/5`} icon={Star} bgColor="bg-yellow-100" color="text-yellow-600" />
        <StatsCard title="Mới hôm nay" value={`+${stats.newToday}`} icon={TrendingUp} bgColor="bg-green-100" />
        <StatsCard title="Chờ duyệt" value={stats.pendingFeedbacks} icon={Clock} bgColor="bg-orange-100" color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrendChart data={trendData} />
        <StatusPieChart data={statusData} />
      </div>

    </AdminLayout>
  );
};

export default Dashboard;
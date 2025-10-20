// components/admin/dashboard/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color || 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 ${bgColor || 'bg-blue-100'} rounded-full`}>
          <Icon className={`w-6 h-6 ${color?.includes('text-') ? color.replace('text-', 'text-') : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

import React from 'react';
import { ArrowUp, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, changeType, description }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-blue-100 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center text-sm mt-2">
          {change && (
            <span className={`flex items-center mr-2 font-semibold ${changeColor}`}>
              <ArrowUp className={`w-4 h-4 ${changeType === 'decrease' ? 'transform rotate-180' : ''}`} />
              {change}
            </span>
          )}
          <span className="text-gray-500">{description}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

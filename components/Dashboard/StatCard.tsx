
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
    <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[--text-muted]">{title}</h3>
        <div className="p-2 bg-brand-100 rounded-full">
          <Icon className="w-6 h-6 text-[--brand-400]" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-[--text-main]">{value}</p>
        <div className="flex items-center text-sm mt-2">
          {change && (
            <span className={`flex items-center mr-2 font-semibold ${changeColor}`}>
              <ArrowUp className={`w-4 h-4 ${changeType === 'decrease' ? 'transform rotate-180' : ''}`} />
              {change}
            </span>
          )}
          <span className="text-[--text-muted]">{description}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
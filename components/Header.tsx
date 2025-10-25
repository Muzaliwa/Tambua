import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-sm border-b border-black/5">
      <div>
        {/* Can add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center">
        <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[--brand-400]">
          <Bell className="w-6 h-6 text-[--text-muted]" />
        </button>
        <button onClick={logout} className="relative ml-4 flex items-center cursor-pointer group p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[--brand-400]">
            <div className="w-10 h-10 bg-[--brand-400] rounded-full flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0).toUpperCase()}{user?.name.split(' ')[1]?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 hidden md:block text-left">
              <p className="text-sm font-medium text-[--text-main]">{user?.name}</p>
              <p className="text-xs text-[--text-muted]">{user?.role}</p>
            </div>
            <LogOut className="ml-4 w-5 h-5 text-[--text-muted] group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Header;
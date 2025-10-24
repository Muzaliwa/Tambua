
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
      <div>
        {/* Can add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center">
        <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Bell className="w-6 h-6 text-gray-600" />
        </button>
        <div className="relative ml-4">
          <div className="flex items-center cursor-pointer group">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0).toUpperCase()}{user?.name.split(' ')[1]?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <ChevronDown className="ml-1 w-5 h-5 text-gray-500" />
          </div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
            <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
            <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

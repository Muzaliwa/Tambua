import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, CircleAlert, FileText, Settings, Printer, Bike } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const adminNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/vehicles', icon: Car, label: 'Voitures' },
    { to: '/motorcycles', icon: Bike, label: 'Motos' },
    { to: '/fines', icon: CircleAlert, label: 'Amendes' },
    { to: '/infractions', icon: FileText, label: 'Infractions' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  const agentNavItems = [
    { to: '/agent-dashboard', icon: LayoutDashboard, label: 'Accueil Agent' },
    { to: '/printing', icon: Printer, label: 'Impression' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  const navItems = user?.role === 'Superviseur' ? adminNavItems : agentNavItems;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white text-gray-700 shadow-md">
      <div className="flex items-center justify-center h-20 border-b">
        <div className="text-2xl font-bold text-blue-600">
          <span className="bg-blue-600 text-white rounded-md px-2 py-1 text-3xl">T</span>
          ambua
        </div>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-4">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
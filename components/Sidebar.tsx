import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Car,
  Bike,
  CircleDollarSign,
  AlertTriangle,
  Users,
  FileText,
  Settings,
  Printer,
} from 'lucide-react';

const Logo = () => (
    <div className="flex items-center justify-center h-20 px-4 border-b border-black/5">
        <img src="/assets/logo.svg" alt="Tambua Logo" className="h-10" />
    </div>
);

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  // Exact match for dashboard, startsWith for others
  const isActive = to.endsWith('dashboard') ? location.pathname === to : location.pathname.startsWith(to);
  
  return (
    <li>
      <NavLink
        to={to}
        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-lg
          ${isActive 
            ? 'bg-gradient-to-r from-[--brand-400] to-[--brand-600] text-white shadow-md' 
            : 'text-[--text-muted] hover:bg-black/5'
          }`
        }
      >
        <Icon className="w-5 h-5 mr-3" />
        <span>{children}</span>
      </NavLink>
    </li>
  );
};

const Sidebar: React.FC = () => {
    const { user } = useAuth();

    const supervisorLinks = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/vehicles', icon: Car, label: 'Véhicules' },
        { to: '/motorcycles', icon: Bike, label: 'Motos' },
        { to: '/fines', icon: CircleDollarSign, label: 'Amendes' },
        { to: '/infractions', icon: AlertTriangle, label: 'Infractions' },
        { to: '/agents', icon: Users, label: 'Agents' },
        { to: '/reports', icon: FileText, label: 'Rapports' },
    ];

    const agentLinks = [
        { to: '/agent-dashboard', icon: LayoutDashboard, label: 'Portail Agent' },
        { to: '/printing', icon: Printer, label: 'Impression' },
    ];

    const links = user?.role === 'Superviseur' ? supervisorLinks : agentLinks;

    return (
        <aside className="w-64 flex-shrink-0 bg-white/70 backdrop-blur-xl border-r border-black/5 flex flex-col">
            <Logo />
            <nav className="flex-1 px-4 py-6 space-y-2">
                <ul>
                    {links.map((link) => (
                        <NavItem key={link.to} to={link.to} icon={link.icon}>
                            {link.label}
                        </NavItem>
                    ))}
                </ul>
            </nav>
            <div className="px-4 py-4 border-t border-black/5">
                 <NavItem to="/settings" icon={Settings}>
                    Paramètres
                </NavItem>
            </div>
        </aside>
    );
};

export default Sidebar;
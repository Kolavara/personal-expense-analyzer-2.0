import React from 'react';
import { 
  BarChart3, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Home, 
  Lock, 
  PieChart, 
  TrendingUp,
  Calendar
} from 'lucide-react';

type ActiveView = 'overview' | 'transactions' | 'budgets' | 'analytics' | 'cards' | 'debt' | 'passwords';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'debt', label: 'Debt', icon: TrendingUp },
    { id: 'passwords', label: 'Passwords', icon: Lock },
  ];

  return (
    <div className="w-64 h-screen aeos-glass border-r border-white/10 p-6 fixed left-0 top-0 z-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          AEOS
        </h1>
        <p className="text-white/60 text-sm mt-1 font-mono">Finance</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-transparent mt-2"></div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-left group ${
                isActive
                  ? 'bg-white/10 text-white border border-blue-400/50'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="igloo-card p-4 rounded-xl text-center border border-emerald-400/20">
          <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-emerald-400/20 flex items-center justify-center">
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <p className="text-xs text-emerald-400/60 font-medium">Igloo Finance v2.0</p>
          <p className="text-xs text-emerald-400/40">Secure • Modern • Intuitive</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
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
    <div className="w-64 h-screen matrix-card border-r-2 border-green-400/30 p-4 fixed left-0 top-0 z-20">
      <div className="mb-8">
        <h1 className="text-xl font-bold matrix-glow gradient-text typing-animation">
          Financial Management
        </h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                isActive
                  ? 'bg-green-400/20 text-green-400 matrix-border pulse-glow'
                  : 'text-green-400/70 hover:bg-green-400/10 hover:text-green-400 hover-glow'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="matrix-card p-3 rounded-lg text-center">
          <p className="text-xs text-green-400/60">Matrix Finance v2.0</p>
          <p className="text-xs text-green-400/40">Secure • Encrypted • Anonymous</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
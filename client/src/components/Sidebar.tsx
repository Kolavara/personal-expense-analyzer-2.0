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
    <div className="w-64 h-screen aeos-glass border-r border-cyan-400/20 p-6 fixed left-0 top-0 z-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 tracking-tight" style={{
          textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)'
        }}>
          AEOS
        </h1>
        <p className="text-cyan-300/80 text-sm mt-1 font-mono">Finance</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent mt-2" style={{
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
        }}></div>
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
                  ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/50'
                  : 'text-cyan-300/70 hover:bg-cyan-400/5 hover:text-cyan-400'
              }`}
              style={isActive ? {
                textShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)'
              } : {}}
            >
              <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="aeos-glass p-4 rounded-lg text-center border border-cyan-400/20">
          <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-cyan-400/10 flex items-center justify-center" style={{
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)'
          }}>
            <DollarSign size={16} className="text-cyan-400" />
          </div>
          <p className="text-xs text-cyan-300/80 font-medium font-mono">AEOS v2.0</p>
          <p className="text-xs text-cyan-400/60">Secure • Modern • Intuitive</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Analytics from './components/Analytics';
import Cards from './components/Cards';
import Debt from './components/Debt';
import Passwords from './components/Passwords';
import { ExpenseProvider } from './context/ExpenseContext';

type ActiveView = 'overview' | 'transactions' | 'budgets' | 'analytics' | 'cards' | 'debt' | 'passwords';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'budgets':
        return <Budgets />;
      case 'analytics':
        return <Analytics />;
      case 'cards':
        return <Cards />;
      case 'debt':
        return <Debt />;
      case 'passwords':
        return <Passwords />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ExpenseProvider>
      <div className={`min-h-screen transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Subtle background pattern */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="flex relative z-10">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;
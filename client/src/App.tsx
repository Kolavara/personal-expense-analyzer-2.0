import React, { useState, useEffect } from 'react';
import MatrixBackground from './components/MatrixBackground';
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
      <div className={`min-h-screen bg-gray-900 text-green-400 transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <MatrixBackground />
        <div className="flex">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1 p-6 relative z-10">
            {renderContent()}
          </main>
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;
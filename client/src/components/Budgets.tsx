import React, { useState, useContext } from 'react';
import { Plus, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';

interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

const Budgets: React.FC = () => {
  const { expenses, categories, selectedCountry } = useContext(ExpenseContext);
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food & Dining', limit: 500, period: 'monthly' },
    { id: '2', category: 'Transportation', limit: 200, period: 'monthly' },
    { id: '3', category: 'Entertainment', limit: 150, period: 'monthly' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const formatCurrency = (amount: number) => {
    return `${selectedCountry.currency.symbol}${amount.toFixed(2)}`;
  };

  const getCurrentPeriodExpenses = (category: string, period: string) => {
    const now = new Date();
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        if (period === 'monthly') {
          return expense.category === category &&
                 expenseDate.getMonth() === now.getMonth() &&
                 expenseDate.getFullYear() === now.getFullYear();
        }
        return expense.category === category;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'over', color: 'text-red-400', bgColor: 'bg-red-400' };
    if (percentage >= 80) return { status: 'warning', color: 'text-yellow-400', bgColor: 'bg-yellow-400' };
    return { status: 'good', color: 'text-cyan-400', bgColor: 'bg-cyan-400' };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-tight" style={{
          textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)'
        }}>
          Budget Management
        </h1>
        <p className="text-cyan-300/80 text-lg">
          Set limits and track your spending goals
        </p>
      </div>

      {/* Add Budget Button */}
      <div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="aeos-button-primary px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <div className="aeos-card aeos-interactive p-6">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>Create New Budget</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all">
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Budget Amount"
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
            />
            <select className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all">
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex space-x-4 mt-4">
            <button className="aeos-button-primary px-6 py-2 rounded-lg">
              Create Budget
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="aeos-button px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {budgets.map(budget => {
          const spent = getCurrentPeriodExpenses(budget.category, budget.period);
          const remaining = budget.limit - spent;
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          const status = getBudgetStatus(spent, budget.limit);

          return (
            <div key={budget.id} className="aeos-card aeos-interactive aeos-parallax p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cyan-400" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'}}>{budget.category}</h3>
                <div className="flex items-center space-x-2">
                  {status.status === 'over' && <AlertTriangle className="text-red-400" size={20} />}
                  {status.status === 'warning' && <TrendingUp className="text-yellow-400" size={20} />}
                  {status.status === 'good' && <Target className="text-cyan-400" size={20} />}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-cyan-400/70">Progress</span>
                  <span className={`text-sm font-semibold ${status.color}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${status.bgColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">Spent:</span>
                  <span className="font-semibold text-cyan-400" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'}}>{formatCurrency(spent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">Budget:</span>
                  <span className="font-semibold text-cyan-400">{formatCurrency(budget.limit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">Remaining:</span>
                  <span className={`font-semibold ${remaining >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                    {formatCurrency(remaining)}
                  </span>
                </div>
                <div className="text-xs text-cyan-400/50 capitalize pt-2 border-t border-cyan-400/20">
                  {budget.period} Budget
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Overview */}
      <div className="aeos-card aeos-interactive p-6">
        <h3 className="text-xl font-semibold text-cyan-400 mb-6" style={{textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'}}>Budget Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>
              {budgets.length}
            </p>
            <p className="text-cyan-400/70">Active Budgets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {formatCurrency(budgets.reduce((sum, budget) => sum + budget.limit, 0))}
            </p>
            <p className="text-cyan-400/70">Total Budget</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {formatCurrency(budgets.reduce((sum, budget) => sum + getCurrentPeriodExpenses(budget.category, budget.period), 0))}
            </p>
            <p className="text-cyan-400/70">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {formatCurrency(budgets.reduce((sum, budget) => sum + (budget.limit - getCurrentPeriodExpenses(budget.category, budget.period)), 0))}
            </p>
            <p className="text-cyan-400/70">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
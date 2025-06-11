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
  const { expenses, categories } = useContext(ExpenseContext);
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food & Dining', limit: 500, period: 'monthly' },
    { id: '2', category: 'Transportation', limit: 200, period: 'monthly' },
    { id: '3', category: 'Entertainment', limit: 150, period: 'monthly' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

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
    return { status: 'good', color: 'text-green-400', bgColor: 'bg-green-400' };
  };

  return (
    <div className="p-6 ml-64">
      <div className="mb-8">
        <h1 className="text-4xl font-bold matrix-glow mb-2 typing-animation">
          Budget Management
        </h1>
        <p className="text-green-400/70 text-lg">
          Set limits and track your spending goals
        </p>
      </div>

      {/* Add Budget Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="matrix-button px-6 py-3 rounded-lg hover-glow flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <div className="matrix-card p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold matrix-glow mb-4">Create New Budget</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="p-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50">
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Budget Amount"
              className="p-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
            />
            <select className="p-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50">
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex space-x-4 mt-4">
            <button className="matrix-button px-6 py-2 rounded-lg hover-glow">
              Create Budget
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
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
            <div key={budget.id} className="matrix-card p-6 rounded-lg hover-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-400">{budget.category}</h3>
                <div className="flex items-center space-x-2">
                  {status.status === 'over' && <AlertTriangle className="text-red-400" size={20} />}
                  {status.status === 'warning' && <TrendingUp className="text-yellow-400" size={20} />}
                  {status.status === 'good' && <Target className="text-green-400" size={20} />}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-green-400/70">Progress</span>
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
                  <span className="text-green-400/70">Spent:</span>
                  <span className="font-semibold matrix-glow">${spent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400/70">Budget:</span>
                  <span className="font-semibold text-green-400">${budget.limit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400/70">Remaining:</span>
                  <span className={`font-semibold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${remaining.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-green-400/50 capitalize pt-2 border-t border-green-400/20">
                  {budget.period} Budget
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Overview */}
      <div className="matrix-card p-6 rounded-lg">
        <h3 className="text-xl font-semibold matrix-glow mb-6">Budget Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold matrix-glow">
              {budgets.length}
            </p>
            <p className="text-green-400/70">Active Budgets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              ${budgets.reduce((sum, budget) => sum + budget.limit, 0).toFixed(2)}
            </p>
            <p className="text-green-400/70">Total Budget</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              ${budgets.reduce((sum, budget) => sum + getCurrentPeriodExpenses(budget.category, budget.period), 0).toFixed(2)}
            </p>
            <p className="text-green-400/70">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              ${budgets.reduce((sum, budget) => sum + (budget.limit - getCurrentPeriodExpenses(budget.category, budget.period)), 0).toFixed(2)}
            </p>
            <p className="text-green-400/70">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
import React, { useState, useContext } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';
import AddExpenseModal from './AddExpenseModal';
import ExpenseChart from './ExpenseChart';

const Dashboard: React.FC = () => {
  const { expenses, totalExpenses, categories, cards } = useContext(ExpenseContext);
  const [showAddModal, setShowAddModal] = useState(false);

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const currentDate = new Date();
    return expenseDate.getMonth() === currentDate.getMonth() && 
           expenseDate.getFullYear() === currentDate.getFullYear();
  });

  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const totalCardBalance = cards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <div className="p-6 ml-64">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold igloo-glow mb-2 typing-animation">
          Financial Dashboard
        </h1>
        <p className="text-emerald-400/70 text-lg">
          Track and analyze your expenses with intelligent insights
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8">
        <button className="px-8 py-3 igloo-button rounded-xl font-semibold pulse-glow">
          Overview
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-3 igloo-button rounded-xl font-semibold hover-glow flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="igloo-card p-6 rounded-2xl hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400/70 text-sm mb-1">Total Expenses</p>
              <p className="text-2xl font-bold igloo-glow">${totalExpenses.toFixed(2)}</p>
            </div>
            <DollarSign className="text-emerald-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="igloo-card p-6 rounded-2xl hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400/70 text-sm mb-1">This Month</p>
              <p className="text-2xl font-bold igloo-glow">${monthlyTotal.toFixed(2)}</p>
            </div>
            <Calendar className="text-emerald-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="igloo-card p-6 rounded-2xl hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400/70 text-sm mb-1">Card Balance</p>
              <p className="text-2xl font-bold igloo-glow">${totalCardBalance.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-emerald-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="igloo-card p-6 rounded-2xl hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400/70 text-sm mb-1">Transactions</p>
              <p className="text-2xl font-bold igloo-glow">{expenses.length}</p>
            </div>
            <TrendingDown className="text-emerald-400 opacity-60" size={24} />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="igloo-card p-6 rounded-2xl">
          <h3 className="text-xl font-semibold igloo-glow mb-4">Expense Distribution</h3>
          <ExpenseChart />
        </div>

        <div className="igloo-card p-6 rounded-2xl">
          <h3 className="text-xl font-semibold igloo-glow mb-4">Recent Activity</h3>
          <div className="space-y-4 scroll-glow max-h-96 overflow-y-auto">
            {expenses.slice(-5).reverse().map((expense, index) => (
              <div key={expense.id} className="flex items-center justify-between py-3 border-b border-emerald-400/20">
                <div>
                  <p className="font-medium text-emerald-400">{expense.description}</p>
                  <p className="text-sm text-emerald-400/60">{expense.category} • {expense.date}</p>
                </div>
                <span className="font-bold text-lg igloo-glow">${expense.amount.toFixed(2)}</span>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-400/10 flex items-center justify-center">
                  <BarChart3 className="text-emerald-400 opacity-40" size={32} />
                </div>
                <h4 className="text-lg font-semibold igloo-glow mb-2">No expenses yet</h4>
                <p className="text-emerald-400/60 mb-4">Add some expenses to see your analytics</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="igloo-button px-6 py-2 rounded-xl hover-glow"
                >
                  Add First Expense
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="igloo-card p-6 rounded-2xl">
        <h3 className="text-xl font-semibold igloo-glow mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryExpenses = expenses.filter(exp => exp.category === category.name);
            const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            const percentage = totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0;
            
            return (
              <div key={category.name} className="bg-slate-800/50 p-4 rounded-xl border border-emerald-400/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-emerald-400">{category.name}</span>
                  <span className="text-sm text-emerald-400/70">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold igloo-glow">${categoryTotal.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <AddExpenseModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
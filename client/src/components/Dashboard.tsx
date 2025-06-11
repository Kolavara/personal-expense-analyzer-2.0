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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Financial Dashboard
        </h1>
        <p className="text-white/60 text-lg">
          Track and analyze your expenses with intelligent insights
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4">
        <button className="px-6 py-3 aeos-button-primary rounded-lg font-medium">
          Overview
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 aeos-button rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="aeos-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1 font-mono">Total Expenses</p>
              <p className="text-2xl font-bold text-white">${totalExpenses.toFixed(2)}</p>
            </div>
            <DollarSign className="text-blue-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="aeos-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1 font-mono">This Month</p>
              <p className="text-2xl font-bold text-white">${monthlyTotal.toFixed(2)}</p>
            </div>
            <Calendar className="text-blue-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="aeos-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1 font-mono">Card Balance</p>
              <p className="text-2xl font-bold text-white">${totalCardBalance.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-blue-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="aeos-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1 font-mono">Transactions</p>
              <p className="text-2xl font-bold text-white">{expenses.length}</p>
            </div>
            <TrendingDown className="text-blue-400 opacity-60" size={24} />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aeos-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Expense Distribution</h3>
          <ExpenseChart />
        </div>

        <div className="aeos-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {expenses.slice(-5).reverse().map((expense, index) => (
              <div key={expense.id} className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <p className="font-medium text-white">{expense.description}</p>
                  <p className="text-sm text-white/60 font-mono">{expense.category} • {expense.date}</p>
                </div>
                <span className="font-bold text-lg text-white">${expense.amount.toFixed(2)}</span>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <BarChart3 className="text-blue-400 opacity-40" size={32} />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">No expenses yet</h4>
                <p className="text-white/60 mb-4">Add some expenses to see your analytics</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="aeos-button-primary px-6 py-2 rounded-lg"
                >
                  Add First Expense
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="aeos-card p-6 mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryExpenses = expenses.filter(exp => exp.category === category.name);
            const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            const percentage = totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0;
            
            return (
              <div key={category.name} className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{category.name}</span>
                  <span className="text-sm text-white/70 font-mono">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-white">${categoryTotal.toFixed(2)}</span>
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
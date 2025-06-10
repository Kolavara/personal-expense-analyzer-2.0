import React, { useState, useContext } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';
import AddExpenseModal from './AddExpenseModal';

const Transactions: React.FC = () => {
  const { expenses, deleteExpense } = useContext(ExpenseContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(expenses.map(exp => exp.category)));

  return (
    <div className="p-6 ml-64">
      <div className="mb-8">
        <h1 className="text-4xl font-bold matrix-glow mb-2 typing-animation">
          Transactions
        </h1>
        <p className="text-green-400/70 text-lg">
          Manage and track all your financial transactions
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/60" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/60" size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="matrix-button px-6 py-3 rounded-lg hover-glow flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="matrix-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto scroll-glow">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-4 px-6 text-green-400 font-semibold">Date</th>
                <th className="text-left py-4 px-6 text-green-400 font-semibold">Description</th>
                <th className="text-left py-4 px-6 text-green-400 font-semibold">Category</th>
                <th className="text-right py-4 px-6 text-green-400 font-semibold">Amount</th>
                <th className="text-center py-4 px-6 text-green-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <tr key={expense.id} className="border-t border-green-400/20 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-6 text-green-400">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-green-400/60" />
                        <span>{expense.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-green-400">{expense.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-lg font-bold matrix-glow">${expense.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 text-green-400/70 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="text-green-400/60">
                      {searchTerm || filterCategory ? 'No transactions match your filters' : 'No transactions yet'}
                    </div>
                    {!searchTerm && !filterCategory && (
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 matrix-button px-6 py-2 rounded-lg hover-glow"
                      >
                        Add First Transaction
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="matrix-card p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold matrix-glow mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-green-400">{filteredExpenses.length}</p>
        </div>
        <div className="matrix-card p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold matrix-glow mb-2">Total Amount</h3>
          <p className="text-3xl font-bold text-green-400">
            ${filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="matrix-card p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold matrix-glow mb-2">Average</h3>
          <p className="text-3xl font-bold text-green-400">
            ${filteredExpenses.length > 0 ? 
              (filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / filteredExpenses.length).toFixed(2) : 
              '0.00'
            }
          </p>
        </div>
      </div>

      {showAddModal && (
        <AddExpenseModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default Transactions;
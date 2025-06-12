import React, { useState, useContext } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Calendar, CreditCard, Check, X } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';
import AddExpenseModal from './AddExpenseModal';

const Transactions: React.FC = () => {
  const { expenses, deleteExpense, updateExpense, categories, cards, selectedCountry } = useContext(ExpenseContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    cardId: ''
  });

  const formatCurrency = (amount: number) => {
    return `${selectedCountry.currency.symbol}${amount.toFixed(2)}`;
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const startEdit = (expense: any) => {
    setEditingExpense(expense.id);
    setEditFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      cardId: expense.cardId || ''
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense && editFormData.description && editFormData.amount && editFormData.category) {
      updateExpense(editingExpense, {
        description: editFormData.description,
        amount: parseFloat(editFormData.amount),
        category: editFormData.category,
        date: editFormData.date,
        cardId: editFormData.cardId || undefined
      });
      setEditingExpense(null);
    }
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    setEditFormData({
      description: '',
      amount: '',
      category: '',
      date: '',
      cardId: ''
    });
  };

  const getCardName = (cardId?: string) => {
    if (!cardId) return 'Cash';
    const card = cards.find(c => c.id === cardId);
    return card ? card.name : 'Unknown Card';
  };

  const expenseCategories = Array.from(new Set(expenses.map(exp => exp.category)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-tight" style={{
          textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)'
        }}>
          Transactions
        </h1>
        <p className="text-cyan-300/80 text-lg">
          Manage and track all your financial transactions
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
          >
            <option value="">All Categories</option>
            {expenseCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="aeos-button-primary px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="aeos-card aeos-interactive overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cyan-400/10">
              <tr>
                <th className="text-left py-4 px-6 text-cyan-400 font-semibold" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'}}>Date</th>
                <th className="text-left py-4 px-6 text-cyan-400 font-semibold" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'}}>Description</th>
                <th className="text-left py-4 px-6 text-cyan-400 font-semibold" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'}}>Category</th>
                <th className="text-left py-4 px-6 text-cyan-400 font-semibold" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'}}>Card</th>
                <th className="text-right py-4 px-6 text-cyan-400 font-semibold" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'}}>Amount</th>
                <th className="text-center py-4 px-6 text-cyan-400 font-semibold" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-t border-cyan-400/20 hover:bg-cyan-400/5 transition-colors">
                    {editingExpense === expense.id ? (
                      <>
                        <td className="py-4 px-6">
                          <input
                            type="date"
                            value={editFormData.date}
                            onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                            className="w-full p-2 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            className="w-full p-2 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                            placeholder="Description"
                            required
                          />
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={editFormData.category}
                            onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                            className="w-full p-2 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                            required
                          >
                            <option value="">Select category</option>
                            {categories.map(category => (
                              <option key={category.name} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={editFormData.cardId}
                            onChange={(e) => setEditFormData({ ...editFormData, cardId: e.target.value })}
                            className="w-full p-2 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                          >
                            <option value="">Cash</option>
                            {cards.map(card => (
                              <option key={card.id} value={card.id}>
                                {card.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            step="0.01"
                            value={editFormData.amount}
                            onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                            className="w-full p-2 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                            placeholder="Amount"
                            required
                          />
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={handleEditSubmit}
                              className="p-2 text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-6 text-cyan-400">
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className="text-cyan-400/60" />
                            <span>{expense.date}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-cyan-400">{expense.description}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <CreditCard size={16} className="text-cyan-400/60" />
                            <span className="text-cyan-400/80 text-sm">{getCardName(expense.cardId)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-lg font-bold text-cyan-400" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'}}>{formatCurrency(expense.amount)}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => startEdit(expense)}
                              className="p-2 text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                            >
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
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="text-cyan-400/60">
                      {searchTerm || filterCategory ? 'No transactions match your filters' : 'No transactions yet'}
                    </div>
                    {!searchTerm && !filterCategory && (
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 aeos-button-primary px-6 py-2 rounded-xl"
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
        <div className="aeos-card aeos-interactive aeos-parallax p-6 text-center">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>Total Transactions</h3>
          <p className="text-3xl font-bold text-cyan-400">{filteredExpenses.length}</p>
        </div>
        <div className="aeos-card aeos-interactive aeos-parallax p-6 text-center">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>Total Amount</h3>
          <p className="text-3xl font-bold text-cyan-400">
            {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
          </p>
        </div>
        <div className="aeos-card aeos-interactive aeos-parallax p-6 text-center">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>Average</h3>
          <p className="text-3xl font-bold text-cyan-400">
            {formatCurrency(filteredExpenses.length > 0 ? 
              (filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / filteredExpenses.length) : 
              0
            )}
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
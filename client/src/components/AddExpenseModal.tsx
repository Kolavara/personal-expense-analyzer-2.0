import React, { useState, useContext } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, CreditCard } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';

interface AddExpenseModalProps {
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onClose }) => {
  const { addExpense, categories, cards, selectedCountry } = useContext(ExpenseContext);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    cardId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.category) {
      addExpense({
        id: Date.now().toString(),
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        cardId: formData.cardId || undefined
      });
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const selectedCard = cards.find(card => card.id === formData.cardId);
  const expenseAmount = parseFloat(formData.amount) || 0;
  const hasInsufficientFunds = selectedCard && expenseAmount > selectedCard.balance;

  const formatCurrency = (amount: number) => {
    return `${selectedCountry.currency.symbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="aeos-glass p-8 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-cyan-400 mb-6" style={{
          textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
        }}>Add New Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" size={20} />
            <input
              type="text"
              name="description"
              placeholder="Expense description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              required
            />
          </div>

          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" size={20} />
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" size={20} />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" size={20} />
            <select
              name="cardId"
              value={formData.cardId}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
            >
              <option value="">Select card (optional)</option>
              {cards.map(card => (
                <option key={card.id} value={card.id}>
                  {card.name} - {formatCurrency(card.balance)}
                </option>
              ))}
            </select>
          </div>

          {hasInsufficientFunds && (
            <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-3 flex items-center space-x-2">
              <X className="text-red-400 flex-shrink-0" size={16} />
              <span className="text-red-400 text-sm">Insufficient funds on selected card</span>
            </div>
          )}

          {selectedCard && !hasInsufficientFunds && expenseAmount > 0 && (
            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-cyan-300/80">Remaining balance:</span>
                <span className="text-cyan-400 font-semibold" style={{
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                }}>
                  {formatCurrency(selectedCard.balance - expenseAmount)}
                </span>
              </div>
            </div>
          )}

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" size={20} />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={hasInsufficientFunds}
              className="flex-1 aeos-button-primary py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Expense
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 aeos-button py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
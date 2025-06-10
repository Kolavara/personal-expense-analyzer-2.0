import React, { useState, useContext } from 'react';
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';

interface AddExpenseModalProps {
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onClose }) => {
  const { addExpense, categories } = useContext(ExpenseContext);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.category) {
      addExpense({
        id: Date.now().toString(),
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="matrix-card p-8 rounded-lg w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-400/70 hover:text-green-400 hover:bg-green-400/10 p-2 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold matrix-glow mb-6 typing-animation">Add New Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/60" size={20} />
            <input
              type="text"
              name="description"
              placeholder="Expense description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
              required
            />
          </div>

          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/60" size={20} />
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/60" size={20} />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
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
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/60" size={20} />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 matrix-button py-3 rounded-lg hover-glow font-semibold transition-all duration-300"
            >
              Add Expense
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
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
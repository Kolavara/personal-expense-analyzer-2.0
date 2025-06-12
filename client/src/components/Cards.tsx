import React, { useState, useContext } from 'react';
import { Plus, CreditCard, Edit, Trash2, Eye, EyeOff, MoreVertical, Check, X } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';

const Cards: React.FC = () => {
  const { cards, addCard, updateCard, deleteCard, selectedCountry } = useContext(ExpenseContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    balance: '',
    cardNumber: '',
    expiryDate: '',
    cardType: 'visa' as const,
    color: 'blue'
  });
  const [newCard, setNewCard] = useState({
    name: '',
    balance: '',
    cardNumber: '',
    expiryDate: '',
    cardType: 'visa' as const,
    color: 'blue'
  });

  const formatCurrency = (amount: number) => {
    return `${selectedCountry.currency.symbol}${amount.toFixed(2)}`;
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCard.name && newCard.balance) {
      const card = {
        id: Date.now().toString(),
        name: newCard.name,
        balance: parseFloat(newCard.balance),
        cardNumber: newCard.cardNumber || '**** **** **** ****',
        expiryDate: newCard.expiryDate || '12/25',
        cardType: newCard.cardType,
        color: newCard.color
      };
      addCard(card);
      setNewCard({
        name: '',
        balance: '',
        cardNumber: '',
        expiryDate: '',
        cardType: 'visa',
        color: 'blue'
      });
      setShowAddForm(false);
    }
  };

  const startEdit = (card: any) => {
    setEditingCard(card.id);
    setEditFormData({
      name: card.name,
      balance: card.balance.toString(),
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      cardType: card.cardType,
      color: card.color
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCard && editFormData.name && editFormData.balance) {
      updateCard(editingCard, {
        name: editFormData.name,
        balance: parseFloat(editFormData.balance),
        cardNumber: editFormData.cardNumber,
        expiryDate: editFormData.expiryDate,
        cardType: editFormData.cardType,
        color: editFormData.color
      });
      setEditingCard(null);
    }
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setEditFormData({
      name: '',
      balance: '',
      cardNumber: '',
      expiryDate: '',
      cardType: 'visa',
      color: 'blue'
    });
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
    }
  };

  const getCardColor = (color: string) => {
    const colors = {
      blue: 'from-blue-600 to-blue-800',
      green: 'from-emerald-600 to-emerald-800',
      purple: 'from-purple-600 to-purple-800',
      red: 'from-red-600 to-red-800',
      gold: 'from-yellow-600 to-yellow-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-tight" style={{
          textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)'
        }}>
          Cards Management
        </h1>
        <p className="text-cyan-300/80 text-lg">
          Manage your card balances and track spending
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="aeos-card aeos-interactive aeos-parallax p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/70 text-sm mb-1">Total Cards</p>
              <p className="text-2xl font-bold text-cyan-400" style={{textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'}}>{cards.length}</p>
            </div>
            <CreditCard className="text-cyan-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="aeos-card aeos-interactive aeos-parallax p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/70 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-cyan-400" style={{textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'}}>{formatCurrency(totalBalance)}</p>
            </div>
            <CreditCard className="text-cyan-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="aeos-card aeos-interactive aeos-parallax p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/70 text-sm mb-1">Average Balance</p>
              <p className="text-2xl font-bold text-cyan-400" style={{textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'}}>
                {formatCurrency(cards.length > 0 ? (totalBalance / cards.length) : 0)}
              </p>
            </div>
            <CreditCard className="text-cyan-400 opacity-60" size={24} />
          </div>
        </div>
      </div>

      {/* Add Card Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="aeos-button-primary px-6 py-3 rounded-xl flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Card</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Add Card Form */}
        {showAddForm && (
          <div className="aeos-card aeos-interactive p-6">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center space-x-2" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>
              <Plus size={20} />
              <span>Add New Card</span>
            </h3>
            <form onSubmit={handleAddCard} className="space-y-4">
              <input
                type="text"
                placeholder="Card Name"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                className="w-full p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-xl text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                required
              />
              <input
                type="number"
                placeholder="Initial Balance"
                step="0.01"
                value={newCard.balance}
                onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
                className="w-full p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-xl text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                required
              />
              <input
                type="text"
                placeholder="Card Number (optional)"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                className="w-full p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-xl text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newCard.cardType}
                  onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value as any })}
                  className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-xl text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                  <option value="discover">Discover</option>
                </select>
                <select
                  value={newCard.color}
                  onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                  className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-xl text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="red">Red</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 aeos-button-primary py-3 rounded-xl font-semibold"
                >
                  Add Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 aeos-button py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Cards */}
        {cards.map((card) => (
          <div key={card.id} className="relative">
            {/* Card Visual */}
            <div className={`bg-gradient-to-br ${getCardColor(card.color)} p-6 rounded-2xl text-white mb-4 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-white/80 text-sm">{card.name}</p>
                    <p className="text-2xl font-bold">{formatCurrency(card.balance)}</p>
                  </div>
                  <CreditCard size={32} className="text-white/60" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-xs mb-1">CARD NUMBER</p>
                    <p className="font-mono text-sm">{card.cardNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs mb-1">EXPIRES</p>
                    <p className="font-mono text-sm">{card.expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="aeos-card aeos-interactive p-4">
              {editingCard === card.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2 bg-cyan-400/5 border border-cyan-400/30 rounded-xl text-cyan-400 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                    placeholder="Card name"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.balance}
                    onChange={(e) => setEditFormData({ ...editFormData, balance: e.target.value })}
                    className="w-full p-2 bg-cyan-400/5 border border-cyan-400/30 rounded-xl text-cyan-400 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
                    placeholder="Balance"
                    required
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 p-2 aeos-button-primary rounded-xl flex items-center justify-center"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 p-2 aeos-button rounded-xl flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-cyan-400">{card.name}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(card)}
                      className="p-2 text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cards.length === 0 && !showAddForm && (
        <div className="aeos-card aeos-interactive p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-400/10 flex items-center justify-center">
            <CreditCard className="text-cyan-400 opacity-40" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-2" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>No cards added yet</h3>
          <p className="text-cyan-400/60 mb-6">Add your first card to start managing your balances</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="aeos-button-primary px-6 py-3 rounded-xl"
          >
            Add First Card
          </button>
        </div>
      )}
    </div>
  );
};

export default Cards;
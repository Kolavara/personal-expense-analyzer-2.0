import React, { useState } from 'react';
import { Plus, CreditCard, Edit, Trash2, Eye, EyeOff, MoreVertical } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  balance: number;
  cardNumber: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  color: string;
}

const Cards: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      name: 'Primary Visa',
      balance: 1000.00,
      cardNumber: '**** **** **** 1234',
      expiryDate: '12/26',
      cardType: 'visa',
      color: 'blue'
    },
    {
      id: '2',
      name: 'Backup Card',
      balance: 1500.00,
      cardNumber: '**** **** **** 5678',
      expiryDate: '08/25',
      cardType: 'mastercard',
      color: 'green'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    name: '',
    balance: '',
    cardNumber: '',
    expiryDate: '',
    cardType: 'visa' as const,
    color: 'blue'
  });

  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [updateBalance, setUpdateBalance] = useState<{ [key: string]: string }>({});

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCard.name && newCard.balance) {
      const card: Card = {
        id: Date.now().toString(),
        name: newCard.name,
        balance: parseFloat(newCard.balance),
        cardNumber: newCard.cardNumber || '**** **** **** ****',
        expiryDate: newCard.expiryDate || '12/25',
        cardType: newCard.cardType,
        color: newCard.color
      };
      setCards([...cards, card]);
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

  const handleUpdateBalance = (cardId: string) => {
    const newBalance = updateBalance[cardId];
    if (newBalance) {
      setCards(cards.map(card => 
        card.id === cardId 
          ? { ...card, balance: parseFloat(newBalance) }
          : card
      ));
      setUpdateBalance({ ...updateBalance, [cardId]: '' });
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const getCardColor = (color: string) => {
    const colors = {
      blue: 'from-blue-600 to-blue-800',
      green: 'from-green-600 to-green-800',
      purple: 'from-purple-600 to-purple-800',
      red: 'from-red-600 to-red-800',
      gold: 'from-yellow-600 to-yellow-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <div className="p-6 ml-64">
      <div className="mb-8">
        <h1 className="text-4xl font-bold matrix-glow mb-2 typing-animation">
          Cards Management
        </h1>
        <p className="text-green-400/70 text-lg">
          Manage your card balances and track spending
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="matrix-card p-6 rounded-lg hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400/70 text-sm mb-1">Total Cards</p>
              <p className="text-2xl font-bold matrix-glow">{cards.length}</p>
            </div>
            <CreditCard className="text-green-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="matrix-card p-6 rounded-lg hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400/70 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold matrix-glow">${totalBalance.toFixed(2)}</p>
            </div>
            <CreditCard className="text-green-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="matrix-card p-6 rounded-lg hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400/70 text-sm mb-1">Average Balance</p>
              <p className="text-2xl font-bold matrix-glow">
                ${cards.length > 0 ? (totalBalance / cards.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <CreditCard className="text-green-400 opacity-60" size={24} />
          </div>
        </div>
      </div>

      {/* Add Card Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="matrix-button px-6 py-3 rounded-lg hover-glow flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Card</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Add Card Form */}
        {showAddForm && (
          <div className="matrix-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold matrix-glow mb-4 flex items-center space-x-2">
              <Plus size={20} />
              <span>Add New Card</span>
            </h3>
            <form onSubmit={handleAddCard} className="space-y-4">
              <input
                type="text"
                placeholder="Card Name"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                className="w-full p-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                required
              />
              <input
                type="number"
                placeholder="Initial Balance"
                step="0.01"
                value={newCard.balance}
                onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
                className="w-full p-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                required
              />
              <input
                type="text"
                placeholder="Card Number (optional)"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                className="w-full p-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newCard.cardType}
                  onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value as any })}
                  className="p-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                  <option value="discover">Discover</option>
                </select>
                <select
                  value={newCard.color}
                  onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                  className="p-3 bg-gray-800/50 matrix-border rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
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
                  className="flex-1 matrix-button py-3 rounded-lg hover-glow font-semibold"
                >
                  Add Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
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
            <div className={`bg-gradient-to-br ${getCardColor(card.color)} p-6 rounded-xl text-white mb-4 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-white/80 text-sm">{card.name}</p>
                    <p className="text-2xl font-bold">${card.balance.toFixed(2)}</p>
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
            <div className="matrix-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-green-400">Update Balance</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCard(editingCard === card.id ? null : card.id)}
                    className="p-2 text-green-400/70 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="New balance"
                  step="0.01"
                  value={updateBalance[card.id] || ''}
                  onChange={(e) => setUpdateBalance({ ...updateBalance, [card.id]: e.target.value })}
                  className="flex-1 p-2 bg-gray-800/50 matrix-border rounded text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
                <button
                  onClick={() => handleUpdateBalance(card.id)}
                  className="px-4 py-2 matrix-button rounded hover-glow text-sm"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cards Overview */}
      {cards.length === 0 && !showAddForm && (
        <div className="matrix-card p-12 rounded-lg text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-400/10 flex items-center justify-center">
            <CreditCard className="text-green-400 opacity-40" size={32} />
          </div>
          <h3 className="text-xl font-semibold matrix-glow mb-2">No cards added yet</h3>
          <p className="text-green-400/60 mb-6">Add your first card to start managing your balances</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="matrix-button px-6 py-3 rounded-lg hover-glow"
          >
            Add First Card
          </button>
        </div>
      )}
    </div>
  );
};

export default Cards;
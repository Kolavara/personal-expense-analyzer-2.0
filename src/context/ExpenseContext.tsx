import React, { createContext, useState, ReactNode } from 'react';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  cardId?: string;
}

export interface Category {
  name: string;
  color: string;
}

export interface Card {
  id: string;
  name: string;
  balance: number;
  cardNumber: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  color: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  cards: Card[];
  totalExpenses: number;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  addCard: (card: Card) => void;
  updateCard: (id: string, card: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  deductFromCard: (cardId: string, amount: number) => void;
}

export const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  categories: [],
  cards: [],
  totalExpenses: 0,
  addExpense: () => {},
  deleteExpense: () => {},
  updateExpense: () => {},
  addCard: () => {},
  updateCard: () => {},
  deleteCard: () => {},
  deductFromCard: () => {},
});

const defaultCategories: Category[] = [
  { name: 'Food & Dining', color: '#00ff00' },
  { name: 'Transportation', color: '#00cc88' },
  { name: 'Shopping', color: '#00aa66' },
  { name: 'Entertainment', color: '#008844' },
  { name: 'Bills & Utilities', color: '#006622' },
  { name: 'Healthcare', color: '#ffaa00' },
  { name: 'Travel', color: '#ff8800' },
  { name: 'Education', color: '#ff6600' },
  { name: 'Personal Care', color: '#ff4400' },
  { name: 'Other', color: '#ff2200' },
];

const defaultCards: Card[] = [
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
];

const sampleExpenses: Expense[] = [
  {
    id: '1',
    description: 'Grocery Shopping - Weekly supplies',
    amount: 85.47,
    category: 'Food & Dining',
    date: '2024-06-10',
    cardId: '1'
  },
  {
    id: '2',
    description: 'Gas Station - Fuel',
    amount: 45.20,
    category: 'Transportation',
    date: '2024-06-09',
    cardId: '2'
  },
  {
    id: '3',
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    date: '2024-06-08',
    cardId: '1'
  },
  {
    id: '4',
    description: 'Electricity Bill',
    amount: 125.30,
    category: 'Bills & Utilities',
    date: '2024-06-07',
    cardId: '2'
  },
  {
    id: '5',
    description: 'Coffee Shop',
    amount: 12.50,
    category: 'Food & Dining',
    date: '2024-06-07',
    cardId: '1'
  }
];

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [categories] = useState<Category[]>(defaultCategories);
  const [cards, setCards] = useState<Card[]>(defaultCards);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
    if (expense.cardId) {
      deductFromCard(expense.cardId, expense.amount);
    }
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense && expense.cardId) {
      // Add back to card balance when deleting expense
      setCards(prev => prev.map(card => 
        card.id === expense.cardId 
          ? { ...card, balance: card.balance + expense.amount }
          : card
      ));
    }
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    const oldExpense = expenses.find(exp => exp.id === id);
    if (oldExpense) {
      // If card changed or amount changed, adjust balances
      if (oldExpense.cardId && (updatedExpense.cardId !== oldExpense.cardId || updatedExpense.amount !== oldExpense.amount)) {
        // Add back old amount to old card
        setCards(prev => prev.map(card => 
          card.id === oldExpense.cardId 
            ? { ...card, balance: card.balance + oldExpense.amount }
            : card
        ));
      }
      
      // Deduct new amount from new card
      if (updatedExpense.cardId && updatedExpense.amount) {
        setCards(prev => prev.map(card => 
          card.id === updatedExpense.cardId 
            ? { ...card, balance: card.balance - updatedExpense.amount }
            : card
        ));
      }
    }
    
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  const addCard = (card: Card) => {
    setCards(prev => [...prev, card]);
  };

  const updateCard = (id: string, updatedCard: Partial<Card>) => {
    setCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, ...updatedCard } : card
      )
    );
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
    // Remove card reference from expenses
    setExpenses(prev => prev.map(expense => 
      expense.cardId === id ? { ...expense, cardId: undefined } : expense
    ));
  };

  const deductFromCard = (cardId: string, amount: number) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, balance: card.balance - amount }
        : card
    ));
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      categories,
      cards,
      totalExpenses,
      addExpense,
      deleteExpense,
      updateExpense,
      addCard,
      updateCard,
      deleteCard,
      deductFromCard,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
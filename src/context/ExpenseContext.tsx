import React, { createContext, useState, ReactNode } from 'react';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Category {
  name: string;
  color: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  totalExpenses: number;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
}

export const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  categories: [],
  totalExpenses: 0,
  addExpense: () => {},
  deleteExpense: () => {},
  updateExpense: () => {},
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

const sampleExpenses: Expense[] = [
  {
    id: '1',
    description: 'Grocery Shopping - Weekly supplies',
    amount: 85.47,
    category: 'Food & Dining',
    date: '2024-06-10'
  },
  {
    id: '2',
    description: 'Gas Station - Fuel',
    amount: 45.20,
    category: 'Transportation',
    date: '2024-06-09'
  },
  {
    id: '3',
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    date: '2024-06-08'
  },
  {
    id: '4',
    description: 'Electricity Bill',
    amount: 125.30,
    category: 'Bills & Utilities',
    date: '2024-06-07'
  },
  {
    id: '5',
    description: 'Coffee Shop',
    amount: 12.50,
    category: 'Food & Dining',
    date: '2024-06-07'
  }
];

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [categories] = useState<Category[]>(defaultCategories);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      categories,
      totalExpenses,
      addExpense,
      deleteExpense,
      updateExpense,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
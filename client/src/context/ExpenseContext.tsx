import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { currencyService } from '../services/currencyService';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  cardId?: string;
  originalAmount?: number;
  originalCurrency?: string;
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
  originalBalance?: number;
  originalCurrency?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: {
    symbol: string;
    code: string;
    name: string;
  };
}

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  cards: Card[];
  totalExpenses: number;
  selectedCountry: Country;
  countries: Country[];
  isConverting: boolean;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  addCard: (card: Card) => void;
  updateCard: (id: string, card: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  deductFromCard: (cardId: string, amount: number) => void;
  setSelectedCountry: (country: Country) => void;
}

const defaultCountries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: { symbol: '$', code: 'USD', name: 'US Dollar' } },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: { symbol: '£', code: 'GBP', name: 'British Pound' } },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' } },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' } },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: { symbol: '¥', code: 'JPY', name: 'Japanese Yen' } },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: { symbol: '¥', code: 'CNY', name: 'Chinese Yuan' } },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: { symbol: '₹', code: 'INR', name: 'Indian Rupee' } },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', currency: { symbol: '₩', code: 'KRW', name: 'South Korean Won' } },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar' } },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', currency: { symbol: 'HK$', code: 'HKD', name: 'Hong Kong Dollar' } },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: { symbol: 'CHF', code: 'CHF', name: 'Swiss Franc' } },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', currency: { symbol: 'kr', code: 'NOK', name: 'Norwegian Krone' } },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', currency: { symbol: 'kr', code: 'SEK', name: 'Swedish Krona' } },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', currency: { symbol: 'kr', code: 'DKK', name: 'Danish Krone' } },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: { symbol: 'NZ$', code: 'NZD', name: 'New Zealand Dollar' } },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: { symbol: '$', code: 'MXN', name: 'Mexican Peso' } },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: { symbol: 'R$', code: 'BRL', name: 'Brazilian Real' } },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: { symbol: '$', code: 'ARS', name: 'Argentine Peso' } },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: { symbol: '$', code: 'CLP', name: 'Chilean Peso' } },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: { symbol: '$', code: 'COP', name: 'Colombian Peso' } },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', currency: { symbol: 'S/', code: 'PEN', name: 'Peruvian Sol' } },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: { symbol: 'R', code: 'ZAR', name: 'South African Rand' } },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: { symbol: '£', code: 'EGP', name: 'Egyptian Pound' } },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: { symbol: '₦', code: 'NGN', name: 'Nigerian Naira' } },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: { symbol: 'KSh', code: 'KES', name: 'Kenyan Shilling' } },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', currency: { symbol: 'MAD', code: 'MAD', name: 'Moroccan Dirham' } },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', currency: { symbol: 'د.ت', code: 'TND', name: 'Tunisian Dinar' } },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', currency: { symbol: '₽', code: 'RUB', name: 'Russian Ruble' } },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', currency: { symbol: '₺', code: 'TRY', name: 'Turkish Lira' } },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: { symbol: '﷼', code: 'SAR', name: 'Saudi Riyal' } },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham' } },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: { symbol: '﷼', code: 'QAR', name: 'Qatari Riyal' } },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currency: { symbol: 'د.ك', code: 'KWD', name: 'Kuwaiti Dinar' } },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', currency: { symbol: '.د.ب', code: 'BHD', name: 'Bahraini Dinar' } },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', currency: { symbol: '﷼', code: 'OMR', name: 'Omani Rial' } },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', currency: { symbol: '₪', code: 'ILS', name: 'Israeli Shekel' } },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: { symbol: '฿', code: 'THB', name: 'Thai Baht' } },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: { symbol: '₫', code: 'VND', name: 'Vietnamese Dong' } },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: { symbol: 'RM', code: 'MYR', name: 'Malaysian Ringgit' } },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: { symbol: 'Rp', code: 'IDR', name: 'Indonesian Rupiah' } },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: { symbol: '₱', code: 'PHP', name: 'Philippine Peso' } },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', currency: { symbol: '৳', code: 'BDT', name: 'Bangladeshi Taka' } },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: { symbol: '₨', code: 'PKR', name: 'Pakistani Rupee' } },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', currency: { symbol: '₨', code: 'LKR', name: 'Sri Lankan Rupee' } },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: { symbol: '₨', code: 'NPR', name: 'Nepalese Rupee' } },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', currency: { symbol: 'K', code: 'MMK', name: 'Myanmar Kyat' } },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', currency: { symbol: '៛', code: 'KHR', name: 'Cambodian Riel' } },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', currency: { symbol: '₭', code: 'LAK', name: 'Lao Kip' } },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', currency: { symbol: '₮', code: 'MNT', name: 'Mongolian Tugrik' } },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', currency: { symbol: '₸', code: 'KZT', name: 'Kazakhstani Tenge' } },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', currency: { symbol: 'лв', code: 'UZS', name: 'Uzbekistani Som' } }
];

export const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  categories: [],
  cards: [],
  totalExpenses: 0,
  selectedCountry: defaultCountries[0],
  countries: [],
  isConverting: false,
  addExpense: () => {},
  deleteExpense: () => {},
  updateExpense: () => {},
  addCard: () => {},
  updateCard: () => {},
  deleteCard: () => {},
  deductFromCard: () => {},
  setSelectedCountry: () => {},
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
  const [selectedCountry, setSelectedCountryState] = useState<Country>(defaultCountries[0]);
  const [isConverting, setIsConverting] = useState(false);
  const [previousCurrency, setPreviousCurrency] = useState<string>('USD');

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Handle currency conversion when country changes
  const setSelectedCountry = async (country: Country) => {
    if (country.currency.code === selectedCountry.currency.code) {
      return; // No change needed
    }

    setIsConverting(true);
    
    try {
      const fromCurrency = selectedCountry.currency.code;
      const toCurrency = country.currency.code;

      // Convert expenses
      const convertedExpenses = await currencyService.convertExpenseData(
        expenses, 
        fromCurrency, 
        toCurrency
      );

      // Convert card balances
      const convertedCards = await currencyService.convertCardData(
        cards, 
        fromCurrency, 
        toCurrency
      );

      setExpenses(convertedExpenses);
      setCards(convertedCards);
      setPreviousCurrency(fromCurrency);
      setSelectedCountryState(country);
    } catch (error) {
      console.error('Currency conversion failed:', error);
      // Still update the country even if conversion fails
      setSelectedCountryState(country);
    } finally {
      setIsConverting(false);
    }
  };

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
      selectedCountry,
      countries: defaultCountries,
      isConverting,
      addExpense,
      deleteExpense,
      updateExpense,
      addCard,
      updateCard,
      deleteCard,
      deductFromCard,
      setSelectedCountry,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
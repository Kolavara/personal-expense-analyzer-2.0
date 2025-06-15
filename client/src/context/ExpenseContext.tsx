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
  // Major Economies
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: { symbol: '$', code: 'USD', name: 'US Dollar' } },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: { symbol: '¥', code: 'CNY', name: 'Chinese Yuan' } },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: { symbol: '¥', code: 'JPY', name: 'Japanese Yen' } },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: { symbol: '₹', code: 'INR', name: 'Indian Rupee' } },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: { symbol: '£', code: 'GBP', name: 'British Pound' } },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: { symbol: 'R$', code: 'BRL', name: 'Brazilian Real' } },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' } },
  
  // Europe
  { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: { symbol: 'CHF', code: 'CHF', name: 'Swiss Franc' } },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', currency: { symbol: 'kr', code: 'NOK', name: 'Norwegian Krone' } },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', currency: { symbol: 'kr', code: 'SEK', name: 'Swedish Krona' } },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', currency: { symbol: 'kr', code: 'DKK', name: 'Danish Krone' } },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', currency: { symbol: 'kr', code: 'ISK', name: 'Icelandic Krona' } },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', currency: { symbol: 'zł', code: 'PLN', name: 'Polish Zloty' } },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', currency: { symbol: 'Kč', code: 'CZK', name: 'Czech Koruna' } },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', currency: { symbol: 'Ft', code: 'HUF', name: 'Hungarian Forint' } },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', currency: { symbol: 'lei', code: 'RON', name: 'Romanian Leu' } },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', currency: { symbol: 'лв', code: 'BGN', name: 'Bulgarian Lev' } },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', currency: { symbol: 'дин', code: 'RSD', name: 'Serbian Dinar' } },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', currency: { symbol: 'KM', code: 'BAM', name: 'Convertible Mark' } },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', currency: { symbol: 'ден', code: 'MKD', name: 'Macedonian Denar' } },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', currency: { symbol: 'L', code: 'ALL', name: 'Albanian Lek' } },
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', currency: { symbol: 'L', code: 'MDL', name: 'Moldovan Leu' } },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', currency: { symbol: '₴', code: 'UAH', name: 'Ukrainian Hryvnia' } },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', currency: { symbol: 'Br', code: 'BYN', name: 'Belarusian Ruble' } },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', currency: { symbol: '₽', code: 'RUB', name: 'Russian Ruble' } },
  
  // Asia-Pacific
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', currency: { symbol: '₩', code: 'KRW', name: 'South Korean Won' } },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' } },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: { symbol: 'NZ$', code: 'NZD', name: 'New Zealand Dollar' } },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar' } },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', currency: { symbol: 'HK$', code: 'HKD', name: 'Hong Kong Dollar' } },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', currency: { symbol: 'NT$', code: 'TWD', name: 'Taiwan Dollar' } },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: { symbol: 'RM', code: 'MYR', name: 'Malaysian Ringgit' } },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: { symbol: '฿', code: 'THB', name: 'Thai Baht' } },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: { symbol: 'Rp', code: 'IDR', name: 'Indonesian Rupiah' } },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: { symbol: '₱', code: 'PHP', name: 'Philippine Peso' } },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: { symbol: '₫', code: 'VND', name: 'Vietnamese Dong' } },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', currency: { symbol: '৳', code: 'BDT', name: 'Bangladeshi Taka' } },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: { symbol: '₨', code: 'PKR', name: 'Pakistani Rupee' } },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', currency: { symbol: '₨', code: 'LKR', name: 'Sri Lankan Rupee' } },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: { symbol: '₨', code: 'NPR', name: 'Nepalese Rupee' } },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', currency: { symbol: 'K', code: 'MMK', name: 'Myanmar Kyat' } },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', currency: { symbol: '៛', code: 'KHR', name: 'Cambodian Riel' } },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', currency: { symbol: '₭', code: 'LAK', name: 'Lao Kip' } },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', currency: { symbol: 'B$', code: 'BND', name: 'Brunei Dollar' } },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', currency: { symbol: '₮', code: 'MNT', name: 'Mongolian Tugrik' } },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', currency: { symbol: '₸', code: 'KZT', name: 'Kazakhstani Tenge' } },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', currency: { symbol: 'лв', code: 'UZS', name: 'Uzbekistani Som' } },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', currency: { symbol: 'лв', code: 'KGS', name: 'Kyrgyzstani Som' } },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', currency: { symbol: 'SM', code: 'TJS', name: 'Tajikistani Somoni' } },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', currency: { symbol: 'T', code: 'TMT', name: 'Turkmenistani Manat' } },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', currency: { symbol: '؋', code: 'AFN', name: 'Afghan Afghani' } },
  
  // Middle East
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: { symbol: '﷼', code: 'SAR', name: 'Saudi Riyal' } },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham' } },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: { symbol: '﷼', code: 'QAR', name: 'Qatari Riyal' } },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currency: { symbol: 'د.ك', code: 'KWD', name: 'Kuwaiti Dinar' } },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', currency: { symbol: '.د.ب', code: 'BHD', name: 'Bahraini Dinar' } },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', currency: { symbol: '﷼', code: 'OMR', name: 'Omani Rial' } },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', currency: { symbol: '₪', code: 'ILS', name: 'Israeli Shekel' } },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', currency: { symbol: '₺', code: 'TRY', name: 'Turkish Lira' } },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', currency: { symbol: '﷼', code: 'IRR', name: 'Iranian Rial' } },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', currency: { symbol: 'ع.د', code: 'IQD', name: 'Iraqi Dinar' } },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', currency: { symbol: '£', code: 'SYP', name: 'Syrian Pound' } },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', currency: { symbol: '£', code: 'LBP', name: 'Lebanese Pound' } },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', currency: { symbol: 'د.ا', code: 'JOD', name: 'Jordanian Dinar' } },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', currency: { symbol: '₪', code: 'ILS', name: 'Israeli Shekel' } },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', currency: { symbol: '﷼', code: 'YER', name: 'Yemeni Rial' } },
  
  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: { symbol: 'R', code: 'ZAR', name: 'South African Rand' } },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: { symbol: '£', code: 'EGP', name: 'Egyptian Pound' } },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: { symbol: '₦', code: 'NGN', name: 'Nigerian Naira' } },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: { symbol: 'KSh', code: 'KES', name: 'Kenyan Shilling' } },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', currency: { symbol: 'MAD', code: 'MAD', name: 'Moroccan Dirham' } },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', currency: { symbol: 'د.ت', code: 'TND', name: 'Tunisian Dinar' } },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', currency: { symbol: 'د.ج', code: 'DZD', name: 'Algerian Dinar' } },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', currency: { symbol: 'ل.د', code: 'LYD', name: 'Libyan Dinar' } },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', currency: { symbol: 'ج.س.', code: 'SDG', name: 'Sudanese Pound' } },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: { symbol: 'Br', code: 'ETB', name: 'Ethiopian Birr' } },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: { symbol: '¢', code: 'GHS', name: 'Ghanaian Cedi' } },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA Franc' } },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA Franc' } },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA Franc' } },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA Franc' } },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA Franc' } },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', currency: { symbol: 'FG', code: 'GNF', name: 'Guinean Franc' } },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', currency: { symbol: 'Le', code: 'SLL', name: 'Sierra Leonean Leone' } },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', currency: { symbol: '$', code: 'LRD', name: 'Liberian Dollar' } },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA Franc' } },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA Franc' } },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', currency: { symbol: 'FCFA', code: 'XAF', name: 'Central African CFA Franc' } },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', currency: { symbol: 'FCFA', code: 'XAF', name: 'Central African CFA Franc' } },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', currency: { symbol: 'FCFA', code: 'XAF', name: 'Central African CFA Franc' } },
  { code: 'CG', name: 'Republic of the Congo', flag: '🇨🇬', currency: { symbol: 'FCFA', code: 'XAF', name: 'Central African CFA Franc' } },
  { code: 'CD', name: 'Democratic Republic of the Congo', flag: '🇨🇩', currency: { symbol: 'FC', code: 'CDF', name: 'Congolese Franc' } },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', currency: { symbol: 'FCFA', code: 'XAF', name: 'Central African CFA Franc' } },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', currency: { symbol: 'FCFA', code: 'XAF', name: 'Central African CFA Franc' } },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', currency: { symbol: 'Kz', code: 'AOA', name: 'Angolan Kwanza' } },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', currency: { symbol: 'ZK', code: 'ZMW', name: 'Zambian Kwacha' } },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', currency: { symbol: '$', code: 'USD', name: 'US Dollar' } },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', currency: { symbol: 'P', code: 'BWP', name: 'Botswana Pula' } },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', currency: { symbol: '$', code: 'NAD', name: 'Namibian Dollar' } },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', currency: { symbol: 'L', code: 'SZL', name: 'Swazi Lilangeni' } },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', currency: { symbol: 'L', code: 'LSL', name: 'Lesotho Loti' } },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', currency: { symbol: 'MK', code: 'MWK', name: 'Malawian Kwacha' } },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', currency: { symbol: 'MT', code: 'MZN', name: 'Mozambican Metical' } },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', currency: { symbol: 'Ar', code: 'MGA', name: 'Malagasy Ariary' } },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', currency: { symbol: '₨', code: 'MUR', name: 'Mauritian Rupee' } },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', currency: { symbol: '₨', code: 'SCR', name: 'Seychellois Rupee' } },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: { symbol: 'USh', code: 'UGX', name: 'Ugandan Shilling' } },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: { symbol: 'TSh', code: 'TZS', name: 'Tanzanian Shilling' } },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: { symbol: 'FRw', code: 'RWF', name: 'Rwandan Franc' } },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', currency: { symbol: 'FBu', code: 'BIF', name: 'Burundian Franc' } },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', currency: { symbol: 'Fdj', code: 'DJF', name: 'Djiboutian Franc' } },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', currency: { symbol: 'S', code: 'SOS', name: 'Somali Shilling' } },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', currency: { symbol: 'Nfk', code: 'ERN', name: 'Eritrean Nakfa' } },
  
  // Americas
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: { symbol: '$', code: 'MXN', name: 'Mexican Peso' } },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: { symbol: '$', code: 'ARS', name: 'Argentine Peso' } },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: { symbol: '$', code: 'CLP', name: 'Chilean Peso' } },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: { symbol: '$', code: 'COP', name: 'Colombian Peso' } },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', currency: { symbol: 'S/', code: 'PEN', name: 'Peruvian Sol' } },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', currency: { symbol: 'Bs', code: 'VES', name: 'Venezuelan Bolívar' } },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', currency: { symbol: '$', code: 'USD', name: 'US Dollar' } },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', currency: { symbol: '$b', code: 'BOB', name: 'Bolivian Boliviano' } },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', currency: { symbol: 'Gs', code: 'PYG', name: 'Paraguayan Guaraní' } },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', currency: { symbol: '$U', code: 'UYU', name: 'Uruguayan Peso' } },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', currency: { symbol: '$', code: 'GYD', name: 'Guyanese Dollar' } },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', currency: { symbol: '$', code: 'SRD', name: 'Surinamese Dollar' } },
  { code: 'GF', name: 'French Guiana', flag: '🇬🇫', currency: { symbol: '€', code: 'EUR', name: 'Euro' } },
  { code: 'FK', name: 'Falkland Islands', flag: '🇫🇰', currency: { symbol: '£', code: 'FKP', name: 'Falkland Islands Pound' } },
  
  // Caribbean
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', currency: { symbol: '$', code: 'CUP', name: 'Cuban Peso' } },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', currency: { symbol: 'RD$', code: 'DOP', name: 'Dominican Peso' } },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹', currency: { symbol: 'G', code: 'HTG', name: 'Haitian Gourde' } },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', currency: { symbol: 'J$', code: 'JMD', name: 'Jamaican Dollar' } },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', currency: { symbol: 'TT$', code: 'TTD', name: 'Trinidad and Tobago Dollar' } },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', currency: { symbol: '$', code: 'BBD', name: 'Barbadian Dollar' } },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', currency: { symbol: '$', code: 'BSD', name: 'Bahamian Dollar' } },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', currency: { symbol: 'BZ$', code: 'BZD', name: 'Belize Dollar' } },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', currency: { symbol: '₡', code: 'CRC', name: 'Costa Rican Colón' } },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', currency: { symbol: 'Q', code: 'GTQ', name: 'Guatemalan Quetzal' } },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', currency: { symbol: 'L', code: 'HNL', name: 'Honduran Lempira' } },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', currency: { symbol: 'C$', code: 'NIO', name: 'Nicaraguan Córdoba' } },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', currency: { symbol: 'B/.', code: 'PAB', name: 'Panamanian Balboa' } },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', currency: { symbol: '$', code: 'USD', name: 'US Dollar' } },
  
  // Oceania
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', currency: { symbol: '$', code: 'FJD', name: 'Fijian Dollar' } },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', currency: { symbol: 'K', code: 'PGK', name: 'Papua New Guinean Kina' } },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧', currency: { symbol: '$', code: 'SBD', name: 'Solomon Islands Dollar' } },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', currency: { symbol: 'VT', code: 'VUV', name: 'Vanuatu Vatu' } },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨', currency: { symbol: '₣', code: 'XPF', name: 'CFP Franc' } },
  { code: 'PF', name: 'French Polynesia', flag: '🇵🇫', currency: { symbol: '₣', code: 'XPF', name: 'CFP Franc' } },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', currency: { symbol: 'T', code: 'WST', name: 'Samoan Tala' } },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', currency: { symbol: 'T$', code: 'TOP', name: 'Tongan Paʻanga' } },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮', currency: { symbol: '$', code: 'AUD', name: 'Australian Dollar' } },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', currency: { symbol: '$', code: 'AUD', name: 'Australian Dollar' } },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷', currency: { symbol: '$', code: 'AUD', name: 'Australian Dollar' } },
  { code: 'PW', name: 'Palau', flag: '🇵🇼', currency: { symbol: '$', code: 'USD', name: 'US Dollar' } },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲', currency: { symbol: '$', code: 'USD', name: 'US Dollar' } },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭', currency: { symbol: '$', code: 'USD', name: 'US Dollar' } },
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
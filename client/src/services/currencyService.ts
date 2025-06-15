// Currency conversion service with real-time exchange rates
export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyConversionResult {
  success: boolean;
  rates?: ExchangeRates;
  error?: string;
}

class CurrencyService {
  private rates: ExchangeRates = {};
  private lastUpdated: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly API_KEY = 'demo'; // Using demo API, replace with real key for production

  async getExchangeRates(baseCurrency: string = 'USD'): Promise<CurrencyConversionResult> {
    const now = Date.now();
    
    // Return cached rates if still valid
    if (this.rates[baseCurrency] && (now - this.lastUpdated) < this.CACHE_DURATION) {
      return { success: true, rates: this.rates };
    }

    try {
      // Using exchangerate-api.com (free tier)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.rates) {
        this.rates = data.rates;
        this.lastUpdated = now;
        return { success: true, rates: data.rates };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.warn('Failed to fetch live exchange rates, using fallback rates:', error);
      
      // Fallback to static rates if API fails
      const fallbackRates = this.getFallbackRates(baseCurrency);
      return { success: true, rates: fallbackRates };
    }
  }

  private getFallbackRates(baseCurrency: string): ExchangeRates {
    // Static fallback rates (approximate values)
    const staticRates: { [key: string]: ExchangeRates } = {
      USD: {
        USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, CAD: 1.25, AUD: 1.35,
        CNY: 6.45, INR: 74.5, KRW: 1180, SGD: 1.35, HKD: 7.8, CHF: 0.92,
        NOK: 8.5, SEK: 8.8, DKK: 6.3, NZD: 1.42, MXN: 20.1, BRL: 5.2,
        ARS: 98.5, CLP: 800, COP: 3800, PEN: 3.6, ZAR: 14.8, EGP: 15.7,
        NGN: 411, KES: 108, MAD: 9.0, TND: 2.8, RUB: 74, TRY: 8.5,
        SAR: 3.75, AED: 3.67, QAR: 3.64, KWD: 0.30, BHD: 0.38, OMR: 0.38,
        ILS: 3.25, THB: 31.5, VND: 23000, MYR: 4.15, IDR: 14300, PHP: 50.5,
        BDT: 85, PKR: 160, LKR: 200, NPR: 119, MMK: 1400, KHR: 4080,
        LAK: 9500, MNT: 2850, KZT: 425, UZS: 10600
      }
    };

    if (staticRates[baseCurrency]) {
      return staticRates[baseCurrency];
    }

    // If base currency not found, convert from USD
    const usdRates = staticRates.USD;
    const baseRate = usdRates[baseCurrency] || 1;
    const convertedRates: ExchangeRates = {};

    Object.entries(usdRates).forEach(([currency, rate]) => {
      convertedRates[currency] = rate / baseRate;
    });

    return convertedRates;
  }

  async convertAmount(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const result = await this.getExchangeRates(fromCurrency);
    
    if (result.success && result.rates) {
      const rate = result.rates[toCurrency];
      if (rate) {
        return amount * rate;
      }
    }

    // Fallback: return original amount if conversion fails
    console.warn(`Failed to convert ${fromCurrency} to ${toCurrency}`);
    return amount;
  }

  async convertExpenseData(
    expenses: any[], 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<any[]> {
    if (fromCurrency === toCurrency) {
      return expenses;
    }

    const result = await this.getExchangeRates(fromCurrency);
    
    if (!result.success || !result.rates) {
      return expenses;
    }

    const rate = result.rates[toCurrency];
    if (!rate) {
      return expenses;
    }

    return expenses.map(expense => ({
      ...expense,
      amount: expense.amount * rate,
      originalAmount: expense.originalAmount || expense.amount,
      originalCurrency: expense.originalCurrency || fromCurrency
    }));
  }

  async convertCardData(
    cards: any[], 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<any[]> {
    if (fromCurrency === toCurrency) {
      return cards;
    }

    const result = await this.getExchangeRates(fromCurrency);
    
    if (!result.success || !result.rates) {
      return cards;
    }

    const rate = result.rates[toCurrency];
    if (!rate) {
      return cards;
    }

    return cards.map(card => ({
      ...card,
      balance: card.balance * rate,
      originalBalance: card.originalBalance || card.balance,
      originalCurrency: card.originalCurrency || fromCurrency
    }));
  }

  // Get currency symbol for display
  getCurrencySymbol(currencyCode: string): string {
    const symbols: { [key: string]: string } = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$',
      CNY: '¥', INR: '₹', KRW: '₩', SGD: 'S$', HKD: 'HK$', CHF: 'CHF',
      NOK: 'kr', SEK: 'kr', DKK: 'kr', NZD: 'NZ$', MXN: '$', BRL: 'R$',
      ARS: '$', CLP: '$', COP: '$', PEN: 'S/', ZAR: 'R', EGP: '£',
      NGN: '₦', KES: 'KSh', MAD: 'MAD', TND: 'د.ت', RUB: '₽', TRY: '₺',
      SAR: '﷼', AED: 'د.إ', QAR: '﷼', KWD: 'د.ك', BHD: '.د.ب', OMR: '﷼',
      ILS: '₪', THB: '฿', VND: '₫', MYR: 'RM', IDR: 'Rp', PHP: '₱',
      BDT: '৳', PKR: '₨', LKR: '₨', NPR: '₨', MMK: 'K', KHR: '៛',
      LAK: '₭', MNT: '₮', KZT: '₸', UZS: 'лв'
    };
    
    return symbols[currencyCode] || currencyCode;
  }
}

export const currencyService = new CurrencyService();
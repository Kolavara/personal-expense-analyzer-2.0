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
    // Static fallback rates (approximate values) - Updated with more currencies
    const staticRates: { [key: string]: ExchangeRates } = {
      USD: {
        // Major currencies
        USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, CAD: 1.25, AUD: 1.35,
        CNY: 6.45, INR: 74.5, KRW: 1180, SGD: 1.35, HKD: 7.8, CHF: 0.92,
        NOK: 8.5, SEK: 8.8, DKK: 6.3, NZD: 1.42, MXN: 20.1, BRL: 5.2,
        
        // European currencies
        PLN: 3.9, CZK: 21.5, HUF: 295, RON: 4.1, BGN: 1.66, RSD: 100,
        BAM: 1.66, MKD: 52.3, ALL: 103, MDL: 17.8, UAH: 27.5, BYN: 2.5,
        ISK: 125, TRY: 8.5, RUB: 74,
        
        // Middle East & Africa
        SAR: 3.75, AED: 3.67, QAR: 3.64, KWD: 0.30, BHD: 0.38, OMR: 0.38,
        ILS: 3.25, IRR: 42000, IQD: 1460, SYP: 2500, LBP: 1500, JOD: 0.71,
        YER: 250, ZAR: 14.8, EGP: 15.7, NGN: 411, KES: 108, MAD: 9.0,
        TND: 2.8, DZD: 135, LYD: 4.5, SDG: 55, ETB: 44, GHS: 6.1,
        XOF: 558, XAF: 558, GNF: 8600, SLL: 10300, LRD: 170, CDF: 2000,
        AOA: 650, ZMW: 16.5, BWP: 11.2, NAD: 14.8, SZL: 14.8, LSL: 14.8,
        MWK: 820, MZN: 64, MGA: 4000, MUR: 40, SCR: 13.4, UGX: 3600,
        TZS: 2300, RWF: 1000, BIF: 2000, DJF: 178, SOS: 580, ERN: 15,
        
        // Americas
        ARS: 98.5, CLP: 800, COP: 3800, PEN: 3.6, VES: 4.2, BOB: 6.9,
        PYG: 6900, UYU: 43.5, GYD: 209, SRD: 14.3, CUP: 24, DOP: 57,
        HTG: 113, JMD: 154, TTD: 6.8, BBD: 2, BSD: 1, BZD: 2,
        CRC: 620, GTQ: 7.7, HNL: 24.6, NIO: 35.3, PAB: 1,
        
        // Asia-Pacific
        THB: 31.5, VND: 23000, MYR: 4.15, IDR: 14300, PHP: 50.5,
        BDT: 85, PKR: 160, LKR: 200, NPR: 119, MMK: 1400, KHR: 4080,
        LAK: 9500, BND: 1.35, MNT: 2850, KZT: 425, UZS: 10600,
        KGS: 84.7, TJS: 11.3, TMT: 3.5, AFN: 87, TWD: 28,
        
        // Oceania
        FJD: 2.1, PGK: 3.5, SBD: 8.2, VUV: 112, XPF: 101, WST: 2.6,
        TOP: 2.3, FKP: 0.73
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
      // Major currencies
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$',
      CNY: '¥', INR: '₹', KRW: '₩', SGD: 'S$', HKD: 'HK$', CHF: 'CHF',
      NOK: 'kr', SEK: 'kr', DKK: 'kr', NZD: 'NZ$', MXN: '$', BRL: 'R$',
      
      // European currencies
      PLN: 'zł', CZK: 'Kč', HUF: 'Ft', RON: 'lei', BGN: 'лв', RSD: 'дин',
      BAM: 'KM', MKD: 'ден', ALL: 'L', MDL: 'L', UAH: '₴', BYN: 'Br',
      ISK: 'kr', TRY: '₺', RUB: '₽',
      
      // Middle East & Africa
      SAR: '﷼', AED: 'د.إ', QAR: '﷼', KWD: 'د.ك', BHD: '.د.ب', OMR: '﷼',
      ILS: '₪', IRR: '﷼', IQD: 'ع.د', SYP: '£', LBP: '£', JOD: 'د.ا',
      YER: '﷼', ZAR: 'R', EGP: '£', NGN: '₦', KES: 'KSh', MAD: 'MAD',
      TND: 'د.ت', DZD: 'د.ج', LYD: 'ل.د', SDG: 'ج.س.', ETB: 'Br', GHS: '¢',
      XOF: 'CFA', XAF: 'FCFA', GNF: 'FG', SLL: 'Le', LRD: '$', CDF: 'FC',
      AOA: 'Kz', ZMW: 'ZK', BWP: 'P', NAD: '$', SZL: 'L', LSL: 'L',
      MWK: 'MK', MZN: 'MT', MGA: 'Ar', MUR: '₨', SCR: '₨', UGX: 'USh',
      TZS: 'TSh', RWF: 'FRw', BIF: 'FBu', DJF: 'Fdj', SOS: 'S', ERN: 'Nfk',
      
      // Americas
      ARS: '$', CLP: '$', COP: '$', PEN: 'S/', VES: 'Bs', BOB: '$b',
      PYG: 'Gs', UYU: '$U', GYD: '$', SRD: '$', CUP: '$', DOP: 'RD$',
      HTG: 'G', JMD: 'J$', TTD: 'TT$', BBD: '$', BSD: '$', BZD: 'BZ$',
      CRC: '₡', GTQ: 'Q', HNL: 'L', NIO: 'C$', PAB: 'B/.',
      
      // Asia-Pacific
      THB: '฿', VND: '₫', MYR: 'RM', IDR: 'Rp', PHP: '₱',
      BDT: '৳', PKR: '₨', LKR: '₨', NPR: '₨', MMK: 'K', KHR: '៛',
      LAK: '₭', BND: 'B$', MNT: '₮', KZT: '₸', UZS: 'лв',
      KGS: 'лв', TJS: 'SM', TMT: 'T', AFN: '؋', TWD: 'NT$',
      
      // Oceania
      FJD: '$', PGK: 'K', SBD: '$', VUV: 'VT', XPF: '₣', WST: 'T',
      TOP: 'T$', FKP: '£'
    };
    
    return symbols[currencyCode] || currencyCode;
  }

  // Get formatted currency display
  formatCurrency(amount: number, currencyCode: string): string {
    const symbol = this.getCurrencySymbol(currencyCode);
    return `${symbol}${amount.toFixed(2)}`;
  }

  // Get currency name
  getCurrencyName(currencyCode: string): string {
    const names: { [key: string]: string } = {
      USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
      CAD: 'Canadian Dollar', AUD: 'Australian Dollar', CNY: 'Chinese Yuan',
      INR: 'Indian Rupee', KRW: 'South Korean Won', SGD: 'Singapore Dollar',
      HKD: 'Hong Kong Dollar', CHF: 'Swiss Franc', NOK: 'Norwegian Krone',
      SEK: 'Swedish Krona', DKK: 'Danish Krone', NZD: 'New Zealand Dollar',
      MXN: 'Mexican Peso', BRL: 'Brazilian Real', RUB: 'Russian Ruble',
      TRY: 'Turkish Lira', ZAR: 'South African Rand', PLN: 'Polish Zloty',
      CZK: 'Czech Koruna', HUF: 'Hungarian Forint', THB: 'Thai Baht',
      MYR: 'Malaysian Ringgit', IDR: 'Indonesian Rupiah', PHP: 'Philippine Peso',
      VND: 'Vietnamese Dong', SAR: 'Saudi Riyal', AED: 'UAE Dirham',
      QAR: 'Qatari Riyal', KWD: 'Kuwaiti Dinar', BHD: 'Bahraini Dinar',
      OMR: 'Omani Rial', ILS: 'Israeli Shekel', EGP: 'Egyptian Pound',
      NGN: 'Nigerian Naira', KES: 'Kenyan Shilling', MAD: 'Moroccan Dirham',
      TND: 'Tunisian Dinar', ARS: 'Argentine Peso', CLP: 'Chilean Peso',
      COP: 'Colombian Peso', PEN: 'Peruvian Sol', PKR: 'Pakistani Rupee',
      BDT: 'Bangladeshi Taka', LKR: 'Sri Lankan Rupee', NPR: 'Nepalese Rupee'
    };
    
    return names[currencyCode] || currencyCode;
  }
}

export const currencyService = new CurrencyService();
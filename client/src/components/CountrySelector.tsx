import React, { useState, useContext } from 'react';
import { ChevronDown, Search, Globe } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';

const CountrySelector: React.FC = () => {
  const { selectedCountry, countries, setSelectedCountry } = useContext(ExpenseContext);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: typeof selectedCountry) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 aeos-glass border border-cyan-400/30 rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 group"
        style={{
          boxShadow: isOpen ? '0 0 20px rgba(0, 255, 255, 0.3)' : 'none'
        }}
      >
        <Globe className="text-cyan-400/70 group-hover:text-cyan-400" size={16} />
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{selectedCountry.flag}</span>
          <div className="text-left">
            <div className="text-cyan-400 font-medium text-sm">{selectedCountry.code}</div>
            <div className="text-cyan-300/70 text-xs">{selectedCountry.name}</div>
          </div>
        </div>
        <ChevronDown 
          className={`text-cyan-400/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={16} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 aeos-glass border border-cyan-400/30 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden"
             style={{
               boxShadow: '0 20px 40px rgba(0, 255, 255, 0.2), 0 0 60px rgba(0, 255, 255, 0.1)'
             }}>
          {/* Search */}
          <div className="p-4 border-b border-cyan-400/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70" size={16} />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all text-sm"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-cyan-400/10 transition-all duration-300 text-left group ${
                  selectedCountry.code === country.code ? 'bg-cyan-400/10 border-r-2 border-cyan-400' : ''
                }`}
              >
                <span className="text-xl">{country.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-medium text-sm group-hover:text-cyan-300">{country.code}</span>
                    <span className="text-cyan-400 font-mono text-sm" style={{
                      textShadow: selectedCountry.code === country.code ? '0 0 10px rgba(0, 255, 255, 0.6)' : 'none'
                    }}>
                      {country.currency.symbol}
                    </span>
                  </div>
                  <div className="text-cyan-300/70 text-xs">{country.name}</div>
                  <div className="text-cyan-400/60 text-xs">{country.currency.name} ({country.currency.code})</div>
                </div>
              </button>
            ))}
          </div>

          {filteredCountries.length === 0 && (
            <div className="p-4 text-center text-cyan-400/60 text-sm">
              No countries found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CountrySelector;
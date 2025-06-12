import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { PieChart } from 'lucide-react';

const ExpenseChart: React.FC = () => {
  const { expenses, totalExpenses, selectedCountry } = useContext(ExpenseContext);

  const formatCurrency = (amount: number) => {
    return `${selectedCountry.currency.symbol}${amount.toFixed(2)}`;
  };

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
  }));

  const colors = [
    '#00ff00', '#00cc88', '#00aa66', '#008844', '#006622',
    '#ffaa00', '#ff8800', '#ff6600', '#ff4400', '#ff2200'
  ];

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-400/10 flex items-center justify-center">
          <PieChart className="text-cyan-400 opacity-40" size={32} />
        </div>
        <h4 className="text-lg font-semibold text-cyan-400 mb-2" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>No data available</h4>
        <p className="text-cyan-400/60">Add expenses to see the distribution chart</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pie Chart Representation */}
      <div className="relative flex items-center justify-center">
        <div className="w-48 h-48 rounded-full relative overflow-hidden">
          {chartData.map((item, index) => {
            const startAngle = chartData.slice(0, index).reduce((sum, prev) => sum + (prev.percentage * 3.6), 0);
            const endAngle = startAngle + (item.percentage * 3.6);
            
            return (
              <div
                key={item.category}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from ${startAngle}deg, ${colors[index % colors.length]} ${item.percentage}%, transparent ${item.percentage}%)`,
                  transform: `rotate(${startAngle}deg)`
                }}
              />
            );
          })}
          <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-cyan-400/60">Total</p>
              <p className="text-lg font-bold text-cyan-400" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>{formatCurrency(totalExpenses).replace(/\.\d{2}$/, '')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {chartData.map((item, index) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-cyan-400 font-medium">{item.category}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-cyan-400" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'}}>{formatCurrency(item.amount)}</p>
              <p className="text-xs text-cyan-400/60">{item.percentage.toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;
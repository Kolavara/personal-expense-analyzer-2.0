import React, { useContext } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';

const Analytics: React.FC = () => {
  const { expenses, totalExpenses } = useContext(ExpenseContext);

  // Calculate monthly trends
  const getMonthlyTrends = () => {
    const monthlyData: { [key: string]: number } = {};
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });
    return Object.entries(monthlyData).slice(-6);
  };

  const monthlyTrends = getMonthlyTrends();
  const currentMonth = monthlyTrends[monthlyTrends.length - 1]?.[1] || 0;
  const previousMonth = monthlyTrends[monthlyTrends.length - 2]?.[1] || 0;
  const monthlyChange = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  // Top categories
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Average transaction by day of week
  const dayOfWeekSpending = expenses.reduce((acc, expense) => {
    const day = new Date(expense.date).toLocaleDateString('en-US', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-tight" style={{
          textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)'
        }}>
          Financial Analytics
        </h1>
        <p className="text-cyan-300/80 text-lg">
          Deep insights into your spending patterns and trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="matrix-card p-6 rounded-lg hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400/70 text-sm mb-1">Monthly Change</p>
              <p className={`text-2xl font-bold ${monthlyChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
              </p>
            </div>
            {monthlyChange >= 0 ? 
              <TrendingUp className="text-red-400 opacity-60" size={24} /> :
              <TrendingDown className="text-green-400 opacity-60" size={24} />
            }
          </div>
        </div>

        <div className="matrix-card p-6 rounded-lg hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400/70 text-sm mb-1">Daily Average</p>
              <p className="text-2xl font-bold matrix-glow">
                ${expenses.length > 0 ? (totalExpenses / Math.max(1, Math.ceil((Date.now() - new Date(expenses[0]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2) : '0.00'}
              </p>
            </div>
            <BarChart3 className="text-green-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="matrix-card p-6 rounded-lg hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400/70 text-sm mb-1">Largest Expense</p>
              <p className="text-2xl font-bold matrix-glow">
                ${Math.max(...expenses.map(e => e.amount), 0).toFixed(2)}
              </p>
            </div>
            <TrendingUp className="text-green-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="matrix-card p-6 rounded-lg hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400/70 text-sm mb-1">Categories</p>
              <p className="text-2xl font-bold matrix-glow">{Object.keys(categoryTotals).length}</p>
            </div>
            <PieChart className="text-green-400 opacity-60" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends */}
        <div className="matrix-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold matrix-glow mb-6">Monthly Spending Trends</h3>
          <div className="space-y-4">
            {monthlyTrends.map(([month, amount], index) => {
              const maxAmount = Math.max(...monthlyTrends.map(([, amt]) => amt));
              const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
              
              return (
                <div key={month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-medium">{month}</span>
                    <span className="matrix-glow font-bold">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-green-400 h-3 rounded-full transition-all duration-1000 delay-${index * 100}"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Categories */}
        <div className="matrix-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold matrix-glow mb-6">Top Spending Categories</h3>
          <div className="space-y-4">
            {topCategories.map(([category, amount], index) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-medium">{category}</span>
                    <div className="text-right">
                      <span className="matrix-glow font-bold">${amount.toFixed(2)}</span>
                      <span className="text-green-400/60 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 delay-${index * 100}"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day of Week Analysis */}
      <div className="matrix-card p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold matrix-glow mb-6">Spending by Day of Week</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {Object.entries(dayOfWeekSpending).map(([day, amount]) => {
            const maxDayAmount = Math.max(...Object.values(dayOfWeekSpending));
            const percentage = maxDayAmount > 0 ? (amount / maxDayAmount) * 100 : 0;
            
            return (
              <div key={day} className="text-center">
                <div className="mb-2">
                  <div 
                    className="bg-green-400 rounded-full mx-auto transition-all duration-1000"
                    style={{ 
                      width: '40px', 
                      height: `${Math.max(20, percentage)}px`,
                      maxHeight: '100px'
                    }}
                  ></div>
                </div>
                <p className="text-sm font-medium text-green-400">{day.slice(0, 3)}</p>
                <p className="text-xs matrix-glow">${amount.toFixed(0)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="matrix-card p-6 rounded-lg">
        <h3 className="text-xl font-semibold matrix-glow mb-6">Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-lg font-semibold matrix-glow mb-2">Spending Frequency</h4>
            <p className="text-2xl font-bold text-green-400 mb-2">
              {expenses.length > 0 ? (expenses.length / Math.max(1, monthlyTrends.length)).toFixed(1) : '0'}
            </p>
            <p className="text-sm text-green-400/60">transactions per month</p>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-lg font-semibold matrix-glow mb-2">Most Active Day</h4>
            <p className="text-2xl font-bold text-green-400 mb-2">
              {Object.entries(dayOfWeekSpending).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
            </p>
            <p className="text-sm text-green-400/60">highest spending day</p>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-lg font-semibold matrix-glow mb-2">Trend Direction</h4>
            <p className={`text-2xl font-bold mb-2 ${monthlyChange <= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {monthlyChange <= 0 ? 'Decreasing' : 'Increasing'}
            </p>
            <p className="text-sm text-green-400/60">monthly spending trend</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
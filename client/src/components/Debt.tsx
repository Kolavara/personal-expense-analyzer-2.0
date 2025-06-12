import React, { useState, useContext } from 'react';
import { Plus, TrendingDown, Calculator, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';

interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  minimumPayment: number;
  dueDate: string;
  type: 'credit_card' | 'student_loan' | 'mortgage' | 'personal_loan' | 'other';
}

const Debt: React.FC = () => {
  const { selectedCountry } = useContext(ExpenseContext);
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: '1',
      name: 'Credit Card - Chase',
      totalAmount: 5000,
      currentBalance: 3200,
      interestRate: 18.99,
      monthlyPayment: 150,
      minimumPayment: 64,
      dueDate: '2024-07-15',
      type: 'credit_card'
    },
    {
      id: '2',
      name: 'Student Loan',
      totalAmount: 25000,
      currentBalance: 18500,
      interestRate: 4.5,
      monthlyPayment: 280,
      minimumPayment: 250,
      dueDate: '2024-07-01',
      type: 'student_loan'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: '',
    totalAmount: '',
    currentBalance: '',
    interestRate: '',
    monthlyPayment: '',
    minimumPayment: '',
    dueDate: '',
    type: 'credit_card' as const
  });

  const formatCurrency = (amount: number) => {
    return `${selectedCountry.currency.symbol}${amount.toFixed(2)}`;
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDebt.name && newDebt.totalAmount && newDebt.currentBalance && newDebt.monthlyPayment) {
      const debt: Debt = {
        id: Date.now().toString(),
        name: newDebt.name,
        totalAmount: parseFloat(newDebt.totalAmount),
        currentBalance: parseFloat(newDebt.currentBalance),
        interestRate: parseFloat(newDebt.interestRate) || 0,
        monthlyPayment: parseFloat(newDebt.monthlyPayment),
        minimumPayment: parseFloat(newDebt.minimumPayment) || parseFloat(newDebt.monthlyPayment),
        dueDate: newDebt.dueDate,
        type: newDebt.type
      };
      setDebts([...debts, debt]);
      setNewDebt({
        name: '',
        totalAmount: '',
        currentBalance: '',
        interestRate: '',
        monthlyPayment: '',
        minimumPayment: '',
        dueDate: '',
        type: 'credit_card'
      });
      setShowAddForm(false);
    }
  };

  const calculatePayoffTime = (debt: Debt) => {
    if (debt.monthlyPayment <= 0 || debt.interestRate <= 0) return 'N/A';
    
    const monthlyRate = debt.interestRate / 100 / 12;
    const months = Math.log(1 + (debt.currentBalance * monthlyRate) / debt.monthlyPayment) / Math.log(1 + monthlyRate);
    
    if (months <= 0 || !isFinite(months)) return 'N/A';
    
    const years = Math.floor(months / 12);
    const remainingMonths = Math.ceil(months % 12);
    
    if (years > 0) {
      return `${years}y ${remainingMonths}m`;
    }
    return `${Math.ceil(months)}m`;
  };

  const calculateTotalInterest = (debt: Debt) => {
    if (debt.monthlyPayment <= 0 || debt.interestRate <= 0) return 0;
    
    const monthlyRate = debt.interestRate / 100 / 12;
    const months = Math.log(1 + (debt.currentBalance * monthlyRate) / debt.monthlyPayment) / Math.log(1 + monthlyRate);
    
    if (months <= 0 || !isFinite(months)) return 0;
    
    return (debt.monthlyPayment * months) - debt.currentBalance;
  };

  const getDebtTypeIcon = (type: string) => {
    switch (type) {
      case 'credit_card': return '💳';
      case 'student_loan': return '🎓';
      case 'mortgage': return '🏠';
      case 'personal_loan': return '💰';
      default: return '📄';
    }
  };

  const getDebtStatus = (debt: Debt) => {
    const progress = ((debt.totalAmount - debt.currentBalance) / debt.totalAmount) * 100;
    if (progress >= 80) return { status: 'excellent', color: 'text-cyan-400', bgColor: 'bg-cyan-400' };
    if (progress >= 50) return { status: 'good', color: 'text-blue-400', bgColor: 'bg-blue-400' };
    if (progress >= 25) return { status: 'fair', color: 'text-yellow-400', bgColor: 'bg-yellow-400' };
    return { status: 'needs_attention', color: 'text-red-400', bgColor: 'bg-red-400' };
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  const averageInterestRate = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length 
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-tight" style={{
          textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)'
        }}>
          Debt Management
        </h1>
        <p className="text-cyan-300/80 text-lg">
          Track your debts and calculate payoff timelines
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="aeos-card aeos-interactive aeos-parallax p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/70 text-sm mb-1">Total Debt</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalDebt)}</p>
            </div>
            <TrendingDown className="text-red-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="aeos-card aeos-interactive aeos-parallax p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/70 text-sm mb-1">Monthly Payments</p>
              <p className="text-2xl font-bold text-cyan-400" style={{textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'}}>{formatCurrency(totalMonthlyPayments)}</p>
            </div>
            <Calendar className="text-cyan-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="aeos-card aeos-interactive aeos-parallax p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/70 text-sm mb-1">Avg Interest Rate</p>
              <p className="text-2xl font-bold text-yellow-400">{averageInterestRate.toFixed(1)}%</p>
            </div>
            <Calculator className="text-yellow-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="aeos-card aeos-interactive aeos-parallax p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/70 text-sm mb-1">Active Debts</p>
              <p className="text-2xl font-bold text-cyan-400" style={{textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'}}>{debts.length}</p>
            </div>
            <AlertTriangle className="text-cyan-400 opacity-60" size={24} />
          </div>
        </div>
      </div>

      {/* Add Debt Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="aeos-button-primary px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Debt</span>
        </button>
      </div>

      {/* Add Debt Form */}
      {showAddForm && (
        <div className="aeos-card aeos-interactive p-6 mb-8">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>Add New Debt</h3>
          <form onSubmit={handleAddDebt} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Debt Name (e.g., Credit Card, Student Loan)"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              required
            />
            <select
              value={newDebt.type}
              onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value as any })}
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
            >
              <option value="credit_card">Credit Card</option>
              <option value="student_loan">Student Loan</option>
              <option value="mortgage">Mortgage</option>
              <option value="personal_loan">Personal Loan</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Total Amount"
              step="0.01"
              value={newDebt.totalAmount}
              onChange={(e) => setNewDebt({ ...newDebt, totalAmount: e.target.value })}
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              required
            />
            <input
              type="number"
              placeholder="Current Balance"
              step="0.01"
              value={newDebt.currentBalance}
              onChange={(e) => setNewDebt({ ...newDebt, currentBalance: e.target.value })}
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              required
            />
            <input
              type="number"
              placeholder="Interest Rate (%)"
              step="0.01"
              value={newDebt.interestRate}
              onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
            />
            <input
              type="number"
              placeholder="Monthly Payment"
              step="0.01"
              value={newDebt.monthlyPayment}
              onChange={(e) => setNewDebt({ ...newDebt, monthlyPayment: e.target.value })}
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
              required
            />
            <input
              type="number"
              placeholder="Minimum Payment"
              step="0.01"
              value={newDebt.minimumPayment}
              onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: e.target.value })}
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
            />
            <input
              type="date"
              placeholder="Next Due Date"
              value={newDebt.dueDate}
              onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
              className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded-lg text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="flex-1 aeos-button-primary py-3 rounded-lg font-semibold"
              >
                Add Debt
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 aeos-button py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Debt Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {debts.map((debt) => {
          const progress = ((debt.totalAmount - debt.currentBalance) / debt.totalAmount) * 100;
          const status = getDebtStatus(debt);
          const payoffTime = calculatePayoffTime(debt);
          const totalInterest = calculateTotalInterest(debt);

          return (
            <div key={debt.id} className="aeos-card aeos-interactive aeos-parallax p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getDebtTypeIcon(debt.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400">{debt.name}</h3>
                    <p className="text-sm text-cyan-400/60 capitalize">{debt.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color} bg-cyan-400/10`}>
                  {status.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-cyan-400/70">Progress</span>
                  <span className={`text-sm font-semibold ${status.color}`}>
                    {progress.toFixed(1)}% paid off
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${status.bgColor}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Debt Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-cyan-400/70 text-sm">Current Balance</p>
                  <p className="text-lg font-bold text-red-400">{formatCurrency(debt.currentBalance)}</p>
                </div>
                <div>
                  <p className="text-cyan-400/70 text-sm">Monthly Payment</p>
                  <p className="text-lg font-bold text-cyan-400" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>{formatCurrency(debt.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-cyan-400/70 text-sm">Interest Rate</p>
                  <p className="text-lg font-bold text-yellow-400">{debt.interestRate.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-cyan-400/70 text-sm">Payoff Time</p>
                  <p className="text-lg font-bold text-blue-400">{payoffTime}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-cyan-400/20">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-400/70">Total Interest:</span>
                  <span className="font-semibold text-red-400">{formatCurrency(totalInterest)}</span>
                </div>
                {debt.dueDate && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-cyan-400/70">Next Due:</span>
                    <span className="font-semibold text-cyan-400">{debt.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {debts.length === 0 && !showAddForm && (
        <div className="aeos-card aeos-interactive p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-400/10 flex items-center justify-center">
            <CheckCircle className="text-cyan-400 opacity-40" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-2" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6)'}}>No debts tracked yet</h3>
          <p className="text-cyan-400/60 mb-6">Add your first debt to start managing your payoff strategy</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="aeos-button-primary px-6 py-3 rounded-lg"
          >
            Add First Debt
          </button>
        </div>
      )}

      {/* Debt Payoff Strategy */}
      {debts.length > 0 && (
        <div className="aeos-card aeos-interactive p-6">
          <h3 className="text-xl font-semibold text-cyan-400 mb-6" style={{textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'}}>Payoff Strategy Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cyan-400/5 p-4 rounded-lg border border-cyan-400/20">
              <h4 className="font-semibold text-cyan-400 mb-2">🔥 Avalanche Method</h4>
              <p className="text-sm text-cyan-400/70 mb-3">Pay minimums on all debts, then focus extra payments on highest interest rate debt first.</p>
              <div className="space-y-2">
                {[...debts].sort((a, b) => b.interestRate - a.interestRate).slice(0, 3).map((debt, index) => (
                  <div key={debt.id} className="flex justify-between items-center text-sm">
                    <span className="text-cyan-400">#{index + 1} {debt.name}</span>
                    <span className="text-yellow-400">{debt.interestRate.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-cyan-400/5 p-4 rounded-lg border border-cyan-400/20">
              <h4 className="font-semibold text-cyan-400 mb-2">⚡ Snowball Method</h4>
              <p className="text-sm text-cyan-400/70 mb-3">Pay minimums on all debts, then focus extra payments on smallest balance first for psychological wins.</p>
              <div className="space-y-2">
                {[...debts].sort((a, b) => a.currentBalance - b.currentBalance).slice(0, 3).map((debt, index) => (
                  <div key={debt.id} className="flex justify-between items-center text-sm">
                    <span className="text-cyan-400">#{index + 1} {debt.name}</span>
                    <span className="text-red-400">{formatCurrency(debt.currentBalance).replace(/\.\d{2}$/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debt;
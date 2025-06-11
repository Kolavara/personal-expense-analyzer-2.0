import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Copy, Edit, Trash2, Shield, AlertTriangle, Key, Lock, Check, X } from 'lucide-react';

interface BankCredential {
  id: string;
  bankName: string;
  username: string;
  password: string;
  notes: string;
  lastUpdated: string;
  website?: string;
}

const Passwords: React.FC = () => {
  const [credentials, setCredentials] = useState<BankCredential[]>([
    {
      id: '1',
      bankName: 'Chase Bank',
      username: 'john.doe@email.com',
      password: 'SecurePass123!',
      notes: 'Main checking account',
      lastUpdated: '2024-06-01',
      website: 'chase.com'
    },
    {
      id: '2',
      bankName: 'Wells Fargo',
      username: 'johndoe2024',
      password: 'MyBank$ecure456',
      notes: 'Savings account',
      lastUpdated: '2024-05-15',
      website: 'wellsfargo.com'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [editingCredential, setEditingCredential] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    bankName: '',
    username: '',
    password: '',
    notes: '',
    website: ''
  });
  const [newCredential, setNewCredential] = useState({
    bankName: '',
    username: '',
    password: '',
    notes: '',
    website: ''
  });

  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCredential.bankName && newCredential.username && newCredential.password) {
      const credential: BankCredential = {
        id: Date.now().toString(),
        bankName: newCredential.bankName,
        username: newCredential.username,
        password: newCredential.password,
        notes: newCredential.notes,
        website: newCredential.website,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setCredentials([...credentials, credential]);
      setNewCredential({
        bankName: '',
        username: '',
        password: '',
        notes: '',
        website: ''
      });
      setShowAddForm(false);
    }
  };

  const startEdit = (credential: BankCredential) => {
    setEditingCredential(credential.id);
    setEditFormData({
      bankName: credential.bankName,
      username: credential.username,
      password: credential.password,
      notes: credential.notes,
      website: credential.website || ''
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCredential && editFormData.bankName && editFormData.username && editFormData.password) {
      setCredentials(prev => prev.map(cred => 
        cred.id === editingCredential 
          ? {
              ...cred,
              bankName: editFormData.bankName,
              username: editFormData.username,
              password: editFormData.password,
              notes: editFormData.notes,
              website: editFormData.website,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : cred
      ));
      setEditingCredential(null);
    }
  };

  const cancelEdit = () => {
    setEditingCredential(null);
    setEditFormData({
      bankName: '',
      username: '',
      password: '',
      notes: '',
      website: ''
    });
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deleteCredential = (id: string) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      setCredentials(credentials.filter(cred => cred.id !== id));
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (editingCredential) {
      setEditFormData({ ...editFormData, password });
    } else {
      setNewCredential({ ...newCredential, password });
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 'Weak', color: 'text-red-400', bgColor: 'bg-red-400' };
    if (strength <= 4) return { level: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-400' };
    return { level: 'Strong', color: 'text-emerald-400', bgColor: 'bg-emerald-400' };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-tight" style={{
          textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)'
        }}>
          Bank Passwords
        </h1>
        <p className="text-cyan-300/80 text-lg">
          Securely store your banking credentials
        </p>
      </div>

      {/* Security Warning */}
      <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-2xl p-4 mb-8 flex items-start space-x-3">
        <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
        <div>
          <h3 className="text-yellow-400 font-semibold mb-1">Security Notice</h3>
          <p className="text-yellow-400/80 text-sm">
            This data is stored locally in your browser. For better security, consider using a dedicated password manager like 1Password, Bitwarden, or LastPass for sensitive banking credentials.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300/70 text-sm mb-1">Total Accounts</p>
              <p className="text-2xl font-bold text-cyan-400" style={{textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'}}>{credentials.length}</p>
            </div>
            <Shield className="text-emerald-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="igloo-card p-6 rounded-2xl hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400/70 text-sm mb-1">Strong Passwords</p>
              <p className="text-2xl font-bold text-emerald-400">
                {credentials.filter(cred => getPasswordStrength(cred.password).level === 'Strong').length}
              </p>
            </div>
            <Key className="text-emerald-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="igloo-card p-6 rounded-2xl hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400/70 text-sm mb-1">Weak Passwords</p>
              <p className="text-2xl font-bold text-red-400">
                {credentials.filter(cred => getPasswordStrength(cred.password).level === 'Weak').length}
              </p>
            </div>
            <AlertTriangle className="text-red-400 opacity-60" size={24} />
          </div>
        </div>

        <div className="igloo-card p-6 rounded-2xl hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400/70 text-sm mb-1">Last Updated</p>
              <p className="text-lg font-bold igloo-glow">
                {credentials.length > 0 
                  ? Math.max(...credentials.map(c => new Date(c.lastUpdated).getTime())) > Date.now() - 30*24*60*60*1000 
                    ? 'Recent' 
                    : 'Old'
                  : 'N/A'
                }
              </p>
            </div>
            <Lock className="text-emerald-400 opacity-60" size={24} />
          </div>
        </div>
      </div>

      {/* Add Credential Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="igloo-button px-6 py-3 rounded-xl hover-glow flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Bank Credentials</span>
        </button>
      </div>

      {/* Add Credential Form */}
      {showAddForm && (
        <div className="igloo-card p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-semibold igloo-glow mb-4">Add Bank Credentials</h3>
          <form onSubmit={handleAddCredential} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Bank Name (e.g., Chase Bank)"
                value={newCredential.bankName}
                onChange={(e) => setNewCredential({ ...newCredential, bankName: e.target.value })}
                className="p-3 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                required
              />
              <input
                type="text"
                placeholder="Website (optional)"
                value={newCredential.website}
                onChange={(e) => setNewCredential({ ...newCredential, website: e.target.value })}
                className="p-3 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            </div>
            
            <input
              type="text"
              placeholder="Username/Email"
              value={newCredential.username}
              onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
              className="w-full p-3 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              required
            />
            
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={newCredential.password}
                onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}
                className="w-full p-3 pr-24 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs igloo-button rounded hover-glow"
              >
                Generate
              </button>
            </div>

            {newCredential.password && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-emerald-400/70">Password Strength:</span>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${getPasswordStrength(newCredential.password).color} bg-slate-800/50`}>
                    {getPasswordStrength(newCredential.password).level}
                  </div>
                </div>
              </div>
            )}
            
            <textarea
              placeholder="Notes (Optional) - Security questions, account details, etc."
              value={newCredential.notes}
              onChange={(e) => setNewCredential({ ...newCredential, notes: e.target.value })}
              className="w-full p-3 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 h-24 resize-none"
            />
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 igloo-button py-3 rounded-xl hover-glow font-semibold"
              >
                Save Credentials
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-6 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Credentials List */}
      <div className="space-y-6">
        {credentials.map((credential) => {
          const passwordStrength = getPasswordStrength(credential.password);
          const isVisible = visiblePasswords[credential.id];
          const isEditing = editingCredential === credential.id;

          return (
            <div key={credential.id} className="igloo-card p-6 rounded-2xl hover-glow transition-all duration-300">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-emerald-400">Edit Credentials</h3>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="p-2 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-colors"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-2 text-slate-400/70 hover:text-slate-400 hover:bg-slate-400/10 rounded-xl transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Bank Name"
                      value={editFormData.bankName}
                      onChange={(e) => setEditFormData({ ...editFormData, bankName: e.target.value })}
                      className="p-3 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Website"
                      value={editFormData.website}
                      onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                      className="p-3 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Username/Email"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    className="w-full p-3 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    required
                  />

                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Password"
                      value={editFormData.password}
                      onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                      className="w-full p-3 pr-24 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs igloo-button rounded hover-glow"
                    >
                      Generate
                    </button>
                  </div>

                  <textarea
                    placeholder="Notes"
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    className="w-full p-3 bg-slate-800/50 igloo-border rounded-xl text-emerald-400 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 h-20 resize-none"
                  />
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center">
                        <Shield className="text-emerald-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-emerald-400">{credential.bankName}</h3>
                        {credential.website && (
                          <p className="text-sm text-emerald-400/60">{credential.website}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${passwordStrength.color} bg-slate-800/50`}>
                            {passwordStrength.level}
                          </div>
                          <span className="text-xs text-emerald-400/50">
                            Updated: {credential.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(credential)}
                        className="p-2 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteCredential(credential.id)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Username */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                      <div>
                        <p className="text-sm text-emerald-400/70 mb-1">Username/Email</p>
                        <p className="font-mono text-emerald-400">{credential.username}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(credential.username, 'username')}
                        className="p-2 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm text-emerald-400/70 mb-1">Password</p>
                        <p className="font-mono text-emerald-400">
                          {isVisible ? credential.password : '••••••••••••••••'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => togglePasswordVisibility(credential.id)}
                          className="p-2 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-colors"
                        >
                          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(credential.password, 'password')}
                          className="p-2 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    {credential.notes && (
                      <div className="p-3 bg-slate-800/30 rounded-xl">
                        <p className="text-sm text-emerald-400/70 mb-1">Notes</p>
                        <p className="text-emerald-400 text-sm">{credential.notes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {credentials.length === 0 && !showAddForm && (
        <div className="igloo-card p-12 rounded-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-400/10 flex items-center justify-center">
            <Lock className="text-emerald-400 opacity-40" size={32} />
          </div>
          <h3 className="text-xl font-semibold igloo-glow mb-2">No bank credentials saved yet</h3>
          <p className="text-emerald-400/60 mb-6">Add your first bank credentials to start organizing!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="igloo-button px-6 py-3 rounded-xl hover-glow"
          >
            Add First Credentials
          </button>
        </div>
      )}

      {/* Security Tips */}
      <div className="igloo-card p-6 rounded-2xl mt-8">
        <h3 className="text-xl font-semibold igloo-glow mb-4">Security Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Shield className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
              <div>
                <h4 className="font-semibold text-emerald-400 text-sm">Use Strong Passwords</h4>
                <p className="text-emerald-400/70 text-xs">At least 12 characters with mixed case, numbers, and symbols</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Key className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
              <div>
                <h4 className="font-semibold text-emerald-400 text-sm">Enable 2FA</h4>
                <p className="text-emerald-400/70 text-xs">Always enable two-factor authentication when available</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" size={16} />
              <div>
                <h4 className="font-semibold text-yellow-400 text-sm">Regular Updates</h4>
                <p className="text-emerald-400/70 text-xs">Update passwords regularly, especially after security breaches</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Lock className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
              <div>
                <h4 className="font-semibold text-emerald-400 text-sm">Secure Storage</h4>
                <p className="text-emerald-400/70 text-xs">Consider using dedicated password managers for maximum security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passwords;
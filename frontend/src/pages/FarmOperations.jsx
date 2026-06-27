import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Tractor, Egg, DollarSign, TrendingUp, Minus, Plus } from 'lucide-react';

const FarmOperations = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [henType, setHenType] = useState('Add');
  const [henQuantity, setHenQuantity] = useState('');
  const [henReason, setHenReason] = useState('Sell');
  
  const [prodEggs, setProdEggs] = useState('');
  
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Hen Food');
  const [expReason, setExpReason] = useState('');

  const [revAmount, setRevAmount] = useState('');
  const [revSource, setRevSource] = useState('');

  const fetchSummary = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('/api/farm/summary', config);
      setSummary(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch farm data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user]);

  const handleHenSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/farm/hens', {
        type: henType,
        quantity: Number(henQuantity),
        reason: henType === 'Remove' ? henReason : null
      }, config);
      toast.success('Hen log added!');
      setHenQuantity('');
      fetchSummary();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add hen log');
    }
  };

  const handleProdSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/farm/production', { eggsCollected: Number(prodEggs) }, config);
      toast.success('Production logged!');
      setProdEggs('');
      fetchSummary();
    } catch (error) {
      toast.error('Failed to log production');
    }
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/farm/expenses', {
        amount: Number(expAmount),
        category: expCategory,
        reason: expReason
      }, config);
      toast.success('Expense logged!');
      setExpAmount('');
      setExpReason('');
      fetchSummary();
    } catch (error) {
      toast.error('Failed to log expense');
    }
  };

  const handleRevSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/farm/revenues', {
        amount: Number(revAmount),
        source: revSource
      }, config);
      toast.success('Revenue logged!');
      setRevAmount('');
      setRevSource('');
      fetchSummary();
    } catch (error) {
      toast.error('Failed to log revenue');
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-mountain-brown">Loading Operations Data...</div>;

  return (
    <div className="min-h-screen bg-mountain-sand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-mountain-brown mb-2 flex items-center justify-center gap-3">
            <Tractor className="w-10 h-10 text-mountain-moss" /> Farm Operations
          </h1>
          <p className="text-mountain-gray">Internal Monitoring & Inventory Management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Hen Management */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-mountain-gray/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-mountain-brown flex items-center gap-2">
                <Tractor className="w-6 h-6 text-mountain-gold" /> Hen Inventory
              </h2>
              <span className="bg-mountain-moss/10 text-mountain-moss px-4 py-1 rounded-full font-bold">
                {summary.totalHens} Live Hens
              </span>
            </div>
            
            <form onSubmit={handleHenSubmit} className="space-y-4">
              <div className="flex gap-4">
                <select 
                  className="px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none w-1/3"
                  value={henType}
                  onChange={(e) => setHenType(e.target.value)}
                >
                  <option value="Add">Add Batch</option>
                  <option value="Remove">Remove Hens</option>
                </select>
                <input 
                  type="number" 
                  min="1"
                  required
                  placeholder="Quantity"
                  className="px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none flex-grow"
                  value={henQuantity}
                  onChange={(e) => setHenQuantity(e.target.value)}
                />
              </div>
              {henType === 'Remove' && (
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none"
                  value={henReason}
                  onChange={(e) => setHenReason(e.target.value)}
                >
                  <option value="Sell">Sell (Live)</option>
                  <option value="Death">Death / Illness</option>
                </select>
              )}
              <button className="w-full py-3 bg-mountain-brown text-white rounded-xl font-bold hover:bg-black transition-colors">
                Log Update
              </button>
            </form>
          </div>

          {/* Daily Production */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-mountain-gray/20">
            <h2 className="text-2xl font-bold text-mountain-brown flex items-center gap-2 mb-6">
              <Egg className="w-6 h-6 text-mountain-gold" /> Daily Production
            </h2>
            <form onSubmit={handleProdSubmit} className="space-y-4">
              <input 
                type="number" 
                min="1"
                required
                placeholder="Total Eggs Collected Today"
                className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none"
                value={prodEggs}
                onChange={(e) => setProdEggs(e.target.value)}
              />
              <button className="w-full py-3 bg-mountain-gold text-white rounded-xl font-bold hover:bg-mountain-brown transition-colors">
                Log Production
              </button>
            </form>
          </div>

          {/* Expense Log */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-mountain-gray/20">
            <h2 className="text-2xl font-bold text-mountain-brown flex items-center gap-2 mb-6">
              <Minus className="w-6 h-6 text-red-500" /> Farm Expenses
            </h2>
            <form onSubmit={handleExpSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input 
                  type="number" 
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Amount ($)"
                  className="w-1/2 px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                />
                <select 
                  className="w-1/2 px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none"
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                >
                  <option value="Hen Food">Hen Food</option>
                  <option value="Water Bill">Water Bill</option>
                  <option value="Light/Electricity Bill">Electricity Bill</option>
                  <option value="Transport">Transport</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <input 
                type="text" 
                placeholder="Specific Reason / Details"
                required
                className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none"
                value={expReason}
                onChange={(e) => setExpReason(e.target.value)}
              />
              <button className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">
                Log Expense
              </button>
            </form>
          </div>

          {/* Offline Revenue Log */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-mountain-gray/20">
            <h2 className="text-2xl font-bold text-mountain-brown flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-mountain-moss" /> External Revenue
            </h2>
            <form onSubmit={handleRevSubmit} className="space-y-4">
              <input 
                type="number" 
                min="0.01"
                step="0.01"
                required
                placeholder="Amount ($)"
                className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none"
                value={revAmount}
                onChange={(e) => setRevAmount(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Source (e.g., Local Market Sale)"
                required
                className="w-full px-4 py-3 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none"
                value={revSource}
                onChange={(e) => setRevSource(e.target.value)}
              />
              <button className="w-full py-3 bg-mountain-moss text-white rounded-xl font-bold hover:bg-mountain-brown transition-colors">
                Log Revenue
              </button>
            </form>
          </div>

        </div>

        {/* History Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-mountain-gray/10">
            <h3 className="font-bold text-mountain-brown mb-4">Recent Expenses</h3>
            <div className="space-y-3">
              {summary.latestExpenses.length === 0 && <p className="text-sm text-mountain-gray">No records.</p>}
              {summary.latestExpenses.map(e => (
                <div key={e._id} className="flex justify-between items-center bg-mountain-sand/20 p-3 rounded-lg">
                  <div>
                    <p className="font-bold text-sm text-mountain-brown">{e.category}</p>
                    <p className="text-xs text-mountain-gray">{new Date(e.date).toLocaleDateString()} - {e.reason}</p>
                  </div>
                  <span className="text-red-500 font-bold">-${e.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-md border border-mountain-gray/10">
            <h3 className="font-bold text-mountain-brown mb-4">Recent Production</h3>
            <div className="space-y-3">
              {summary.latestProduction.length === 0 && <p className="text-sm text-mountain-gray">No records.</p>}
              {summary.latestProduction.map(p => (
                <div key={p._id} className="flex justify-between items-center bg-mountain-sand/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-mountain-gray">{new Date(p.date).toLocaleDateString()}</p>
                  <span className="text-mountain-gold font-bold">+{p.eggsCollected} Eggs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FarmOperations;

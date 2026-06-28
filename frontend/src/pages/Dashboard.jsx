import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  User, LogOut, Package, MapPin, Settings, Camera,
  ChevronDown, ChevronUp, Plus, Trash2, Edit3, Check,
  X, Lock, Building2, Phone, Star, Loader2, Shield
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',   label: 'Personal Info',  icon: User    },
  { id: 'orders',    label: 'Order History',  icon: Package },
  { id: 'addresses', label: 'Address Book',   icon: MapPin  },
  { id: 'settings',  label: 'Settings',       icon: Settings},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending:         'bg-yellow-100 text-yellow-700 border-yellow-200',
  Approved:        'bg-green-100 text-green-700 border-green-200',
  Rejected:        'bg-red-100 text-red-700 border-red-200',
  Processing:      'bg-blue-100 text-blue-700 border-blue-200',
  Shipped:         'bg-indigo-100 text-indigo-700 border-indigo-200',
  Delivered:       'bg-green-100 text-green-700 border-green-200',
  Quote_Requested: 'bg-purple-100 text-purple-700 border-purple-200',
};

const Input = ({ label, icon: Icon, error, ...props }) => (
  <div>
    {label && <label className="block text-xs font-bold text-[#3B4D6E] uppercase tracking-wider mb-1.5">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl border ${
          error ? 'border-red-300 bg-red-50' : 'border-[#DDE3EC] bg-white'
        } text-[#1A2B4A] text-sm focus:outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/10 transition-all disabled:bg-[#F8FAFC] disabled:cursor-not-allowed`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ── Avatar Component ──────────────────────────────────────────────────────────
const AvatarUploader = ({ user, onUpload }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error('Image must be under 3MB'); return; }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const res = await axios.post('/api/auth/avatar', formData, config);
      onUpload(res.data.avatarUrl);
      toast.success('Profile photo updated!');
    } catch {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-28 h-28 mx-auto mb-5">
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-[#E8F1FA]">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-12 h-12 text-[#4A90D9]" />
          </div>
        )}
      </div>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 w-9 h-9 bg-[#4A90D9] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#3B7DC8] transition-colors border-2 border-white"
        title="Change photo"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

// ── Profile Tab ───────────────────────────────────────────────────────────────
const ProfileTab = ({ user, authConfig, onUpdate }) => {
  const [form, setForm] = useState({ name: user?.name || '', companyName: user?.companyName || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwErrors, setPwErrors] = useState({});

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('/api/auth/profile', form, authConfig);
      onUpdate(res.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const validatePw = () => {
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Required';
    if (pwForm.newPassword.length < 6) errs.newPassword = 'Minimum 6 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = validatePw();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({});
    setPwSaving(true);
    try {
      await axios.put('/api/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, authConfig);
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-[#DDE3EC] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#DDE3EC] bg-[#F8FAFC]">
          <h3 className="font-bold text-[#1A2B4A] flex items-center gap-2"><User className="w-4 h-4 text-[#4A90D9]" /> Personal Information</h3>
        </div>
        <form onSubmit={handleProfileSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" icon={User} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Phone Number" icon={Phone} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +94 77 123 4567" />
          </div>
          <Input label="Company Name (optional)" icon={Building2} value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="For B2B/Bulk buyers" />
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-60 text-sm shadow-md"
              style={{ backgroundColor: '#52311B' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-[#DDE3EC] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#DDE3EC] bg-[#F8FAFC]">
          <h3 className="font-bold text-[#1A2B4A] flex items-center gap-2"><Lock className="w-4 h-4 text-[#4A90D9]" /> Change Password</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          <Input label="Current Password" icon={Lock} type="password" value={pwForm.currentPassword}
            onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} error={pwErrors.currentPassword} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="New Password" icon={Lock} type="password" value={pwForm.newPassword}
              onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} error={pwErrors.newPassword} />
            <Input label="Confirm New Password" icon={Lock} type="password" value={pwForm.confirmPassword}
              onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} error={pwErrors.confirmPassword} />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={pwSaving}
              className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-60 text-sm shadow-md"
              style={{ backgroundColor: '#52311B' }}>
              {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {pwSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Orders Tab ────────────────────────────────────────────────────────────────
const OrdersTab = ({ orders }) => {
  const [expanded, setExpanded] = useState(null);

  if (orders.length === 0) return (
    <div className="bg-white rounded-2xl border border-[#DDE3EC] p-16 text-center shadow-sm">
      <Package className="w-14 h-14 text-[#CBD5E1] mx-auto mb-4" />
      <p className="font-bold text-[#1A2B4A]">No orders yet</p>
      <p className="text-sm text-[#94A3B8] mt-1">Your order history will appear here.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <div key={order._id} className="bg-white rounded-2xl border border-[#DDE3EC] shadow-sm overflow-hidden">
          <button onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F8FAFC] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F1FA] flex items-center justify-center">
                <Package className="w-5 h-5 text-[#4A90D9]" />
              </div>
              <div>
                <p className="font-bold text-[#1A2B4A] text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-[#94A3B8]">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
              <span className="font-bold text-[#1A2B4A]">Rs. {order.totalPrice.toFixed(2)}</span>
              {expanded === order._id ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
            </div>
          </button>

          <AnimatePresence>
            {expanded === order._id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="overflow-hidden border-t border-[#DDE3EC]">
                <div className="p-5 space-y-3">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE3EC]">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-[#E8F1FA]" />
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-[#1A2B4A]">{item.name}</p>
                        <p className="text-xs text-[#94A3B8]">Qty: {item.qty} × Rs. {item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-sm font-bold text-[#1A2B4A]">Rs. {(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-[#DDE3EC]">
                    <span className="text-sm font-medium text-[#64748B]">Order Total</span>
                    <span className="text-lg font-bold text-[#1A2B4A]">Rs. {order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// ── Address Tab ───────────────────────────────────────────────────────────────
const AddressTab = ({ authConfig }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const blank = { label: 'Home', street: '', city: '', postalCode: '', phone: '', isDefault: false };
  const [form, setForm] = useState(blank);

  const fetch = async () => {
    try {
      const res = await axios.get('/api/auth/addresses', authConfig);
      setAddresses(res.data);
    } catch { toast.error('Failed to load addresses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const res = await axios.put(`/api/auth/addresses/${editId}`, form, authConfig);
        setAddresses(res.data);
        toast.success('Address updated!');
      } else {
        const res = await axios.post('/api/auth/addresses', form, authConfig);
        setAddresses(res.data);
        toast.success('Address added!');
      }
      setShowForm(false); setEditId(null); setForm(blank);
    } catch { toast.error('Failed to save address'); }
    finally { setSaving(false); }
  };

  const handleEdit = (addr) => {
    setForm({ label: addr.label, street: addr.street, city: addr.city, postalCode: addr.postalCode, phone: addr.phone || '', isDefault: addr.isDefault });
    setEditId(addr._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/auth/addresses/${id}`, authConfig);
      setAddresses(res.data); toast.success('Address removed');
    } catch { toast.error('Failed to delete address'); }
  };

  const handleSetDefault = async (addr) => {
    try {
      const res = await axios.put(`/api/auth/addresses/${addr._id}`, { ...addr, isDefault: true }, authConfig);
      setAddresses(res.data);
    } catch { toast.error('Failed to set default'); }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#4A90D9] mx-auto" /></div>
      ) : (
        <>
          {addresses.length === 0 && !showForm && (
            <div className="bg-white rounded-2xl border border-[#DDE3EC] p-12 text-center shadow-sm">
              <MapPin className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
              <p className="font-bold text-[#1A2B4A]">No saved addresses</p>
              <p className="text-sm text-[#94A3B8] mt-1">Add a delivery address to get started.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr._id} className={`bg-white rounded-2xl border shadow-sm p-5 relative transition-all ${addr.isDefault ? 'border-[#4A90D9] ring-2 ring-[#4A90D9]/20' : 'border-[#DDE3EC]'}`}>
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 bg-[#4A90D9] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Default
                  </span>
                )}
                <p className="font-bold text-[#1A2B4A] text-sm mb-1">{addr.label}</p>
                <p className="text-sm text-[#64748B]">{addr.street}</p>
                <p className="text-sm text-[#64748B]">{addr.city}, {addr.postalCode}</p>
                {addr.phone && <p className="text-xs text-[#94A3B8] mt-1">{addr.phone}</p>}
                <div className="flex items-center gap-2 mt-4">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr)}
                      className="text-xs font-semibold text-[#4A90D9] hover:text-[#3B7DC8] transition-colors flex items-center gap-1">
                      <Star className="w-3 h-3" /> Set Default
                    </button>
                  )}
                  <button onClick={() => handleEdit(addr)}
                    className="ml-auto p-1.5 text-[#94A3B8] hover:text-[#1A2B4A] hover:bg-[#F8FAFC] rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(addr._id)}
                    className="p-1.5 text-[#94A3B8] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="bg-white rounded-2xl border border-[#4A90D9] shadow-lg p-6">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-bold text-[#1A2B4A]">{editId ? 'Edit Address' : 'New Address'}</h4>
                  <button onClick={() => { setShowForm(false); setEditId(null); setForm(blank); }}
                    className="p-1 text-[#94A3B8] hover:text-[#1A2B4A] rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3B4D6E] uppercase tracking-wider mb-1.5">Label</label>
                      <select value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DDE3EC] text-sm text-[#1A2B4A] focus:outline-none focus:border-[#4A90D9] bg-white">
                        <option>Home</option><option>Office</option><option>Farm</option><option>Other</option>
                      </select>
                    </div>
                    <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(optional)" />
                  </div>
                  <Input label="Street Address" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                    <Input label="Postal Code" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} required />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="rounded" />
                    <span className="text-sm text-[#64748B]">Set as default address</span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving}
                      className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-60 text-sm"
                      style={{ backgroundColor: '#52311B' }}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-[#4A90D9] font-semibold hover:text-[#3B7DC8] transition-colors text-sm">
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          )}
        </>
      )}
    </div>
  );
};

// ── Settings Tab ──────────────────────────────────────────────────────────────
const SettingsTab = ({ user, logout }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-2xl border border-[#DDE3EC] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#DDE3EC] bg-[#F8FAFC]">
        <h3 className="font-bold text-[#1A2B4A]">Account Information</h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Email</p>
            <p className="font-semibold text-[#1A2B4A] text-sm">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Member Since</p>
            <p className="font-semibold text-[#1A2B4A] text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Role</p>
            <p className="font-semibold text-[#1A2B4A] text-sm capitalize">{user?.isAdmin ? 'Administrator' : user?.isManager ? 'Manager' : 'Customer'}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-red-100 bg-red-50/60">
        <h3 className="font-bold text-red-700">Danger Zone</h3>
      </div>
      <div className="p-6">
        <p className="text-sm text-[#64748B] mb-4">Signing out will end your current session. You will need to log in again to access your account.</p>
        <button onClick={logout}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-colors text-sm shadow-md">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user, logout, updateUserInContext } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const authConfig = { headers: { Authorization: `Bearer ${user?.token}` } };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/myorders', authConfig);
        setOrders(res.data);
      } catch { /* silent */ }
      finally { setLoadingOrders(false); }
    };
    fetchOrders();
  }, [user]);

  const handleAvatarUpload = (avatarUrl) => {
    updateUserInContext({ avatarUrl });
  };

  const handleProfileUpdate = (data) => {
    updateUserInContext({ name: data.name, companyName: data.companyName, phone: data.phone, avatarUrl: data.avatarUrl });
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Page Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A2B4A]">My Account</h1>
          <p className="text-[#64748B] mt-1">Manage your profile, orders, and delivery addresses</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* ── Sidebar ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#DDE3EC] shadow-sm sticky top-24 overflow-hidden">
              {/* Avatar block */}
              <div className="bg-gradient-to-br from-[#1A2B4A] to-[#2D4A7A] p-6 text-center">
                <AvatarUploader user={user} onUpload={handleAvatarUpload} />
                <h2 className="font-bold text-white text-lg leading-tight">{user?.name}</h2>
                {user?.companyName && <p className="text-[#93C5FD] text-xs mt-0.5">{user.companyName}</p>}
                <p className="text-[#93C5FD] text-xs mt-1 opacity-80">{user?.email}</p>
              </div>

              {/* Tab nav */}
              <nav className="p-3 space-y-0.5">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                      activeTab === id
                        ? 'bg-[#EFF6FF] text-[#1A2B4A] border border-[#BFDBFE]'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1A2B4A]'
                    }`}>
                    <Icon className={`w-4 h-4 flex-shrink-0 ${activeTab === id ? 'text-[#4A90D9]' : 'text-[#94A3B8]'}`} />
                    {label}
                  </button>
                ))}
              </nav>

              {/* Order count badge */}
              {!loadingOrders && (
                <div className="mx-3 mb-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE3EC] text-center">
                  <p className="text-xs text-[#94A3B8] uppercase font-bold tracking-wider">Total Orders</p>
                  <p className="text-2xl font-bold text-[#1A2B4A] mt-0.5">{orders.length}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Main content ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}>
                {activeTab === 'profile'   && <ProfileTab user={user} authConfig={authConfig} onUpdate={handleProfileUpdate} />}
                {activeTab === 'orders'    && <OrdersTab orders={orders} />}
                {activeTab === 'addresses' && <AddressTab authConfig={authConfig} />}
                {activeTab === 'settings'  && <SettingsTab user={user} logout={logout} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

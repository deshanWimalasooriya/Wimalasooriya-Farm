import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  User, LogOut, Package, MapPin, Settings, Camera,
  ChevronDown, ChevronUp, Plus, Trash2, Edit3, Check,
  X, Lock, Building2, Phone, Star, Loader2, Shield, Mail
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',   label: 'Personal Info',  icon: User     },
  { id: 'orders',    label: 'Order History',  icon: Package  },
  { id: 'addresses', label: 'Address Book',   icon: MapPin   },
  { id: 'settings',  label: 'Settings',       icon: Settings },
];

// ── Status badge colours ──────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending:         'bg-amber-50 text-amber-700 border-amber-200',
  Approved:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected:        'bg-red-50 text-red-700 border-red-200',
  Processing:      'bg-sky-50 text-sky-700 border-sky-200',
  Shipped:         'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  Quote_Requested: 'bg-purple-50 text-purple-700 border-purple-200',
};

// ── Shared focus/blur helpers ─────────────────────────────────────────────────
const onFocus = e => {
  e.currentTarget.style.borderColor = '#3E2206';
  e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(62,34,6,0.10)';
};
const onBlur  = e => {
  e.currentTarget.style.borderColor = '#D4C5B0';
  e.currentTarget.style.boxShadow   = 'none';
};

// ── Input primitive ───────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, type = 'text', ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5C4F3D' }}>
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#B8A090' }} />
      )}
      <input
        type={type}
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-lg border outline-none text-sm transition-all`}
        style={{
          borderColor: error ? '#EF4444' : '#D4C5B0',
          backgroundColor: error ? '#FEF2F2' : '#FAFAF8',
          color: '#1A1208',
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ── Primary button ────────────────────────────────────────────────────────────
const PrimaryBtn = ({ children, loading, loadingText, disabled, ...props }) => (
  <button
    {...props}
    disabled={loading || disabled}
    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
    style={{ backgroundColor: '#3E2206', boxShadow: '0 4px 14px rgba(62,34,6,0.28)' }}
    onMouseEnter={e => { if (!loading && !disabled) e.currentTarget.style.backgroundColor = '#5a3209'; }}
    onMouseLeave={e => { if (!loading && !disabled) e.currentTarget.style.backgroundColor = '#3E2206'; }}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
    {loading ? loadingText : children}
  </button>
);

// ── Card wrapper ──────────────────────────────────────────────────────────────
const Card = ({ className = '', children }) => (
  <div
    className={`rounded-2xl border ${className}`}
    style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div
    className="px-6 py-4 border-b flex items-center gap-2"
    style={{ borderColor: '#E8E3DC', backgroundColor: '#FDFCF9' }}
  >
    {children}
  </div>
);

// ── Avatar Uploader ───────────────────────────────────────────────────────────
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
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' },
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
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg" style={{ backgroundColor: '#F5EDE3' }}>
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-10 h-10" style={{ color: '#B8A090' }} />
          </div>
        )}
      </div>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md transition-colors"
        style={{ backgroundColor: '#3E2206' }}
        title="Change photo"
      >
        {uploading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Camera className="w-3.5 h-3.5 text-white" />}
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
    } finally { setSaving(false); }
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
    } finally { setPwSaving(false); }
  };

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <User className="w-4 h-4" style={{ color: '#3E2206' }} />
          <h3 className="font-bold text-sm" style={{ color: '#1A1208' }}>Personal Information</h3>
        </CardHeader>
        <form onSubmit={handleProfileSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name"     icon={User}      value={form.name}        onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Field label="Phone Number"  icon={Phone}     value={form.phone}       onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+94 77 123 4567" />
          </div>
          <Field label="Company Name (Optional)" icon={Building2} value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="For B2B / Bulk buyers" />
          <div className="flex justify-end pt-1">
            <PrimaryBtn loading={saving} loadingText="Saving...">
              <Check className="w-4 h-4" /> Save Changes
            </PrimaryBtn>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <Lock className="w-4 h-4" style={{ color: '#3E2206' }} />
          <h3 className="font-bold text-sm" style={{ color: '#1A1208' }}>Change Password</h3>
        </CardHeader>
        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          <Field label="Current Password"   icon={Lock} type="password" value={pwForm.currentPassword}
            onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} error={pwErrors.currentPassword} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="New Password"     icon={Lock} type="password" value={pwForm.newPassword}
              onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} error={pwErrors.newPassword} />
            <Field label="Confirm New Password" icon={Lock} type="password" value={pwForm.confirmPassword}
              onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} error={pwErrors.confirmPassword} />
          </div>
          <div className="flex justify-end pt-1">
            <PrimaryBtn loading={pwSaving} loadingText="Updating...">
              <Shield className="w-4 h-4" /> Update Password
            </PrimaryBtn>
          </div>
        </form>
      </Card>
    </div>
  );
};

// ── Orders Tab ────────────────────────────────────────────────────────────────
const OrdersTab = ({ orders }) => {
  const [expanded, setExpanded] = useState(null);

  if (orders.length === 0) return (
    <Card>
      <div className="p-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#F5EDE3' }}>
          <Package className="w-8 h-8" style={{ color: '#B8A090' }} />
        </div>
        <p className="font-bold text-base mb-1" style={{ color: '#1A1208' }}>No orders yet</p>
        <p className="text-sm" style={{ color: '#9E8872' }}>Your order history will appear here.</p>
      </div>
    </Card>
  );

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <Card key={order._id} className="overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            className="w-full flex items-center justify-between p-5 text-left transition-colors"
            style={{ ':hover': { backgroundColor: '#FDFCF9' } }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5EDE3' }}>
                <Package className="w-5 h-5" style={{ color: '#3E2206' }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: '#1A1208' }}>Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs" style={{ color: '#9E8872' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
              <span className="font-bold text-sm" style={{ color: '#1A1208' }}>Rs. {order.totalPrice.toFixed(2)}</span>
              {expanded === order._id
                ? <ChevronUp className="w-4 h-4" style={{ color: '#9E8872' }} />
                : <ChevronDown className="w-4 h-4" style={{ color: '#9E8872' }} />
              }
            </div>
          </button>

          <AnimatePresence>
            {expanded === order._id && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="overflow-hidden border-t"
                style={{ borderColor: '#E8E3DC' }}
              >
                <div className="p-5 space-y-3">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: '#FAFAF8', borderColor: '#E8E3DC' }}>
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" style={{ backgroundColor: '#F5EDE3' }} />
                      <div className="flex-grow">
                        <p className="text-sm font-bold" style={{ color: '#1A1208' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: '#9E8872' }}>Qty: {item.qty} × Rs. {item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-sm font-bold" style={{ color: '#1A1208' }}>Rs. {(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: '#E8E3DC' }}>
                    <span className="text-sm" style={{ color: '#7A6A56' }}>Order Total</span>
                    <span className="text-lg font-bold" style={{ color: '#1A1208' }}>Rs. {order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
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

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('/api/auth/addresses', authConfig);
      setAddresses(res.data);
    } catch { toast.error('Failed to load addresses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const res = await axios.put(`/api/auth/addresses/${editId}`, form, authConfig);
        setAddresses(res.data); toast.success('Address updated!');
      } else {
        const res = await axios.post('/api/auth/addresses', form, authConfig);
        setAddresses(res.data); toast.success('Address added!');
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
        <div className="text-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: '#3E2206' }} />
        </div>
      ) : (
        <>
          {addresses.length === 0 && !showForm && (
            <Card>
              <div className="p-12 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5EDE3' }}>
                  <MapPin className="w-7 h-7" style={{ color: '#B8A090' }} />
                </div>
                <p className="font-bold" style={{ color: '#1A1208' }}>No saved addresses</p>
                <p className="text-sm mt-1" style={{ color: '#9E8872' }}>Add a delivery address to get started.</p>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div
                key={addr._id}
                className="rounded-2xl border p-5 relative transition-all hover:shadow-sm"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: addr.isDefault ? '#3E2206' : '#E8E3DC',
                  boxShadow: addr.isDefault ? '0 0 0 2px rgba(62,34,6,0.12)' : 'none',
                }}
              >
                {addr.isDefault && (
                  <span
                    className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 text-white"
                    style={{ backgroundColor: '#3E2206' }}
                  >
                    <Star className="w-2.5 h-2.5" /> Default
                  </span>
                )}
                <p className="font-bold text-sm mb-1" style={{ color: '#1A1208' }}>{addr.label}</p>
                <p className="text-sm" style={{ color: '#5C4F3D' }}>{addr.street}</p>
                <p className="text-sm" style={{ color: '#5C4F3D' }}>{addr.city}, {addr.postalCode}</p>
                {addr.phone && <p className="text-xs mt-1" style={{ color: '#9E8872' }}>{addr.phone}</p>}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: '#E8E3DC' }}>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-xs font-semibold flex items-center gap-1 transition-colors"
                      style={{ color: '#3E2206' }}
                    >
                      <Star className="w-3 h-3" /> Set Default
                    </button>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-[#F5EDE3]"
                      style={{ color: '#9E8872' }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                      style={{ color: '#9E8872' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9E8872'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#3E2206', boxShadow: '0 0 0 2px rgba(62,34,6,0.10)' }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-bold" style={{ color: '#1A1208' }}>{editId ? 'Edit Address' : 'New Address'}</h4>
                  <button
                    onClick={() => { setShowForm(false); setEditId(null); setForm(blank); }}
                    className="p-1 rounded-lg transition-colors"
                    style={{ color: '#9E8872' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5C4F3D' }}>Label</label>
                      <select
                        value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition-all"
                        style={{ borderColor: '#D4C5B0', backgroundColor: '#FAFAF8', color: '#1A1208' }}
                        onFocus={onFocus} onBlur={onBlur}
                      >
                        <option>Home</option><option>Office</option><option>Farm</option><option>Other</option>
                      </select>
                    </div>
                    <Field label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(optional)" />
                  </div>
                  <Field label="Street Address" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City"        value={form.city}       onChange={e => setForm({ ...form, city: e.target.value })} required />
                    <Field label="Postal Code" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} required />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox" checked={form.isDefault}
                      onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm" style={{ color: '#5C4F3D' }}>Set as default address</span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <PrimaryBtn loading={saving} loadingText="Saving...">
                      <Check className="w-4 h-4" /> Save Address
                    </PrimaryBtn>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: '#3E2206' }}
            >
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
    <Card>
      <CardHeader>
        <Settings className="w-4 h-4" style={{ color: '#3E2206' }} />
        <h3 className="font-bold text-sm" style={{ color: '#1A1208' }}>Account Information</h3>
      </CardHeader>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#B8A090' }}>Email</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: '#9E8872' }} />
              <p className="font-semibold text-sm" style={{ color: '#1A1208' }}>{user?.email}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#B8A090' }}>Member Since</p>
            <p className="font-semibold text-sm" style={{ color: '#1A1208' }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#B8A090' }}>Role</p>
            <p className="font-semibold text-sm capitalize" style={{ color: '#1A1208' }}>
              {user?.isAdmin ? 'Administrator' : user?.isManager ? 'Manager' : 'Customer'}
            </p>
          </div>
        </div>
      </div>
    </Card>

    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#FCA5A5', backgroundColor: '#FFFFFF' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: '#FCA5A5', backgroundColor: '#FFF5F5' }}>
        <h3 className="font-bold text-sm text-red-700">Danger Zone</h3>
      </div>
      <div className="p-6">
        <p className="text-sm mb-4" style={{ color: '#7A6A56' }}>
          Signing out will end your current session. You will need to log in again to access your account.
        </p>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm shadow-sm"
        >
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

  const handleAvatarUpload = (avatarUrl) => updateUserInContext({ avatarUrl });
  const handleProfileUpdate = (data) =>
    updateUserInContext({ name: data.name, companyName: data.companyName, phone: data.phone, avatarUrl: data.avatarUrl });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F3EF' }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Page Header ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}>My Account</h1>
          <p className="mt-1 text-sm" style={{ color: '#7A6A56' }}>Manage your profile, orders, and delivery addresses</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* ── Sidebar ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div
              className="rounded-2xl border overflow-hidden sticky top-24"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E3DC' }}
            >
              {/* Avatar block */}
              <div
                className="p-6 text-center"
                style={{
                  background: 'linear-gradient(135deg, #3E2206 0%, #6B3A1F 100%)',
                }}
              >
                <AvatarUploader user={user} onUpload={handleAvatarUpload} />
                <h2 className="font-bold text-white text-base leading-tight">{user?.name}</h2>
                {user?.companyName && (
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,220,180,0.85)' }}>{user.companyName}</p>
                )}
                <p className="text-xs mt-1" style={{ color: 'rgba(255,220,180,0.65)' }}>{user?.email}</p>
              </div>

              {/* Tab nav */}
              <nav className="p-3 space-y-0.5">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                    style={{
                      backgroundColor: activeTab === id ? '#F5EDE3' : 'transparent',
                      color:           activeTab === id ? '#3E2206'  : '#7A6A56',
                      borderLeft:      activeTab === id ? '3px solid #3E2206' : '3px solid transparent',
                    }}
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: activeTab === id ? '#3E2206' : '#B8A090' }}
                    />
                    {label}
                  </button>
                ))}
              </nav>

              {/* Order count badge */}
              {!loadingOrders && (
                <div
                  className="mx-3 mb-3 p-4 rounded-xl border text-center"
                  style={{ backgroundColor: '#FAFAF8', borderColor: '#E8E3DC' }}
                >
                  <p className="text-xs uppercase font-bold tracking-wider" style={{ color: '#B8A090' }}>Total Orders</p>
                  <p className="text-2xl font-bold mt-0.5" style={{ color: '#1A1208', fontFamily: 'Georgia, serif' }}>
                    {orders.length}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Main content ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
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

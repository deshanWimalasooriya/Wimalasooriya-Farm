import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MailOpen, CheckCircle2, MessageSquareDot,
  X, ChevronDown, Loader2, RefreshCw, Eye
} from 'lucide-react';

// ── Status badge config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Unread:   { label: 'Unread',   bg: '#FEE2E2', text: '#B91C1C', dot: '#EF4444'  },
  Read:     { label: 'Read',     bg: '#F3F4F6', text: '#4B5563', dot: '#9CA3AF'  },
  Resolved: { label: 'Resolved', bg: '#D1FAE5', text: '#065F46', dot: '#10B981'  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Read;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, accent, bg, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="rounded-2xl p-5 border shadow-lg flex items-start gap-4"
    style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
      <Icon className="w-5 h-5" style={{ color: accent }} />
    </div>
    <div>
      <p className="text-xs font-medium" style={{ color: '#6C6F6E' }}>{label}</p>
      <p className="text-2xl font-bold mt-0.5" style={{ color: '#013547' }}>{value}</p>
    </div>
  </motion.div>
);

// ── Message Detail Modal ───────────────────────────────────────────────────────
const MessageModal = ({ msg, onClose, onStatusChange, updating }) => {
  if (!msg) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(1,53,71,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(1,53,71,0.12)' }}
        >
          {/* Modal header */}
          <div
            className="flex items-start justify-between px-6 py-4 border-b"
            style={{ borderColor: 'rgba(1,53,71,0.10)', backgroundColor: 'rgba(1,53,71,0.03)' }}
          >
            <div>
              <p className="font-bold text-base" style={{ color: '#013547' }}>
                {msg.firstName} {msg.lastName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6C6F6E' }}>{msg.email}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" style={{ color: '#6C6F6E' }} />
            </button>
          </div>

          {/* Modal body */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6C6F6E' }}>Subject</p>
                <p className="text-sm font-semibold" style={{ color: '#013547' }}>{msg.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6C6F6E' }}>Received</p>
                <p className="text-xs" style={{ color: '#6C6F6E' }}>
                  {new Date(msg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6C6F6E' }}>Message</p>
              <div
                className="text-sm leading-relaxed p-4 rounded-xl whitespace-pre-wrap"
                style={{ backgroundColor: 'rgba(1,53,71,0.04)', color: '#013547', border: '1px solid rgba(1,53,71,0.08)' }}
              >
                {msg.message}
              </div>
            </div>

            {/* Status changer */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6C6F6E' }}>Change Status</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    disabled={updating || msg.status === key}
                    onClick={() => onStatusChange(msg._id, key)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: msg.status === key ? cfg.bg : '#F8FAFC',
                      color:           msg.status === key ? cfg.text : '#6C6F6E',
                      borderColor:     msg.status === key ? cfg.dot  : 'rgba(1,53,71,0.15)',
                    }}
                  >
                    {updating ? <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> : null}
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Inline status dropdown in table ───────────────────────────────────────────
const StatusDropdown = ({ msgId, currentStatus, onStatusChange, updating }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border transition-colors"
        style={{ borderColor: 'rgba(1,53,71,0.18)', color: '#013547', backgroundColor: 'rgba(1,53,71,0.04)' }}
        disabled={updating}
      >
        {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
        Change
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 z-30 rounded-xl shadow-xl border overflow-hidden"
            style={{ background: '#fff', borderColor: 'rgba(1,53,71,0.12)', minWidth: '120px' }}
          >
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                disabled={currentStatus === key}
                onClick={() => { onStatusChange(msgId, key); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-left hover:bg-gray-50 transition-colors disabled:opacity-40"
                style={{ color: cfg.text }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
                {cfg.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const AdminContactMessages = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [updating, setUpdating] = useState(false);

  const authConfig = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axios.get('/api/contact', authConfig);
      setMessages(res.data);
    } catch {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(true);
    try {
      const res = await axios.put(`/api/contact/${id}/status`, { status: newStatus }, authConfig);
      setMessages(prev => prev.map(m => m._id === id ? res.data : m));
      if (selectedMsg?._id === id) setSelectedMsg(res.data);
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  // KPI counts
  const total    = messages.length;
  const unread   = messages.filter(m => m.status === 'Unread').length;
  const resolved = messages.filter(m => m.status === 'Resolved').length;

  if (loading) {
    return (
      <div className="rounded-2xl p-16 text-center border shadow-lg" style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}>
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#DDBA9B', borderTopColor: 'transparent' }} />
        <p className="font-medium" style={{ color: '#013547' }}>Loading contact messages…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── KPI Row ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard icon={MessageSquareDot} label="Total Messages" value={total}    accent="#013547" bg="rgba(1,53,71,0.10)"      delay={0}    />
        <KpiCard icon={Mail}             label="Unread"         value={unread}   accent="#EF4444" bg="rgba(239,68,68,0.10)"    delay={0.07} />
        <KpiCard icon={CheckCircle2}     label="Resolved"       value={resolved} accent="#10B981" bg="rgba(16,185,129,0.10)"   delay={0.14} />
      </div>

      {/* ── Table card ──────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border shadow-lg overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(1,53,71,0.10)' }}
      >
        {/* Table header row */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(1,53,71,0.08)', backgroundColor: 'rgba(1,53,71,0.03)' }}
        >
          <div className="flex items-center gap-2">
            <MailOpen className="w-4 h-4" style={{ color: '#DDBA9B' }} />
            <h3 className="font-bold text-sm" style={{ color: '#013547' }}>Contact Inquiries</h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
              style={{ backgroundColor: 'rgba(221,186,155,0.25)', color: '#013547' }}
            >
              {total}
            </span>
          </div>
          <button
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
            style={{ borderColor: 'rgba(1,53,71,0.20)', color: '#013547', backgroundColor: 'rgba(1,53,71,0.04)' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="py-16 text-center">
            <Mail className="w-12 h-12 mx-auto mb-3" style={{ color: '#D0D8DF' }} />
            <p className="font-bold" style={{ color: '#013547' }}>No contact messages yet</p>
            <p className="text-sm mt-1" style={{ color: '#6C6F6E' }}>Messages submitted via the Contact Us form will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'rgba(1,53,71,0.04)', borderBottom: '1px solid rgba(1,53,71,0.08)' }}>
                  {['Date', 'Name', 'Email', 'Subject', 'Status', 'Actions'].map(col => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: '#6C6F6E' }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, i) => (
                  <motion.tr
                    key={msg._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="border-b transition-colors hover:bg-[rgba(1,53,71,0.03)]"
                    style={{ borderColor: 'rgba(1,53,71,0.06)' }}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: '#6C6F6E' }}>
                      <p className="text-xs">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="font-semibold text-xs" style={{ color: '#013547' }}>
                        {msg.firstName} {msg.lastName}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 max-w-[160px] truncate" style={{ color: '#6C6F6E' }}>
                      <span className="text-xs">{msg.email}</span>
                    </td>
                    <td className="px-5 py-3.5 max-w-[180px] truncate" style={{ color: '#013547' }}>
                      <span className="text-xs font-medium">{msg.subject}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={msg.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {/* View full message */}
                        <button
                          onClick={() => setSelectedMsg(msg)}
                          title="View full message"
                          className="p-1.5 rounded-lg border transition-colors hover:bg-[rgba(1,53,71,0.06)]"
                          style={{ borderColor: 'rgba(1,53,71,0.15)', color: '#013547' }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {/* Status dropdown */}
                        <StatusDropdown
                          msgId={msg._id}
                          currentStatus={msg.status}
                          onStatusChange={handleStatusChange}
                          updating={updating}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Message Detail Modal ─────────────────────────────────────────────── */}
      {selectedMsg && (
        <MessageModal
          msg={selectedMsg}
          onClose={() => setSelectedMsg(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
};

export default AdminContactMessages;

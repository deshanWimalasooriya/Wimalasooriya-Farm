import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Plus, FileEdit, Printer, Upload, Trash2, X, Check,
  Search, CheckCircle, Clock, ShieldOff, User, Calendar,
  Wrench, FileText, Car
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';

// ── Vehicle Passport (For Printing) ─────────────────────────────────────────
const VehiclePassportToPrint = React.forwardRef(({ vehicle }, ref) => {
  if (!vehicle) return null;

  const isInsuranceExpired = vehicle.insuranceExpiry && new Date(vehicle.insuranceExpiry) < new Date();

  return (
    <div ref={ref} className="p-6 w-[120mm] bg-white text-black font-sans relative overflow-hidden" style={{ boxSizing: 'border-box', minHeight: '76mm' }}>
      {/* Decorative header bar */}
      <div className="absolute top-0 left-0 w-full h-2.5 bg-mountain-brown" />
      <div className="absolute top-2.5 left-0 w-full h-1 bg-mountain-gold" />
      {/* Background accent circle */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-mountain-gold/8" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-mountain-brown/5" />

      <div className="mt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[8px] font-bold text-mountain-gold uppercase tracking-[0.2em] mb-0.5">Wimalasooriya Farm</p>
            <h2 className="text-[15px] font-black text-mountain-brown leading-none tracking-tight">Vehicle Passport</h2>
          </div>
          <div className="bg-white p-1.5 rounded-lg shadow-sm border border-black/8">
            <QRCodeSVG value={`WIMALASOORIYA-VEHICLE:${vehicle.vehicleId}`} size={48} level="M" />
          </div>
        </div>

        <div className="flex gap-4">
          {/* Vehicle Photo */}
          <div className="w-[28%] flex flex-col items-center gap-2">
            {vehicle.photoUrl ? (
              <img
                src={vehicle.photoUrl}
                alt={vehicle.make}
                className="w-20 h-16 rounded-lg object-cover border-2 border-mountain-brown/15 shadow-sm"
              />
            ) : (
              <div className="w-20 h-16 rounded-lg bg-mountain-sand/40 flex items-center justify-center border-2 border-mountain-brown/10">
                <Truck className="w-8 h-8 text-mountain-brown/25" />
              </div>
            )}
            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              vehicle.status === 'Active' ? 'bg-green-100 text-green-700' :
              vehicle.status === 'Under Maintenance' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {vehicle.status}
            </span>
          </div>

          {/* Vehicle Details */}
          <div className="flex-1 space-y-1.5">
            <div>
              <p className="text-[17px] font-black text-mountain-brown leading-none">{vehicle.registrationNumber}</p>
              <p className="text-[10px] font-semibold text-mountain-moss mt-0.5">{vehicle.type}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
              {[
                { label: 'Vehicle ID', value: vehicle.vehicleId },
                { label: 'Make / Model', value: `${vehicle.make} ${vehicle.model}` },
                { label: 'Year', value: vehicle.year },
                { label: 'Driver', value: vehicle.assignedDriver || '—' },
                { label: 'Insurance', value: vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString('en-GB') : '—' },
                { label: 'Last Service', value: vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate).toLocaleDateString('en-GB') : '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-[7.5px] text-gray-400 font-medium uppercase tracking-wider">{label}</span>
                  <p className={`text-[9px] font-bold text-gray-800 leading-tight ${label === 'Vehicle ID' ? 'font-mono' : ''} ${label === 'Insurance' && isInsuranceExpired ? 'text-red-600' : ''}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {vehicle.notes && (
              <div className="mt-2 pt-1.5 border-t border-gray-200">
                <p className="text-[7.5px] text-gray-400 font-medium uppercase tracking-wider">Notes</p>
                <p className="text-[8.5px] text-gray-700 leading-snug">{vehicle.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
          <p className="text-[7px] text-gray-400">Issued: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          <p className="text-[7px] font-bold text-mountain-brown/50 uppercase tracking-widest">Wimalasooriya Farm Fleet</p>
        </div>
      </div>
    </div>
  );
});

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  if (status === 'Active') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
      <CheckCircle className="w-3.5 h-3.5" /> Active
    </span>
  );
  if (status === 'Under Maintenance') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
      <Clock className="w-3.5 h-3.5" /> Maintenance
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
      <ShieldOff className="w-3.5 h-3.5" /> Retired
    </span>
  );
};

// ── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = {
  registrationNumber: '', type: 'Delivery Van', make: '', model: '',
  year: new Date().getFullYear(), assignedDriver: '', insuranceExpiry: '',
  lastServiceDate: '', photoUrl: '', status: 'Active', notes: ''
};

// ── Main Component ────────────────────────────────────────────────────────────
const TransportManagement = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const printRef = useRef();

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('/api/admin/transport', config);
      setVehicles(res.data);
    } catch {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => setFormData(f => ({ ...f, photoUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (selectedVehicle?._id) {
        await axios.put(`/api/admin/transport/${selectedVehicle._id}`, formData, config);
        toast.success('Vehicle updated!');
      } else {
        await axios.post('/api/admin/transport', formData, config);
        toast.success('Vehicle registered!');
      }
      setIsFormOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle permanently? This cannot be undone.')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/admin/transport/${id}`, config);
      toast.success('Vehicle deleted');
      fetchVehicles();
    } catch {
      toast.error('Failed to delete vehicle');
    }
  };

  const openNew = () => { setSelectedVehicle(null); setFormData(emptyForm); setIsFormOpen(true); };
  const openEdit = (v) => {
    setSelectedVehicle(v);
    setFormData({
      registrationNumber: v.registrationNumber, type: v.type,
      make: v.make, model: v.model, year: v.year,
      assignedDriver: v.assignedDriver || '', insuranceExpiry: v.insuranceExpiry ? v.insuranceExpiry.slice(0,10) : '',
      lastServiceDate: v.lastServiceDate ? v.lastServiceDate.slice(0,10) : '',
      photoUrl: v.photoUrl || '', status: v.status, notes: v.notes || ''
    });
    setIsFormOpen(true);
  };
  const openPassport = (v) => { setSelectedVehicle(v); setIsPrinting(true); };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedVehicle ? `Vehicle_Passport_${selectedVehicle.vehicleId}` : 'Vehicle_Passport',
    onAfterPrint: () => setIsPrinting(false),
  });

  const filtered = vehicles.filter(v =>
    v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold outline-none text-sm transition-colors bg-white";

  return (
    <div className="space-y-6">

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-md border border-mountain-gold/20 p-5 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-mountain-gray/50" />
          <input
            type="text"
            placeholder="Search by Reg. No, ID, Make, or Type…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-mountain-gray/20 bg-white focus:border-mountain-gold outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={openNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-mountain-moss text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-mountain-moss/20 hover:bg-mountain-brown transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Register Vehicle
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Fleet', value: vehicles.length, color: 'text-mountain-brown', bg: 'bg-mountain-sand/40' },
          { label: 'Active', value: vehicles.filter(v => v.status === 'Active').length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Maintenance', value: vehicles.filter(v => v.status === 'Under Maintenance').length, color: 'text-orange-700', bg: 'bg-orange-50' },
          { label: 'Retired', value: vehicles.filter(v => v.status === 'Retired').length, color: 'text-red-700', bg: 'bg-red-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} border border-mountain-gold/10 rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-mountain-gray font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white/85 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-mountain-sand/20 border-b border-mountain-gold/20">
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Vehicle</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Fleet ID</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Driver</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Insurance</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Status</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12 text-mountain-gray">
                  <div className="w-6 h-6 border-2 border-mountain-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading…
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-16 text-mountain-gray">
                  <Truck className="w-12 h-12 mx-auto mb-3 text-mountain-gray/30" />
                  <p className="font-semibold">{vehicles.length === 0 ? 'No vehicles registered yet.' : 'No vehicles match your search.'}</p>
                </td></tr>
              ) : filtered.map((v) => {
                const insuranceExpired = v.insuranceExpiry && new Date(v.insuranceExpiry) < new Date();
                return (
                  <tr key={v._id} className="border-b border-mountain-gray/10 hover:bg-white transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-xl bg-mountain-sand/40 overflow-hidden flex-shrink-0 border border-mountain-gold/20">
                          {v.photoUrl ? (
                            <img src={v.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-mountain-gray">
                              <Truck className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-mountain-brown text-sm tracking-wide">{v.registrationNumber}</p>
                          <p className="text-xs text-mountain-gray">{v.type} · {v.make} {v.model} ({v.year})</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-semibold bg-mountain-sand/30 px-2 py-1 rounded text-mountain-brown border border-mountain-gray/10">
                        {v.vehicleId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-mountain-gray font-medium">
                        {v.assignedDriver || <span className="text-mountain-gray/40 italic">Unassigned</span>}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {v.insuranceExpiry ? (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${insuranceExpired ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                          {insuranceExpired ? '⚠ Expired: ' : '✓ '}
                          {new Date(v.insuranceExpiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      ) : (
                        <span className="text-mountain-gray/40 text-xs italic">Not set</span>
                      )}
                    </td>
                    <td className="py-4 px-6"><StatusBadge status={v.status} /></td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openPassport(v)} className="p-2 text-mountain-gold hover:bg-mountain-gold/10 hover:text-mountain-brown rounded-lg transition-colors" title="Print Vehicle Passport">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(v)} className="p-2 text-mountain-gray hover:bg-mountain-sand hover:text-mountain-brown rounded-lg transition-colors" title="Edit Vehicle">
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(v._id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Delete Vehicle">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Form Modal ── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-mountain-brown/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6"
            >
              <div className="flex justify-between items-center p-6 border-b border-mountain-gray/10 bg-mountain-sand/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-mountain-gold/20 flex items-center justify-center">
                    <Car className="w-5 h-5 text-mountain-brown" />
                  </div>
                  <h2 className="text-xl font-bold text-mountain-brown">
                    {selectedVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}
                  </h2>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-2 text-mountain-gray hover:bg-white hover:text-mountain-brown rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Photo + QR */}
                  <div className="w-full sm:w-1/3 flex flex-col items-center gap-3">
                    <div className="w-36 h-28 rounded-2xl bg-mountain-sand/30 border-2 border-dashed border-mountain-gold/40 flex items-center justify-center overflow-hidden relative group">
                      {formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                      ) : (
                        <Truck className="w-10 h-10 text-mountain-gold/40" />
                      )}
                      <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer bg-mountain-brown/40 backdrop-blur-sm transition-opacity">
                        <Upload className="w-6 h-6 text-white mb-1" />
                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">Upload Photo</span>
                        <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                    <p className="text-[10px] text-mountain-gray text-center leading-tight">Vehicle photo for passport. Max 2MB.</p>
                    {selectedVehicle?.vehicleId && (
                      <div className="flex flex-col items-center bg-mountain-sand/20 p-3 rounded-xl border border-mountain-gold/20 w-full">
                        <p className="text-[10px] font-bold uppercase text-mountain-brown mb-2 tracking-widest">Passport QR</p>
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-black/5">
                          <QRCodeSVG value={`WIMALASOORIYA-VEHICLE:${selectedVehicle.vehicleId}`} size={72} level="M" />
                        </div>
                        <p className="font-mono text-xs font-bold text-mountain-gray mt-2">{selectedVehicle.vehicleId}</p>
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5 flex justify-between">
                          <span>Registration Number</span>
                          <span className="text-[10px] font-normal text-mountain-gray capitalize">e.g. WP-AB-1234</span>
                        </label>
                        <input type="text" required value={formData.registrationNumber} onChange={e => setFormData(f => ({ ...f, registrationNumber: e.target.value }))} className={`${inputClass} font-mono uppercase tracking-widest font-bold`} placeholder="WP AB 1234" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Vehicle Type</label>
                        <select value={formData.type} onChange={e => setFormData(f => ({ ...f, type: e.target.value }))} className={inputClass}>
                          {['Delivery Van', 'Pickup Truck', 'Lorry', 'Motorbike', 'Tractor', 'Other'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Year</label>
                        <input type="number" required min="1990" max={new Date().getFullYear() + 1} value={formData.year} onChange={e => setFormData(f => ({ ...f, year: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Make (Brand)</label>
                        <input type="text" required value={formData.make} onChange={e => setFormData(f => ({ ...f, make: e.target.value }))} className={inputClass} placeholder="e.g. Toyota" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Model</label>
                        <input type="text" required value={formData.model} onChange={e => setFormData(f => ({ ...f, model: e.target.value }))} className={inputClass} placeholder="e.g. HiAce" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> Assigned Driver</span>
                        </label>
                        <input type="text" value={formData.assignedDriver} onChange={e => setFormData(f => ({ ...f, assignedDriver: e.target.value }))} className={inputClass} placeholder="Driver's name (optional)" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Insurance Expiry</span>
                        </label>
                        <input type="date" value={formData.insuranceExpiry} onChange={e => setFormData(f => ({ ...f, insuranceExpiry: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">
                          <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> Last Service Date</span>
                        </label>
                        <input type="date" value={formData.lastServiceDate} onChange={e => setFormData(f => ({ ...f, lastServiceDate: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Status</label>
                        <select value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value }))} className={inputClass}>
                          <option value="Active">🟢 Active</option>
                          <option value="Under Maintenance">🟠 Under Maintenance</option>
                          <option value="Retired">🔴 Retired</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">
                          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Notes</span>
                        </label>
                        <input type="text" value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} className={inputClass} placeholder="Any extra notes…" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-mountain-gray/10">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-mountain-gray hover:bg-mountain-sand transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-mountain-moss text-white hover:bg-mountain-brown shadow-lg shadow-mountain-moss/20 transition-all text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" /> Save Vehicle
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Print Passport Modal ── */}
      <AnimatePresence>
        {isPrinting && selectedVehicle && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-mountain-brown/80 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          >
            <p className="text-center text-xs font-bold uppercase tracking-widest text-mountain-sand/70 mb-5">
              Vehicle Passport Preview (120mm × 76mm)
            </p>
            <div className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-xl overflow-hidden border border-black/10">
              <VehiclePassportToPrint ref={printRef} vehicle={selectedVehicle} />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsPrinting(false)} className="px-6 py-3 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-colors">
                Cancel
              </button>
              <button onClick={() => handlePrint()} className="px-6 py-3 rounded-xl font-bold bg-mountain-gold text-mountain-brown hover:bg-white shadow-lg transition-all flex items-center gap-2">
                <Printer className="w-5 h-5" /> Print Passport
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransportManagement;

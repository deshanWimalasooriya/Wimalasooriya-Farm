import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, FileEdit, Printer, Upload, Trash2, X, Check, Search, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';

// ── Badge Component (For Printing) ──────────────────────────────────────────
const BadgeToPrint = React.forwardRef(({ worker }, ref) => {
  if (!worker) return null;
  return (
    <div ref={ref} className="p-8 w-[85.6mm] h-[54mm] bg-white text-black font-sans relative overflow-hidden" style={{ boxSizing: 'border-box' }}>
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-2 bg-mountain-brown" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mountain-gold" />
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-mountain-gold/10" />

      <div className="flex items-center gap-4 h-full">
        <div className="w-[30%] h-full flex flex-col justify-center items-center">
          {worker.photoUrl ? (
            <img src={worker.photoUrl} alt={worker.name} className="w-16 h-16 rounded-full object-cover border-2 border-mountain-brown/20 mb-2 shadow-sm" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-mountain-sand/50 flex items-center justify-center border-2 border-mountain-brown/10 mb-2">
              <Users className="w-8 h-8 text-mountain-brown/30" />
            </div>
          )}
          <QRCodeSVG value={`WIMALASOORIYA:${worker.workerId}`} size={50} level="M" />
        </div>
        <div className="w-[70%] flex flex-col justify-center h-full pt-1">
          <p className="text-[9px] font-bold text-mountain-gold uppercase tracking-widest mb-1">Wimalasooriya Farm</p>
          <h2 className="text-xl font-bold text-mountain-brown leading-none tracking-tight mb-1">{worker.name}</h2>
          <p className="text-xs font-semibold text-mountain-moss mb-3">{worker.position}</p>
          
          <div className="space-y-1">
            <div className="flex gap-2 text-[10px]">
              <span className="text-gray-500 font-medium w-6">ID:</span>
              <span className="font-bold text-gray-800 font-mono tracking-wider">{worker.workerId}</span>
            </div>
            <div className="flex gap-2 text-[10px]">
              <span className="text-gray-500 font-medium w-6">NIC:</span>
              <span className="font-bold text-gray-800">{worker.nationalId}</span>
            </div>
            <div className="flex gap-2 text-[10px]">
              <span className="text-gray-500 font-medium w-6">STAT:</span>
              <span className={`font-bold ${worker.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                {worker.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── Main Component ──────────────────────────────────────────────────────────
const WorkerManagement = () => {
  const { user } = useContext(AuthContext);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  
  const printRef = useRef();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    position: 'Feeder',
    nationalId: '',
    photoUrl: '', // Base64
    status: 'Active'
  });

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('/api/admin/workers', config);
      setWorkers(res.data);
    } catch (error) {
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveWorker = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (selectedWorker && selectedWorker._id) {
        // Update
        await axios.put(`/api/admin/workers/${selectedWorker._id}`, formData, config);
        toast.success('Worker updated successfully!');
      } else {
        // Create
        await axios.post('/api/admin/workers', formData, config);
        toast.success('New worker added successfully!');
      }
      setIsFormOpen(false);
      fetchWorkers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving worker');
    }
  };

  const openNewForm = () => {
    setSelectedWorker(null);
    setFormData({ name: '', age: '', position: 'Feeder', nationalId: '', photoUrl: '', status: 'Active' });
    setIsFormOpen(true);
  };

  const openEditForm = (worker) => {
    setSelectedWorker(worker);
    setFormData({
      name: worker.name, age: worker.age, position: worker.position, 
      nationalId: worker.nationalId, photoUrl: worker.photoUrl || '', status: worker.status
    });
    setIsFormOpen(true);
  };

  const handleDeleteWorker = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker? This action cannot be undone.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/admin/workers/${id}`, config);
        toast.success('Worker deleted successfully');
        fetchWorkers();
      } catch (error) {
        toast.error('Failed to delete worker');
      }
    }
  };

  const openPrintBadge = (worker) => {
    setSelectedWorker(worker);
    setIsPrinting(true);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedWorker ? `ID_Badge_${selectedWorker.workerId}` : 'ID_Badge',
    onAfterPrint: () => setIsPrinting(false),
  });

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.nationalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-md border border-mountain-gold/20 p-5 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-mountain-gray/50" />
          <input 
            type="text" 
            placeholder="Search workers by Name, ID, or NIC..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-mountain-gray/20 bg-white focus:border-mountain-gold outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={openNewForm}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-mountain-moss text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-mountain-moss/20 hover:bg-mountain-brown transition-all text-sm"
        >
          <UserPlus className="w-4 h-4" /> Add New Worker
        </button>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white/85 backdrop-blur-sm border border-mountain-gold/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-mountain-sand/20 border-b border-mountain-gold/20">
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Employee</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Worker ID</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Position</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown">Status</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-mountain-brown text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-mountain-gray"><div className="w-6 h-6 border-2 border-mountain-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div> Loading...</td></tr>
              ) : filteredWorkers.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-mountain-gray">No workers found.</td></tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker._id} className="border-b border-mountain-gray/10 hover:bg-white transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-mountain-sand/50 overflow-hidden flex-shrink-0 border border-mountain-gold/20">
                          {worker.photoUrl ? (
                            <img src={worker.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-mountain-gray"><Users className="w-5 h-5" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-mountain-brown text-sm">{worker.name}</p>
                          <p className="text-xs text-mountain-gray">NIC: {worker.nationalId} · Age: {worker.age}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-semibold bg-mountain-sand/30 px-2 py-1 rounded text-mountain-brown border border-mountain-gray/10">
                        {worker.workerId}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-mountain-gray font-medium">{worker.position}</td>
                    <td className="py-4 px-6">
                      {worker.status === 'Active' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200"><CheckCircle className="w-3.5 h-3.5" /> Active</span>}
                      {worker.status === 'Disabled' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200"><Clock className="w-3.5 h-3.5" /> Disabled</span>}
                      {worker.status === 'Removed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200"><ShieldAlert className="w-3.5 h-3.5" /> Removed</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openPrintBadge(worker)} className="p-2 text-mountain-gold hover:bg-mountain-gold/10 hover:text-mountain-brown rounded-lg transition-colors tooltip-trigger" title="Print ID Badge">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditForm(worker)} className="p-2 text-mountain-gray hover:bg-mountain-sand hover:text-mountain-brown rounded-lg transition-colors tooltip-trigger" title="Edit Profile">
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteWorker(worker._id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors tooltip-trigger" title="Delete Worker">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Form Modal ── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-mountain-brown/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-mountain-gray/10 bg-mountain-sand/10">
                <h2 className="text-xl font-bold text-mountain-brown">
                  {selectedWorker ? 'Edit Worker Profile' : 'Register New Worker'}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 text-mountain-gray hover:bg-white hover:text-mountain-brown rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveWorker} className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Photo Upload area */}
                  <div className="w-full sm:w-1/3 flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-2xl bg-mountain-sand/30 border-2 border-dashed border-mountain-gold/40 flex items-center justify-center overflow-hidden relative group">
                      {formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                      ) : (
                        <Users className="w-8 h-8 text-mountain-gold/50" />
                      )}
                      <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer bg-mountain-brown/40 backdrop-blur-sm transition-opacity">
                        <Upload className="w-6 h-6 text-white mb-1" />
                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">Upload</span>
                        <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                    <p className="text-[10px] text-mountain-gray text-center px-4 leading-tight">Square images work best. Max size 2MB.</p>
                    
                    {/* QR Code display for existing workers */}
                    {selectedWorker && selectedWorker.workerId && (
                      <div className="mt-4 flex flex-col items-center bg-mountain-sand/20 p-3 rounded-xl border border-mountain-gold/20">
                        <p className="text-[10px] font-bold uppercase text-mountain-brown mb-2 tracking-widest">Scannable ID Badge</p>
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-black/5">
                          <QRCodeSVG value={`WIMALASOORIYA:${selectedWorker.workerId}`} size={80} level="M" />
                        </div>
                        <p className="font-mono text-xs font-bold text-mountain-gray mt-2">{selectedWorker.workerId}</p>
                      </div>
                    )}
                  </div>

                  {/* Form fields */}
                  <div className="w-full sm:w-2/3 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Worker ID (Read-only) */}
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Worker ID</span>
                          <span className="text-[10px] font-normal text-mountain-gray capitalize">System managed</span>
                        </label>
                        <input 
                          type="text" 
                          disabled 
                          value={selectedWorker ? selectedWorker.workerId : 'Auto-generated upon save (e.g. WF-EMP-001)'} 
                          className="w-full px-4 py-2.5 rounded-xl border border-mountain-gray/20 bg-mountain-sand/30 text-mountain-gray/70 font-mono text-sm outline-none cursor-not-allowed" 
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Full Name</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold outline-none text-sm transition-colors" placeholder="e.g. Nimal Perera" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Age</label>
                        <input type="number" required min="18" max="80" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold outline-none text-sm transition-colors" placeholder="35" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">NIC Number</label>
                        <input type="text" required value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold outline-none text-sm transition-colors" placeholder="85324...V" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Position</label>
                        <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold outline-none text-sm transition-colors bg-white">
                          <option value="Feeder">Feeder</option>
                          <option value="Collector">Egg Collector</option>
                          <option value="Driver">Transport/Driver</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-mountain-brown uppercase tracking-wider mb-1.5">Status</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-mountain-gray/30 focus:border-mountain-gold outline-none text-sm transition-colors bg-white font-medium">
                          <option value="Active">🟢 Active</option>
                          <option value="Disabled">🟠 Disabled (On Leave/Suspended)</option>
                          <option value="Removed">🔴 Removed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-mountain-gray/10">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-mountain-gray hover:bg-mountain-sand transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-mountain-moss text-white hover:bg-mountain-brown shadow-lg shadow-mountain-moss/20 transition-all text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Print Badge Modal ── */}
      <AnimatePresence>
        {isPrinting && selectedWorker && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-mountain-brown/80 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          >
            <div className="bg-mountain-sand p-8 rounded-3xl shadow-2xl mb-6 relative">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-mountain-gray mb-6">ID Card Preview (Standard 85.6mm × 54mm)</p>
              
              {/* Actual printable component */}
              <div className="shadow-[0_10px_40px_rgba(0,0,0,0.2)] rounded-xl overflow-hidden border border-black/5 bg-white">
                <BadgeToPrint ref={printRef} worker={selectedWorker} />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setIsPrinting(false)} className="px-6 py-3 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-colors">
                Cancel
              </button>
              <button onClick={() => handlePrint()} className="px-6 py-3 rounded-xl font-bold bg-mountain-gold text-mountain-brown hover:bg-white shadow-lg transition-all flex items-center gap-2">
                <Printer className="w-5 h-5" /> Print ID Badge
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkerManagement;

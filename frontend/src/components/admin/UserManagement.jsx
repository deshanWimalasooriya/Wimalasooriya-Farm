import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, FileEdit, Trash2, Shield, ShieldCheck, ShieldAlert, X, Check, Loader2, AlertTriangle, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Edit Form State
  const [editForm, setEditForm] = useState({ name: '', email: '', isAdmin: false, isManager: false });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (u) => {
    setSelectedUser(u);
    setEditForm({ name: u.name, email: u.email, isAdmin: u.isAdmin, isManager: u.isManager });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (u) => {
    setSelectedUser(u);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const { data } = await axios.put(`/api/admin/users/${selectedUser._id}`, editForm);
      setUsers(users.map(u => u._id === data._id ? { ...u, ...data } : u));
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setIsSaving(true);
      await axios.delete(`/api/admin/users/${selectedUser._id}`);
      setUsers(users.filter(u => u._id !== selectedUser._id));
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const activeAdmins = users.filter(u => u.isAdmin).length;
  const activeManagers = users.filter(u => u.isManager).length;

  return (
    <div className="space-y-6">
      {/* ── KPI SECTION ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="p-5 rounded-2xl shadow-lg border flex items-center gap-4 bg-white/85 backdrop-blur-sm"
          style={{ borderColor: 'rgba(147, 99, 31, 0.2)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Users</p>
            <p className="text-2xl font-black text-gray-800">{totalUsers}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 rounded-2xl shadow-lg border flex items-center gap-4 bg-white/85 backdrop-blur-sm"
          style={{ borderColor: 'rgba(147, 99, 31, 0.2)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 text-red-600 border border-red-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Admins</p>
            <p className="text-2xl font-black text-gray-800">{activeAdmins}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 rounded-2xl shadow-lg border flex items-center gap-4 bg-white/85 backdrop-blur-sm"
          style={{ borderColor: 'rgba(147, 99, 31, 0.2)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50 text-green-600 border border-green-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Managers</p>
            <p className="text-2xl font-black text-gray-800">{activeManagers}</p>
          </div>
        </motion.div>
      </div>

      {/* ── MAIN TABLE SECTION ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl shadow-lg border overflow-hidden bg-white/85 backdrop-blur-sm flex flex-col"
        style={{ borderColor: 'rgba(147, 99, 31, 0.2)', minHeight: '400px' }}
      >
        {/* Header & Search */}
        <div className="p-5 border-b border-gray-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#93631F]" /> User Directory
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#93631F]/50 transition-all bg-white/80"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#93631F] mb-4" />
              <p className="text-gray-500 font-medium">Loading user data...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center px-4">
              <User className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-800 font-bold text-lg">No users found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search terms.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role Access</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4C579] to-[#93631F] flex items-center justify-center text-white font-bold shadow-sm">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {u.isAdmin ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        ) : null}
                        {u.isManager ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Manager
                          </span>
                        ) : null}
                        {!u.isAdmin && !u.isManager && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 shadow-sm flex items-center gap-1">
                            <User className="w-3 h-3" /> User
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200/50"
                          title="Edit User"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(u)}
                          disabled={u._id === currentUser?._id}
                          className={`p-2 rounded-lg transition-colors border ${
                            u._id === currentUser?._id
                              ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                              : 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200/50'
                          }`}
                          title={u._id === currentUser?._id ? "Cannot delete yourself" : "Delete User"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* ── EDIT MODAL ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-[#93631F]" /> Edit User
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                  <input
                    type="text" required
                    value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#93631F]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                  <input
                    type="email" required
                    value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#93631F]/50 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Role Access</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={editForm.isAdmin}
                        onChange={e => setEditForm({...editForm, isAdmin: e.target.checked})}
                        disabled={selectedUser._id === currentUser?._id}
                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-600"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Admin Privileges</p>
                        <p className="text-xs text-gray-500">Full system access including user management.</p>
                      </div>
                      <Shield className={`w-5 h-5 ${editForm.isAdmin ? 'text-red-600' : 'text-gray-300'}`} />
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={editForm.isManager}
                        onChange={e => setEditForm({...editForm, isManager: e.target.checked})}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-600"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Manager Privileges</p>
                        <p className="text-xs text-gray-500">Can manage farm operations, inventory, and workers.</p>
                      </div>
                      <ShieldCheck className={`w-5 h-5 ${editForm.isManager ? 'text-green-600' : 'text-gray-300'}`} />
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#52311B] hover:bg-[#372E19] transition-colors flex items-center gap-2 shadow-md">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => !isSaving && setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center border border-red-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete User?</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-gray-700">{selectedUser.name}</span>? This action cannot be undone.
              </p>
              
              {selectedUser.isAdmin && (
                 <div className="mb-6 p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-medium text-left flex gap-2">
                   <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                   Warning: This user is an Admin. The backend will prevent deleting admins for safety. Remove admin role first to delete.
                 </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  Yes, Delete User
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;

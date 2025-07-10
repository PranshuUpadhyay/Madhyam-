import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { donorService } from '../api/services';
import { donationService } from '../api/services';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editDonation, setEditDonation] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    if (!user || user.role !== 'donor') {
      navigate('/login');
      return;
    }
    if (user?.id) fetchDonations();
  }, [user]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      // Get donations directly by user ID
      const res = await donationService.getUserDonations(user.id);
      const data = res.data?.data || [];
      setDonations(data);
      setStats({
        total: data.length,
        active: data.filter(d => d.status === 'active').length,
        completed: data.filter(d => d.status === 'completed').length
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
      // If there's an error, just set empty donations (user might not be registered as donor yet)
      setDonations([]);
      setStats({ total: 0, active: 0, completed: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Modal for add/edit donation (mock for now)
  const DonationModal = () => {
    const [form, setForm] = useState(editDonation || { item: '', type: 'food', status: 'active' });
    const [submitting, setSubmitting] = useState(false);
    return (
      <Modal onClose={() => { setShowModal(false); setEditDonation(null); }}>
        <h2 className="text-xl font-bold mb-4">{editDonation ? 'Edit Donation' : 'Add Donation'}</h2>
        <form className="space-y-4" onSubmit={async e => {
          e.preventDefault();
          setSubmitting(true);
          try {
            await donationService.createDonation({ ...form, userId: user.id });
            setShowModal(false);
            setEditDonation(null);
            fetchDonations();
          } catch (error) {
            console.error('Error creating donation:', error);
            alert('Failed to create donation. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}>
          <div>
            <label className="block font-semibold">Item</label>
            <input className="w-full border rounded px-3 py-2" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} required />
          </div>
          <div>
            <label className="block font-semibold">Type</label>
            <select className="w-full border rounded px-3 py-2" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="food">Food</option>
              <option value="clothes">Clothes</option>
              <option value="books">Books</option>
              <option value="money">Money</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Status</label>
            <select className="w-full border rounded px-3 py-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => { setShowModal(false); setEditDonation(null); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={submitting}>{editDonation ? 'Update' : submitting ? 'Adding...' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    );
  };

  function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative max-h-screen overflow-y-auto">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <header className="flex items-center justify-between px-8 py-6 bg-white shadow-sm sticky top-0 z-10">
        <span className="text-2xl font-bold text-blue-800 tracking-tight">Donor Dashboard</span>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors" onClick={() => setShowModal(true)}>
          + Add Donation
        </button>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Donations" value={stats.total} color="from-blue-400 to-blue-600" icon="🎁" />
          <StatCard label="Active" value={stats.active} color="from-green-400 to-green-600" icon="✅" />
          <StatCard label="Completed" value={stats.completed} color="from-yellow-400 to-yellow-600" icon="🏁" />
        </motion.div>
        {/* Donation List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-white shadow p-6">
          {donations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Donations Yet</h3>
              <p className="text-gray-500 mb-4">Start making a difference by adding your first donation!</p>
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => setShowModal(true)}
              >
                + Add Your First Donation
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-blue-700">
                  <th className="py-2">Item</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d.id || i} className="border-t hover:bg-blue-50 transition">
                    <td className="py-2 font-semibold">{d.item}</td>
                    <td className="capitalize">{d.type}</td>
                    <td className={d.status === 'completed' ? 'text-green-600 font-bold' : ''}>{d.status}</td>
                    <td className="text-right">
                      <button className="px-3 py-1 text-blue-600 hover:underline" onClick={() => { setEditDonation(d); setShowModal(true); }}>Edit</button>
                      <button className="px-3 py-1 text-red-600 hover:underline" onClick={() => setDonations(donations.filter(x => x.id !== d.id))}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
        {/* Modal */}
        <AnimatePresence>{showModal && <DonationModal />}</AnimatePresence>
      </main>
    </div>
  );
};

function StatCard({ label, value, color, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${color} text-white flex flex-col items-center justify-center`}>
      <span className="text-4xl mb-2">{icon}</span>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-lg mt-1 font-semibold tracking-wide">{label}</span>
    </motion.div>
  );
}

export default DonorDashboard; 

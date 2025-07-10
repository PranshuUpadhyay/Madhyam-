import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/apiInstance';
import madhayamLogo from '../assets/madhayam_logo-removebg-preview.png';

const TABS = [
  { label: 'Users', value: 'users' },
  { label: 'Donors', value: 'donors' },
  { label: 'Volunteers', value: 'volunteers' },
  { label: 'Specials', value: 'specials' }
];

const Admin = () => {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editSpecial, setEditSpecial] = useState(null);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ users: 0, donors: 0, volunteers: 0, specials: 0, featured: 0 });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const usersRes = await axios.get('/auth/users');
        setUsers(usersRes.data.data || []);
        const donorsRes = await axios.get('/donors');
        setDonors(donorsRes.data.data || []);
        const volunteersRes = await axios.get('/volunteers');
        setVolunteers(volunteersRes.data.data || []);
        const specialsRes = await axios.get('/specials');
        setSpecials(specialsRes.data || []);
        setStats(s => ({
          ...s,
          users: usersRes.data.data?.length || 0,
          donors: donorsRes.data.data?.length || 0,
          volunteers: volunteersRes.data.data?.length || 0,
          specials: specialsRes.data?.length || 0,
          featured: (specialsRes.data || []).filter(sp => sp.isSpecial).length
        }));
      } catch {
        setUsers([]);
        setDonors([]);
        setVolunteers([]);
        setSpecials([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setStats(s => ({ ...s, users: users.length }));
  }, [users]);

  // Filtered lists
  const filteredUsers = users.filter(u => (u.firstName + ' ' + u.lastName).toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const filteredDonors = donors.filter(d => (d.user?.firstName + ' ' + d.user?.lastName).toLowerCase().includes(search.toLowerCase()) || d.user?.email.toLowerCase().includes(search.toLowerCase()));
  const filteredVolunteers = volunteers.filter(v => (v.firstName + ' ' + v.lastName).toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()));
  const filteredSpecials = specials.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  // User Modal (Add/Edit)
  const UserModal = () => {
    const [form, setForm] = useState(editUser || { name: '', email: '', role: 'donor' });
    return (
      <Modal onClose={() => { setShowUserModal(false); setEditUser(null); }}>
        <h2 className="text-xl font-bold mb-4">{editUser ? 'Edit User' : 'Add User'}</h2>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); /* handle add/edit */ setShowUserModal(false); setEditUser(null); }}>
          <div>
            <label className="block font-semibold">Name</label>
            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="block font-semibold">Role</label>
            <select className="w-full border rounded px-3 py-2" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="admin">Admin</option>
              <option value="donor">Donor</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => { setShowUserModal(false); setEditUser(null); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{editUser ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    );
  };

  // Special Modal (Add/Edit)
  const SpecialModal = () => {
    const [form, setForm] = useState(editSpecial || { name: '', description: '', price: '', category: 'food', isSpecial: false, image: null });
    return (
      <Modal onClose={() => { setShowSpecialModal(false); setEditSpecial(null); }}>
        <h2 className="text-xl font-bold mb-4">{editSpecial ? 'Edit Special' : 'Add Special'}</h2>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); /* handle add/edit */ setShowSpecialModal(false); setEditSpecial(null); }}>
          <div>
            <label className="block font-semibold">Name</label>
            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block font-semibold">Description</label>
            <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold">Price (₹)</label>
              <input className="w-full border rounded px-3 py-2" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>
            <div className="flex-1">
              <label className="block font-semibold">Category</label>
              <select className="w-full border rounded px-3 py-2" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="food">Food</option>
                <option value="beverage">Beverage</option>
                <option value="dessert">Dessert</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isSpecial} onChange={e => setForm(f => ({ ...f, isSpecial: e.target.checked }))} /> Featured
            </label>
            <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))} />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => { setShowSpecialModal(false); setEditSpecial(null); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{editSpecial ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    );
  };

  // Modal wrapper
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
        <div className="flex items-center gap-4">
          <img src={madhayamLogo} alt="Madhyam Logo" className="h-10" />
          <span className="text-2xl font-bold text-blue-800 tracking-tight">Madhyam Admin</span>
        </div>
        <div className="flex gap-4">
          <button className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${tab === 'users' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`} onClick={() => setTab('users')}>Users</button>
          <button className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${tab === 'donors' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`} onClick={() => setTab('donors')}>Donors</button>
          <button className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${tab === 'volunteers' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`} onClick={() => setTab('volunteers')}>Volunteers</button>
          <button className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${tab === 'specials' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`} onClick={() => setTab('specials')}>Specials</button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto py-8 px-4">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Users" value={stats.users} color="from-blue-400 to-blue-600" icon="👥" />
          <StatCard label="Menu Items" value={stats.specials} color="from-yellow-400 to-yellow-600" icon="🍽️" />
          <StatCard label="Featured" value={stats.featured} color="from-pink-400 to-pink-600" icon="⭐" />
        </motion.div>
        {/* Search */}
        <div className="flex justify-between items-center mb-6">
          <input className="border rounded px-4 py-2 w-full max-w-xs" placeholder={`Search ${tab === 'users' ? 'users' : 'specials'}...`} value={search} onChange={e => setSearch(e.target.value)} />
          <AnimatePresence>
            {tab === 'users' && (
              <motion.button whileTap={{ scale: 0.95 }} className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors" onClick={() => setShowUserModal(true)}>
                + Add User
              </motion.button>
            )}
            {tab === 'specials' && (
              <motion.button whileTap={{ scale: 0.95 }} className="ml-4 px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors" onClick={() => setShowSpecialModal(true)}>
                + Add Special
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {/* Tab Content */}
        <div>
          {tab === 'users' ? (
            <UserList users={filteredUsers} onEdit={u => { setEditUser(u); setShowUserModal(true); }} onDelete={u => setUsers(users.filter(x => x.id !== u.id))} />
          ) : tab === 'donors' ? (
            <DonorList donors={filteredDonors} />
          ) : tab === 'volunteers' ? (
            <VolunteerList volunteers={filteredVolunteers} />
          ) : (
            <SpecialList specials={filteredSpecials} onEdit={s => { setEditSpecial(s); setShowSpecialModal(true); }} onDelete={s => setSpecials(specials.filter(x => x.id !== s.id))} />
          )}
        </div>
        {/* Modals */}
        <AnimatePresence>{showUserModal && <UserModal />}</AnimatePresence>
        <AnimatePresence>{showSpecialModal && <SpecialModal />}</AnimatePresence>
      </main>
    </div>
  );
};

// Stat Card
function StatCard({ label, value, color, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${color} text-white flex flex-col items-center justify-center`}>
      <span className="text-4xl mb-2">{icon}</span>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-lg mt-1 font-semibold tracking-wide">{label}</span>
    </motion.div>
  );
}

// User List
function UserList({ users, onEdit, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-white shadow p-6">
      <table className="w-full text-left">
        <thead>
          <tr className="text-blue-700">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t hover:bg-blue-50 transition">
              <td className="py-2 font-semibold">{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td className="capitalize">{u.role}</td>
              <td className="text-right">
                <button className="px-3 py-1 text-blue-600 hover:underline" onClick={() => onEdit(u)}>Edit</button>
                <button className="px-3 py-1 text-red-600 hover:underline" onClick={() => onDelete(u)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

// Special List
function SpecialList({ specials, onEdit, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-white shadow p-6">
      <table className="w-full text-left">
        <thead>
          <tr className="text-yellow-700">
            <th className="py-2">Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Featured</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {specials.map(s => (
            <tr key={s.id} className="border-t hover:bg-yellow-50 transition">
              <td className="py-2 font-semibold">{s.name}</td>
              <td className="truncate max-w-xs">{s.description}</td>
              <td>₹{s.price}</td>
              <td className="capitalize">{s.category}</td>
              <td>{s.isSpecial ? <span className="text-yellow-600 font-bold">⭐</span> : ''}</td>
              <td className="text-right">
                <button className="px-3 py-1 text-blue-600 hover:underline" onClick={() => onEdit(s)}>Edit</button>
                <button className="px-3 py-1 text-red-600 hover:underline" onClick={() => onDelete(s)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function DonorList({ donors }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-blue-700">
          <th>Name</th>
          <th>Email</th>
          <th>Type</th>
          <th>City</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {donors.map((d, i) => (
          <tr key={d.id || i} className="border-t hover:bg-blue-50 transition">
            <td>{d.user?.firstName} {d.user?.lastName}</td>
            <td>{d.user?.email}</td>
            <td>{d.donationType}</td>
            <td>{d.city}</td>
            <td>{d.isAvailable ? 'Available' : 'Unavailable'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VolunteerList({ volunteers }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-blue-700">
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Organization</th>
        </tr>
      </thead>
      <tbody>
        {volunteers.map((v, i) => (
          <tr key={v.id || i} className="border-t hover:bg-blue-50 transition">
            <td>{v.firstName} {v.lastName}</td>
            <td>{v.email}</td>
            <td>{v.role}</td>
            <td>{v.organization}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Admin; 
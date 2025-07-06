import React, { useState } from 'react';
import axios from '../api/apiInstance';
import backgroundImage from '../assets/img/bg_blog.png';

export default function VolunteerSignIn() {
const [form, setForm] = useState({
email: '',
password: '',
role: '',
organization: '',
});
const [status, setStatus] = useState('');

const handleChange = (e) => {
const { name, value } = e.target;
setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
e.preventDefault();
setStatus('');
try {
const res = await axios.post('/volunteer/login', form);
setStatus('Successfully signed in!');
// TODO: handle redirect or auth context update
} catch (error) {
setStatus('Failed to sign in. Please check your credentials.');
}
};

return (
<section
className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 py-16"
style={{ backgroundImage: `url(${backgroundImage})` }}
>
<div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md max-w-xl w-full">
<h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
Volunteer Sign In
</h1>

    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="border border-gray-300 p-2 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="border border-gray-300 p-2 rounded"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        required
        className="border border-gray-300 p-2 rounded"
      >
        <option value="">Select Your Role</option>
        <option value="coordinator">Coordinator</option>
        <option value="driver">Driver</option>
        <option value="packer">Food Packer</option>
        <option value="distributor">Distributor</option>
        <option value="admin">Admin</option>
      </select>
      <input
        type="text"
        name="organization"
        placeholder="Organization (Optional)"
        value={form.organization}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Sign In
      </button>
      {status && (
        <p className="text-center text-sm text-green-700">{status}</p>
      )}
    </form>
  </div>
</section>

);
}
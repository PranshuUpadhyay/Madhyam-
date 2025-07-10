import React, { useState } from 'react';
import axios from '../api/apiInstance';
import { FaUserCheck, FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function VolunteerSignIn() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '',
    organization: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email.';
    if (!form.password) errs.password = 'Password is required.';
    if (!form.role) errs.role = 'Role is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/volunteer/login', form);
      // Store volunteer info and token in localStorage
      localStorage.setItem('volunteer', JSON.stringify(response.data.volunteer));
      localStorage.setItem('token', response.data.token);
      setStatus('Successfully signed in!');
      setForm({ email: '', password: '', role: '', organization: '' });
      // Redirect to dashboard after short delay
      setTimeout(() => navigate('/volunteer/dashboard'), 1000);
    } catch (error) {
      setStatus('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-16 flex flex-col items-center justify-center">
      {/* Hero/Intro */}
      <div className="max-w-xl w-full mb-8 text-center">
        <FaUserCheck className="mx-auto text-blue-600 text-5xl mb-2" />
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Volunteer Sign In</h1>
        <p className="text-gray-500 mb-2">Welcome back! Sign in to access your volunteer dashboard and make a difference today.</p>
        <Link to="/volunteer/register" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold text-lg transition-all duration-150">
          <FaUserPlus className="inline mr-2 mb-1" /> Become a Volunteer
        </Link>
      </div>
      {/* Card */}
      <div className="bg-white bg-opacity-95 p-8 rounded-lg shadow-md max-w-xl w-full">
        {status === 'Successfully signed in!' ? (
          <div className="text-center">
            <FaUserCheck className="mx-auto text-green-500 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Welcome, Volunteer!</h2>
            <p className="mb-4 text-gray-600">You have successfully signed in. Thank you for your service!</p>
            <Link to="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Go to Dashboard</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className={`border p-2 rounded ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={`border p-2 rounded ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className={`border p-2 rounded ${errors.role ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value="">Select Your Role</option>
              <option value="coordinator">Coordinator</option>
              <option value="driver">Driver</option>
              <option value="packer">Food Packer</option>
              <option value="distributor">Distributor</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
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
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              ) : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            {status && status !== 'Successfully signed in!' && (
              <p className="text-center text-sm text-red-600">{status}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
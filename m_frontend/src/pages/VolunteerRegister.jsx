import React, { useState } from 'react';
import axios from '../api/apiInstance';
import { useNavigate } from 'react-router-dom';

export default function VolunteerRegister() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
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
    if (!form.firstName) errs.firstName = 'First name is required.';
    if (!form.lastName) errs.lastName = 'Last name is required.';
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
      await axios.post('/volunteers', form);
      setStatus('Successfully registered! Redirecting to sign in...');
      setTimeout(() => navigate('/volunteer-signin'), 2000);
    } catch (error) {
      setStatus('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-16 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Volunteer Registration</h1>
        <p className="text-gray-500 mb-2">Join our team of volunteers and help make a difference!</p>
      </div>
      <div className="bg-white bg-opacity-95 p-8 rounded-lg shadow-md max-w-xl w-full">
        {status === 'Successfully registered! Redirecting to sign in...' ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Registration Successful!</h2>
            <p className="mb-4 text-gray-600">You will be redirected to sign in shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className={`border p-2 rounded ${errors.firstName ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.firstName && <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>}
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className={`border p-2 rounded ${errors.lastName ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.lastName && <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>}
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
              {loading ? 'Registering...' : 'Register'}
            </button>
            {status && status !== 'Successfully registered! Redirecting to sign in...' && (
              <p className="text-center text-sm text-red-600">{status}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
} 
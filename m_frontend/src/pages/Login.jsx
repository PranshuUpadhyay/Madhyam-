import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { baseURL } from '../api/apiInstance';
import divider from '../assets/divider.svg'; 

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      const { token } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <section className="py-20 px-4 max-w-xl mx-auto bg-red-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-500">Log In</h1>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" className="border border-gray-300 p-2 rounded" required onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="border border-gray-300 p-2 rounded" required onChange={handleChange} />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Log In</button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
      </p>

      <div className="grid gap-4 mt-8">
        <a href={`${baseURL}/auth/google`} className="flex items-center justify-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100 transition text-red-600">Log in with Google</a>
        <a href={`${baseURL}/auth/facebook`} className="flex items-center justify-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100 transition text-blue-600">Log in with Facebook</a>
        <a href={`${baseURL}/auth/twitter`} className="flex items-center justify-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100 transition text-blue-400">Log in with Twitter</a>
      </div>
    </section>
  );
}

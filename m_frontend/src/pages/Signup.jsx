import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import axios, { baseURL } from '../api/apiInstance';

export default function Signup() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/signup', form);
      const { token } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    }
  };

  return (
    <section className="py-20 px-4 max-w-xl mx-auto bg-red-50 ">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-500">Sign Up</h1>

      <div className="grid gap-4 mb-8">
        <a
          href={`${baseURL}/auth/google`}
          className="flex items-center justify-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100 transition text-red-600"
        >
          <FcGoogle className="text-xl" /> Sign up with Google
        </a>
        <a
          href={`${baseURL}/auth/facebook`}
          className="flex items-center justify-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100 transition text-blue-600"
        >
          <FaFacebook className="text-xl" /> Sign up with Facebook
        </a>
        <a
          href={`${baseURL}/auth/twitter`}
          className="flex items-center justify-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100 transition text-blue-400"
        >
          <FaTwitter className="text-xl" /> Sign up with Twitter
        </a>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input name="firstname" type="text" placeholder="Firstname" className="border border-gray-300 p-2 rounded" required onChange={handleChange} />
        <input name="lastname" type="text" placeholder="Lastname" className="border border-gray-300 p-2 rounded" required onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" className="border border-gray-300 p-2 rounded" required onChange={handleChange} />
        <input name="contact" type="tel" placeholder="Contact No." maxLength="10" className="border border-gray-300 p-2 rounded" required onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="border border-gray-300 p-2 rounded" required onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" className="border border-gray-300 p-2 rounded" required onChange={handleChange} />
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Sign me up</button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
      </p>
    </section>
  );
}

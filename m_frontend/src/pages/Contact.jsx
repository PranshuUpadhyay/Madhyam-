import React, { useState, useEffect } from 'react';
import contactIllustration from '../assets/img/contact-bg.png';
import divider from '../assets/divider.svg';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { contactService, handleApiError } from '../api/services.js';
import apiInstance from '../api/apiInstance.js';

const defaultPosition = [28.6139, 77.2090]; // Example: New Delhi
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Contact component rendered');
  }

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('Testing API connection...');
        }
        const response = await apiInstance.get('/');
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ API connection successful');
        }
      } catch (error) {
        console.error('❌ API connection failed:', error.message);
        setErrors(prev => ({ ...prev, api: 'Cannot connect to server. Please check your connection.' }));
      }
    };
    
    testApiConnection();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name || !form.name.trim()) errs.name = 'Name is required.';
    if (!form.email || !form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email.';
    if (!form.message || !form.message.trim()) errs.message = 'Message is required.';
    return errs;
  };

  const handleChange = e => {
    // Add safety check for event object
    if (!e || !e.target) {
      console.error('Invalid event object in handleChange:', e);
      return;
    }
    
    console.log('Form field changed:', e.target.name, e.target.value);
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: undefined }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    
    setLoading(true);
    try {
      await contactService.submitContact(form);
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setErrors({}); // Clear any previous errors
    } catch (error) {
      const errorInfo = handleApiError(error);
      setErrors(prev => ({ ...prev, submit: errorInfo.message }));
      console.error('Contact submission error:', errorInfo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-20 px-4 min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${contactIllustration})` }}
    >
      <div className="w-full max-w-4xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">
        {/* Left: Form */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-800">Connect with Us</h1>
          <div className="mb-6 flex justify-start">
            <img src={divider} alt="divider" className="w-32 md:w-48" />
          </div>
          {submitted ? (
            <div className="text-green-700 text-lg font-semibold py-8 text-center">
              Thank you for reaching out! We'll get back to you soon.
            </div>
          ) : (
            <form className="grid gap-4 text-left" onSubmit={handleSubmit} noValidate>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className={`border p-2 rounded w-full ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`border p-2 rounded w-full ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  className={`border p-2 rounded w-full ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
                ></textarea>
                {errors.message && <div className="text-red-500 text-xs mt-1">{errors.message}</div>}
              </div>
              {errors.api && <div className="text-red-500 text-sm text-center mb-4">{errors.api}</div>}
              {errors.submit && <div className="text-red-500 text-sm text-center">{errors.submit}</div>}
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
        {/* Right: Map */}
        <div className="flex-1 w-full max-w-xs md:max-w-sm">
          <div className="rounded-lg overflow-hidden shadow-lg border border-blue-100">
            <MapContainer
              center={defaultPosition}
              zoom={13}
              style={{ height: '250px', width: '100%' }}
              scrollWheelZoom={false}
              dragging={true}
              doubleClickZoom={false}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={defaultPosition} icon={customIcon}>
                <Popup>
                  <div className="text-center">
                    <strong>Madhyam HQ</strong>
                    <div>New Delhi, India</div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="mt-4 text-center text-gray-600 text-sm">
            <strong>Our Location:</strong><br />New Delhi, India
          </div>
        </div>
      </div>
    </section>
  );
}

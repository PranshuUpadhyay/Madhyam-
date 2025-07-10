import React, { useEffect, useState } from 'react';
import axios from '../api/apiInstance';
import backgroundImage from '../assets/img/bg_blog.png';
import a1 from '../assets/img/a1.PNG';
import a2 from '../assets/img/a2.PNG';
import a3 from '../assets/img/a3.PNG';
import a4 from '../assets/img/a4.PNG';
import a5 from '../assets/img/a5.PNG';
import { FaQuoteLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([
    {
      name: 'Aarav Sharma',
      role: 'Food Collection Lead',
      bio: 'Coordinates pickups and ensures safe packaging of food.',
      avatarUrl: a1
    },
    {
      name: 'Meera Jain',
      role: 'Outreach Coordinator',
      bio: 'Connects with NGOs and community centers for distribution.',
      avatarUrl: a2
    },
    {
      name: 'Ravi Patel',
      role: 'Logistics Support',
      bio: 'Manages transportation and timely delivery.',
      avatarUrl: a3
    },
    {
      name: 'Ananya Das',
      role: 'Volunteer Trainer',
      bio: 'Trains new volunteers on food safety and hygiene.',
      avatarUrl: a4
    },
    {
      name: 'Ishaan Verma',
      role: 'Tech Support',
      bio: 'Maintains the digital platform and user support.',
      avatarUrl: a5
    }
  ]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get('/volunteers');
        if (res.data.length > 0) setVolunteers(res.data);
      } catch (err) {
        console.error('Error fetching volunteers:', err);
      }
    };
    fetchVolunteers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-700 via-blue-500 to-purple-600 bg-opacity-90 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Meet Our Volunteers</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Our volunteers are the heart of Madhyam. They collect, pack, and distribute food, spreading kindness and hope in every community.
        </p>
        <Link to="/Volunteer-login">
          <button className="px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-lg shadow hover:bg-yellow-300 transition-all text-lg">
            Join as Volunteer
          </button>
        </Link>
      </section>

      {/* Volunteer Grid */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {volunteers.map((vol, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition duration-300 flex flex-col items-center border-t-4 border-blue-500"
            >
              <div className="w-24 h-24 mb-4 relative">
                <img
                  src={vol.avatarUrl || '/assets/avatar-placeholder.png'}
                  alt={vol.name}
                  className="rounded-full object-cover w-full h-full border-4 border-blue-200"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
                  {vol.role}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-700 mt-2">{vol.name}</h3>
              <p className="mt-2 text-center text-gray-600 text-sm">{vol.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Volunteer/Testimonial Section */}
      <section className="py-16 px-4 bg-white bg-opacity-90">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">Why Volunteer with Madhyam?</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="flex-1 bg-blue-50 p-6 rounded-lg shadow flex flex-col items-center">
              <FaQuoteLeft className="text-blue-400 text-3xl mb-2" />
              <p className="text-lg italic mb-2">“Volunteering with Madhyam gave me purpose and a new family. Every meal shared is a story of hope.”</p>
              <span className="text-blue-700 font-semibold">— Meera Jain</span>
            </div>
            <div className="flex-1 bg-blue-50 p-6 rounded-lg shadow flex flex-col items-center">
              <FaQuoteLeft className="text-blue-400 text-3xl mb-2" />
              <p className="text-lg italic mb-2">“I learned so much about teamwork and compassion. The impact we make is real and lasting.”</p>
              <span className="text-blue-700 font-semibold">— Aarav Sharma</span>
            </div>
          </div>
          <div className="mt-10">
            <Link to="/Volunteer-login">
              <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all text-lg">
                Become a Volunteer
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

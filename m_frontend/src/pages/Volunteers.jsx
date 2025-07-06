import React, { useEffect, useState } from 'react';
import axios from '../api/apiInstance';
import backgroundImage from '../assets/img/bg_blog.png';
import a1 from '../assets/img/a1.PNG';
import a2 from '../assets/img/a2.PNG';
import a3 from '../assets/img/a3.PNG';
import a4 from '../assets/img/a4.PNG';
import a5 from '../assets/img/a5.PNG';

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
    <section className="min-h-screen py-16 px-4 " style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Our Volunteers</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {volunteers.map((vol, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            <div className="w-24 h-24 mx-auto mb-4">
              <img
                src={vol.avatarUrl || '/assets/avatar-placeholder.png'}
                alt={vol.name}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-700">{vol.name}</h3>
            <p className="text-center text-sm text-gray-500">{vol.role}</p>
            <p className="mt-2 text-center text-gray-600 text-sm">{vol.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

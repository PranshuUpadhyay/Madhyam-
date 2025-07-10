import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { donorService } from '../api/services';
import divider from '../assets/divider.svg';
import teamImg from '../assets/madhayam_logo.jpg';
import { 
  Users, 
  Heart, 
  Globe, 
  Target, 
  Smile
} from 'lucide-react';

const timeline = [
  {
    year: '2022',
    title: 'The Idea',
    text: 'Madhyam was born from a simple question: How can we bridge the gap between surplus and scarcity? Our founders saw food being wasted while people nearby went hungry. They decided to act.',
    color: 'from-pink-500 to-purple-600',
    icon: '💡'
  },
  {
    year: '2023',
    title: 'First Steps',
    text: 'We started with a handful of volunteers, collecting surplus food from local restaurants and sharing it with those in need. The response was overwhelming.',
    color: 'from-blue-500 to-cyan-600',
    icon: '🚀'
  },
  {
    year: '2024',
    title: 'Growing Impact',
    text: 'With community support, we expanded to new cities, built partnerships, and launched our digital platform to connect donors and recipients in real time.',
    color: 'from-green-500 to-emerald-600',
    icon: '🌱'
  },
  {
    year: '2025',
    title: 'Today & Beyond',
    text: 'Madhyam is now a movement. We empower individuals, businesses, and organizations to make a difference—one meal, one act of kindness at a time.',
    color: 'from-orange-500 to-red-600',
    icon: '🌟'
  }
];

const About = () => {
  const navigate = useNavigate();
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery(
    'summaryStats',
    donorService.getSummaryStats,
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: 1000,
    }
  );
  const stats = statsData?.data?.data || { donors: 0, donations: 0, cities: 0, successRate: 0, completedDonations: 0, activeDonations: 0 };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-[300px] md:h-[400px] text-center text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-fuchsia-600/90" />
        <div className="relative z-10 max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Madhyam connects surplus with need, turning food waste into hope. We believe everyone deserves a meal—and a chance to help.
          </p>
        </div>
        {/* Subtle floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-10 left-10 text-3xl opacity-60">🌟</motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute top-20 right-20 text-2xl opacity-60">💫</motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 12, repeat: Infinity, delay: 4 }} className="absolute bottom-20 left-1/4 text-xl opacity-60">✨</motion.div>
        </div>
      </section>
      {/* Divider */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
        <div className="max-w-6xl mx-auto py-6">
          <img src={divider} alt="divider" className="w-full max-w-4xl mx-auto" />
        </div>
      </div>
      {/* Timeline / Story Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How We Got Here</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our journey is one of community, compassion, and action. Here's how Madhyam grew from an idea to a movement.</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="border-l-4 border-gradient-to-b from-pink-400 via-purple-400 to-blue-400 absolute h-full left-6 top-0" />
            <ul className="space-y-12">
              {timeline.map((item, idx) => (
                <li key={item.year} className="relative flex items-start">
                  <div className="flex flex-col items-center mr-8">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} text-white flex items-center justify-center text-xl font-bold mb-2 shadow-lg`}>
                      {item.icon}
                    </div>
                    {idx < timeline.length - 1 && <div className="flex-1 w-1 bg-gradient-to-b from-pink-400 to-purple-400 h-full" />}
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 flex-1 border-l-4 border-gradient-to-r from-pink-400 to-purple-400">
                    <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{item.title}</h3>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="py-16 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl shadow-lg mb-6">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3"><Target className="w-8 h-8" />Our Mission</h2>
              <p className="text-lg">To eliminate food waste and hunger by connecting those with surplus to those in need, using technology and the power of community.</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3"><Globe className="w-8 h-8" />Our Vision</h2>
              <p className="text-lg">A world where no food goes to waste and no one goes hungry. Where giving is easy, and everyone can make a difference.</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <img src={teamImg} alt="Madhyam Team" className="rounded-2xl shadow-2xl w-80 h-80 object-cover border-4 border-gradient-to-r from-green-400 to-blue-500" />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-full shadow-lg"><Smile className="w-6 h-6" /></div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white p-3 rounded-full shadow-lg"><Heart className="w-6 h-6" /></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Impact Stats */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          {statsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : statsError ? (
            <div className="text-center text-red-600 py-8">Failed to load stats.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-3"><Users className="w-10 h-10 text-yellow-300" /></div>
                <h3 className="text-3xl font-bold mb-1 text-yellow-300">{typeof stats.donors === 'number' ? stats.donors.toLocaleString() : '0'}</h3>
                <p className="text-blue-100">Active Donors</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl shadow-lg p-8 text-center text-white hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-3"><Heart className="w-10 h-10 text-pink-200" /></div>
                <h3 className="text-3xl font-bold mb-1 text-pink-200">{typeof stats.donations === 'number' ? stats.donations.toLocaleString() : '0'}</h3>
                <p className="text-pink-100">Total Donations</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-center text-white hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-3"><Heart className="w-10 h-10 text-green-200" /></div>
                <h3 className="text-3xl font-bold mb-1 text-green-200">{typeof stats.completedDonations === 'number' ? stats.completedDonations.toLocaleString() : '0'}</h3>
                <p className="text-green-100">Completed Donations</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-3"><Heart className="w-10 h-10 text-blue-200" /></div>
                <h3 className="text-3xl font-bold mb-1 text-blue-200">{typeof stats.activeDonations === 'number' ? stats.activeDonations.toLocaleString() : '0'}</h3>
                <p className="text-blue-100">Active Donations</p>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Join Our Mission</h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">Be part of the solution. Whether you want to donate, volunteer, or spread the word, every action counts.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/become-donor')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Become a Donor
            </button>
            <button 
              onClick={() => navigate('/volunteers')}
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              Join as Volunteer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

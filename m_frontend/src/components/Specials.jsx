import React, { useEffect, useState, useMemo } from 'react';
import axios from '../api/apiInstance';
import { motion } from 'framer-motion';

// Default images
import img1 from '../assets/img/special-1.png';
import img2 from '../assets/img/special-2.png';
import img3 from '../assets/img/special-3.png';
import img4 from '../assets/img/special-4.png';
import img5 from '../assets/img/special-5.png';
import img6 from '../assets/img/special-6.png';

// Default fallback specials
const defaultSpecials = [
{ name: 'Chole Chawal', desc: 'Loved all across India.', img: img1, category: 'food' },
{ name: 'Biryani', desc: 'Flavourful and generous.', img: img2, category: 'food' },
{ name: 'Poori Sabji', desc: 'A breakfast classic.', img: img3, category: 'food' },
{ name: 'Dal Rice', desc: 'Staple Indian lunch.', img: img4, category: 'food' },
{ name: 'South Indian', desc: 'Nutritious Idli & Dosa.', img: img5, category: 'food' },
{ name: 'Khichdi', desc: 'Most donated food.', img: img6, category: 'food' }
];

const categories = [
{ label: 'All', value: '' },
{ label: 'Food', value: 'food' },
{ label: 'Beverage', value: 'beverage' },
{ label: 'Dessert', value: 'dessert' },
{ label: 'Snack', value: 'snack' }
];

const Specials = () => {
  const [specials, setSpecials] = useState(defaultSpecials);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSpecials = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/specials');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSpecials(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch specials:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecials();
  }, []);

  const filteredSpecials = useMemo(() => {
    if (!selectedCategory) return specials;
    return specials.filter(s => (s.category || '').toLowerCase() === selectedCategory);
  }, [specials, selectedCategory]);

  return (
    <section id="specials" className="py-16 bg-gradient-to-br from-red-50 to-yellow-50 min-h-[60vh]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center md:text-left">This Month's Specials</h2>
          <div className="flex gap-2 justify-center md:justify-end">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-200 ${selectedCategory === cat.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredSpecials.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No specials found for this category.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredSpecials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition p-6 text-center flex flex-col border border-blue-100"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
              >
                <img
                  src={item.img || item.image || item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-2xl mb-4 border border-gray-100 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}
                />
                <h3 className="text-2xl font-bold mt-2 text-blue-800 tracking-tight mb-1">{item.name}</h3>
                <p className="text-gray-600 mt-2 flex-1 text-base italic">{item.desc || item.description}</p>
                {item.price && (
                  <div className="mt-4 text-lg font-bold text-green-700">
                    ₹{item.price}
                  </div>
                )}
                {item.isSpecial && (
                  <div className="mt-2 inline-block px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                    Featured
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Specials;
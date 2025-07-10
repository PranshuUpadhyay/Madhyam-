import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { label: 'All', value: '' },
  { label: 'Food', value: 'food' },
  { label: 'Beverage', value: 'beverage' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Snack', value: 'snack' }
];

const SpecialsGrid = ({ specials = [], showCategories = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredSpecials = useMemo(() => {
    if (!selectedCategory) return specials;
    return specials.filter(s => (s.category || '').toLowerCase() === selectedCategory);
  }, [specials, selectedCategory]);

  return (
    <div>
      {showCategories && (
        <div className="flex gap-2 justify-center md:justify-end mb-8">
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
      )}
      {filteredSpecials.length === 0 ? (
        <div className="text-center text-gray-500 py-16">No specials found{selectedCategory ? ` for ${selectedCategory}` : ''}.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredSpecials.map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition p-6 text-center flex flex-col border border-blue-100"
              style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
            >
              <img
                src={item.image && item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : (item.img || item.image || item.imageUrl)}
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
              {item.category && (
                <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold capitalize">
                  {item.category}
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
  );
};

export default SpecialsGrid; 
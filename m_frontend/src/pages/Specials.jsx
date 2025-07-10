import React, { useEffect, useState } from 'react';
import axios from '../api/apiInstance';
import SpecialsGrid from '../components/SpecialsGrid';

const Specials = () => {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSpecials = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/specials');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSpecials(res.data);
      } else if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
        setSpecials(res.data.data);
      } else {
        setSpecials([]);
      }
    } catch (err) {
      setSpecials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecials();
  }, []);

  return (
    <section id="specials" className="py-16 bg-gradient-to-br from-red-50 to-yellow-50 min-h-[60vh]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">All Menu Specials</h2>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <SpecialsGrid specials={specials} showCategories={true} />
        )}
      </div>
    </section>
  );
};

export default Specials;

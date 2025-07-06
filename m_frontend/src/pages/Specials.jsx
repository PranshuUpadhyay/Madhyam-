import React from 'react';
import Specials from '../components/Specials';

const SpecialsPage = () => {
  return (
    <div className="min-h-screen bg-red-50">
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Menu</h1>
        <p className="text-lg text-gray-600">Explore meals our community has shared recently.</p>
      </div>
      <Specials />
    </div>
  );
};

export default SpecialsPage;

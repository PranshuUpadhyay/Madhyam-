import React, { useEffect, useState } from 'react';
import hero1 from '../assets/img/hero01.PNG';
import hero2 from '../assets/img/hero02.PNG';
import divider from '../assets/divider.svg';

const images = [hero1, hero2];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Background image slider section */}
      <div
        className="h-[500px] flex items-center justify-center text-center text-white transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white bg-opacity-70 text-gray-400 p-8 rounded shadow-md max-w-2xl">
          <h1 className="text-4xl mb-4">Welcome to Madhyam :)</h1>
          <p className="text-lg">Browse nearby donors and reduce food waste</p>
        </div>
      </div>

      {/* Divider placed outside the slider for visibility */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto py-6">
          <img src={divider} alt="divider" className="w-full max-w-4xl mx-auto" />
        </div>
      </div>
    </>
  );
};

export default HeroSlider;

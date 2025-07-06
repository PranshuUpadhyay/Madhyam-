import React from 'react';
import HeroSlider from "../components/HeroSlider";
import CategoryIcons from '../components/CategoryIcons';
import Specials from '../components/Specials';
export default function Home() {
  return (

    <div>
      <HeroSlider />
      <CategoryIcons />
      <Specials />
    </div>
  );
}

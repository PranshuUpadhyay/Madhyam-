import React from 'react';
import vegeIcon from '../assets/icon-vege.svg';
import coffeeIcon from '../assets/icon-coffee.svg';
import sweetIcon from '../assets/icon-sweet.svg';
import bd from '../assets/yellow-bg.png';
const categories = [
  {
    icon: vegeIcon,
    title: "Why Waste Food?",
    text: "We share surplus food with those in need so everyone can enjoy a meal."
  },
  {
    icon: coffeeIcon,
    title: "Get Quality Assured food",
    text: "Choose tasteful and hygienic food with certified assurance."
  },
  {
    icon: sweetIcon,
    title: "Why Donate?",
    text: "No one can do everything, but everyone can do something."
  }
];

const CategoryIcons = () => (
  <section className="py-16 bg-yellow-50"
  style={{
      backgroundImage: `url(${bd})`
    }}>
    <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
      {categories.map((item, i) => (
        <div key={i}>
          <img src={item.icon} alt={item.title} className="mx-auto mb-4 h-20" />
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
          <p className="text-gray-700">{item.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default CategoryIcons;
import React, { useState, useEffect } from 'react';
import axios from '../api/apiInstance';
import divider from '../assets/divider.svg';

export default function Menu() {
const [tab, setTab] = useState('charities');
const [fetchedDonors, setFetchedDonors] = useState({
charities: [],
restaurants: []
});

const defaultDonors = {
charities: [
{ name: "Madadgar", distance: "7 km", link: "#" },
{ name: "Helping Hand", distance: "150 m", link: "#" },
{ name: "Seva", distance: "10 km", link: "#" },
{ name: "Champaran", distance: "12 km", link: "#" },
{ name: "Made in Home", distance: "2 km", link: "#" },
{ name: "Deva", distance: "5 km", link: "#" }
],
restaurants: [
{ name: "Barbeque Nation", distance: "2 km", capacity: 4 },
{ name: "Raj Luxmi food", distance: "8 km", capacity: 12 },
{ name: "The Magari", distance: "19.2 km", capacity: 14 },
{ name: "Chochlate Room", distance: "2.5 km", capacity: 14 },
{ name: "Haldiram", distance: "17 km", capacity: 14 },
{ name: "Bikanerwala", distance: "9 km", capacity: 14 },
{ name: "Sagar Ratnam", distance: "5 km", capacity: 14 }
]
};

useEffect(() => {
const fetchDonors = async () => {
try {
const res = await axios.get('/donors');
const data = res.data || {};
setFetchedDonors({
charities: data.charities || [],
restaurants: data.restaurants || []
});
} catch (err) {
console.error('Failed to fetch donors:', err.message);
// Do not overwrite; just keep default
}
};

fetchDonors();

}, []);

const combinedDonors = {
charities: [...defaultDonors.charities, ...fetchedDonors.charities],
restaurants: [...defaultDonors.restaurants, ...fetchedDonors.restaurants]
};

return (
<div className="min-h-screen bg-red-50 text-gray-600">
<section className="py-16 px-4 max-w-4xl mx-auto">
<h2 className="text-3xl font-bold text-center mb-8">Donors Nearby You</h2>
<div className="my-6 flex justify-center">
<img src={divider} alt="divider" className="w-full max-w-xl" />
</div>

    <div className="flex justify-center mb-4">
      <button
        onClick={() => setTab('charities')}
        className={`px-4 py-2 ${tab === 'charities' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        Charitable Trusts
      </button>
      <button
        onClick={() => setTab('restaurants')}
        className={`px-4 py-2 ${tab === 'restaurants' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        Restaurants
      </button>
    </div>

    <div className="bg-white shadow rounded p-4">
      {combinedDonors[tab].map((item, idx) => (
        <div key={idx} className="border-b py-2">
          <a href={item.link || "#"} className="font-semibold text-blue-600 hover:underline">{item.name}</a>
          <p className="text-sm text-gray-600">
            {item.capacity ? `Can serve ${item.capacity} people` : ''}{' '}
            {item.distance && ` - ${item.distance} away`}
          </p>
        </div>
      ))}
    </div>
  </section>
</div>

);
}
import React, { useEffect, useState } from 'react';
import axios from '../api/apiInstance';

// Default images
import img1 from '../assets/img/special-1.png';
import img2 from '../assets/img/special-2.png';
import img3 from '../assets/img/special-3.png';
import img4 from '../assets/img/special-4.png';
import img5 from '../assets/img/special-5.png';
import img6 from '../assets/img/special-6.png';

// Default fallback specials
const defaultSpecials = [
{ name: 'Chole Chawal', desc: 'Loved all across India.', img: img1 },
{ name: 'Biryani', desc: 'Flavourful and generous.', img: img2 },
{ name: 'Poori Sabji', desc: 'A breakfast classic.', img: img3 },
{ name: 'Dal Rice', desc: 'Staple Indian lunch.', img: img4 },
{ name: 'South Indian', desc: 'Nutritious Idli & Dosa.', img: img5 },
{ name: 'Khichdi', desc: 'Most donated food.', img: img6 }
];

const Specials = () => {
const [specials, setSpecials] = useState(defaultSpecials);

useEffect(() => {
const fetchSpecials = async () => {
try {
const res = await axios.get('/specials');
if (Array.isArray(res.data) && res.data.length > 0) {
setSpecials(res.data);
}
} catch (err) {
console.error('Failed to fetch specials:', err.message);
}
};

fetchSpecials();

}, []);

return (
<section id="specials" className="py-16 bg-red-50">
<div className="container mx-auto px-4">
<h2 className="text-3xl font-bold mb-10 text-center">This Month Specials</h2>
<div className="grid md:grid-cols-3 gap-8">
{specials.map((item, i) => (
<div key={i} className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition p-4 text-center">
<img
src={item.img || item.imageUrl}
alt={item.name}
className="w-full h-48 object-cover rounded"
/>
<h3 className="text-xl font-semibold mt-4">{item.name}</h3>
<p className="text-gray-600 mt-2">{item.desc || item.description}</p>
</div>
))}
</div>
</div>
</section>
);
};

export default Specials;
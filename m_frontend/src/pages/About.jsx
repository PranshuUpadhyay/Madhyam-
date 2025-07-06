import React from 'react';
import divider from '../assets/divider.svg';


const About = () => {
  return (
    <section
      className="min-h-screen px-6 py-12 text-gray-600 bg-cover bg-red-50 bg-center flex justify-center items-center"
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <div className="my-8 flex justify-center">
          <img src={divider} alt="divider" className="w-full max-w-xl" />
        </div>

        <p className="mb-4 text-lg">
          Food waste is a significant global issue, with over 1.3 billion tons of edible food discarded every year. This not only leads to environmental harm but also happens while millions of people go hungry daily.
        </p>
        <p className="mb-4 text-lg">
          Madhyam is a community-powered digital platform designed to bridge this gap. We connect local vendors, restaurants, caterers, and individuals who have surplus food with food banks, NGOs, and people in need — all in real-time and with ease.
        </p>
        <p className="mb-4 text-lg">
          We provide you with a <strong>Madhyam</strong> — meaning "medium" in Hindi — a meaningful path to ensure your extra food reaches the right hands instead of a landfill.
        </p>
        <ul className="list-disc pl-6 text-lg mb-4">
          <li className="mb-2">📍 <strong>Discover Nearby Donors</strong>: View a list or map of individuals and businesses willing to donate food near your location.</li>
          <li className="mb-2">🧼 <strong>Verified Quality</strong>: Donors commit to hygienic packaging and timely delivery. Recipients can also review their experience.</li>
          <li className="mb-2">🤝 <strong>Instant Matching</strong>: Vendors and recipients are matched by location and food type to reduce delay and avoid waste.</li>
          <li className="mb-2">📢 <strong>Spread Awareness</strong>: Learn about the food waste problem and how small efforts by individuals or businesses can drive major change.</li>
          <li className="mb-2">🧑‍💻 <strong>Easy Sign-up for All</strong>: Whether you’re a donor or recipient, it takes only a few seconds to join the movement.</li>
        </ul>
        <p className="text-lg">
          Madhyam is more than a website — it’s a civic movement where food no longer goes to waste, but instead goes to someone who needs it.
        </p>
      </div>
    </section>
  );
};

export default About;

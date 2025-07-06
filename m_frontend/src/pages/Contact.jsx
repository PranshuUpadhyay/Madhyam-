import React from 'react';
import contactIllustration from '../assets/img/contact-bg.png';
import img from '../assets/divider.svg';

export default function Contact() {
  return (
    <section
      className="py-20 px-4 text-center bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${contactIllustration})` }}
    >
      <div className="max-w-2xl mx-auto bg-transparent bg-opacity-80 p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Connect with Us</h1>
        <div className="my-8 flex justify-center">
            <img src={img} alt="divider" className="w-full max-w-xl" />
        </div>
        <form className="grid gap-4 text-left">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-2 rounded"
          />
          <textarea
            placeholder="Message"
            rows="5"
            className="border border-gray-300 p-2 rounded"
          ></textarea>
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
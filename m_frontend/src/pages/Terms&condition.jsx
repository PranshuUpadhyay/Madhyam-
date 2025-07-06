import React from 'react';
import divider from '../assets/divider.svg';
import backgroundImage from '../assets/img/bg_blog.png';
const TermsOfService = () => {
return (
<section className="min-h-screen w-full bg-red-50 flex justify-center items-center px-4 py-12 text-gray-600" style={{ backgroundImage: `url(${backgroundImage})` }}>
<div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
<h1 className="text-4xl font-bold mb-6 text-center">Terms & Conditions</h1>
    <div className="my-6 flex justify-center">
      <img src={divider} alt="divider" className="w-full max-w-md" />
    </div>

    <p className="mb-4 text-lg">
      Welcome to Madhyam. By accessing and using our services, you agree to the following terms and conditions.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Usage</h2>
    <p className="mb-4 text-lg">
      You must use this platform ethically, without impersonating others or misusing the information provided.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Content</h2>
    <p className="mb-4 text-lg">
      All content you submit must be respectful and in compliance with local laws. We reserve the right to remove any content.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
    <p className="mb-4 text-lg">
      Madhyam is not liable for any direct or indirect damages arising from the use of our services.
    </p>

    <p className="mt-4 text-lg">
      These terms are subject to change. Continued use of our platform signifies your agreement to the updated terms.
    </p>
  </div>
</section>
);
};

export default TermsOfService;
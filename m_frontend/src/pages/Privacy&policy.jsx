import React from 'react';
import divider from '../assets/divider.svg';
import backgroundImage from '../assets/img/bg_blog.png';
const PrivacyPolicy = () => {
return (
<section className="min-h-screen w-full bg-gray-50 flex justify-center items-center px-4 py-12 text-gray-600">
<div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
<h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
    <div className="my-6 flex justify-center">
      <img src={divider} alt="divider" className="w-full max-w-md" />
    </div>

    <p className="mb-4 text-lg">
      At Madhyam, your privacy is important to us. This privacy policy outlines how we collect, use,
      and protect your personal information when you use our services.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Information We Collect</h2>
    <ul className="list-disc pl-6 mb-4 text-lg">
      <li>Your name, email, and contact details</li>
      <li>Information you provide when signing up or submitting forms</li>
      <li>Data related to your interactions with our platform</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
    <p className="mb-4 text-lg">
      Your information is used to connect donors with recipients, communicate updates, and improve our platform's functionality.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Security</h2>
    <p className="mb-4 text-lg">
      We implement security measures to protect your data. However, no online transmission is completely secure.
    </p>

    <p className="mt-4 text-lg">
      By using Madhyam, you agree to the terms of this privacy policy.
    </p>
  </div>
</section>
);
};

export default PrivacyPolicy;
import React, { useState } from 'react';
import divider from '../assets/divider.svg';
import backgroundImage from '../assets/img/bg_blog.png';
import { FaUserShield, FaFileAlt, FaGavel, FaExclamationTriangle } from 'react-icons/fa';

const sections = [
  {
    id: 'usage',
    icon: <FaUserShield className="inline-block mr-2 text-blue-600" />,
    title: 'Usage',
    content: 'You must use this platform ethically, without impersonating others or misusing the information provided.'
  },
  {
    id: 'content',
    icon: <FaFileAlt className="inline-block mr-2 text-green-600" />,
    title: 'Content',
    content: 'All content you submit must be respectful and in compliance with local laws. We reserve the right to remove any content.'
  },
  {
    id: 'liability',
    icon: <FaExclamationTriangle className="inline-block mr-2 text-yellow-600" />,
    title: 'Limitation of Liability',
    content: 'Madhyam is not liable for any direct or indirect damages arising from the use of our services.'
  },
  {
    id: 'changes',
    icon: <FaGavel className="inline-block mr-2 text-purple-600" />,
    title: 'Changes to Terms',
    content: 'These terms are subject to change. Continued use of our platform signifies your agreement to the updated terms.'
  }
];

const TermsOfService = () => {
  const [openSection, setOpenSection] = useState(sections[0].id);
  return (
    <section className="min-h-screen w-full bg-gray-50 flex justify-center items-center px-4 py-12 text-gray-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row gap-8">
        {/* Sidebar for desktop */}
        <nav className="hidden md:block w-1/4 sticky top-24 self-start">
          <ul className="space-y-4">
            {sections.map(sec => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className={`block px-3 py-2 rounded font-semibold transition-colors ${openSection === sec.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setOpenSection(sec.id)}
                >
                  {sec.icon} {sec.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-6 text-center">Terms & Conditions</h1>
          <div className="my-6 flex justify-center">
            <img src={divider} alt="divider" className="w-full max-w-md" />
          </div>
          <p className="mb-8 text-lg text-center">
            Welcome to Madhyam. By accessing and using our services, you agree to the following terms and conditions.
          </p>
          {/* Collapsible sections for mobile, expanded for desktop */}
          <div className="space-y-6">
            {sections.map(sec => (
              <div key={sec.id} id={sec.id} className="border-b pb-4">
                <button
                  className="w-full flex items-center justify-between md:justify-start text-left text-2xl font-semibold mb-2 focus:outline-none"
                  onClick={() => setOpenSection(sec.id)}
                  aria-expanded={openSection === sec.id}
                >
                  <span>{sec.icon} {sec.title}</span>
                  <span className="md:hidden ml-2 text-xl">{openSection === sec.id ? '−' : '+'}</span>
                </button>
                {(openSection === sec.id || window.innerWidth >= 768) && (
                  <p className="text-lg mt-2 transition-all duration-300">{sec.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
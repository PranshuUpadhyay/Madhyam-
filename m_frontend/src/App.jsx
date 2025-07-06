import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import Signup from './pages/Signup';
import Header from './components/Header';
import Footer from './components/Footer';
import SpecialsPage from './pages/Specials';
import Login from './pages/Login';
import BlogPostForm from './pages/Blog';
import Volunteers from './pages/Volunteers';
import BecomeDonor from './pages/BecomeDonor';
import PrivacyPolicy from './pages/Privacy&policy';
import TermsOfService from './pages/Terms&condition';
import VolunteerSignIn from './pages/VolunteerSignIn';




function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/specials" element={<SpecialsPage />}/> 
        <Route path="/login" element={<Login />}/>
        <Route path="/blog" element={<BlogPostForm />}/>
        <Route path="/volunteer" element={<Volunteers />}/>
        <Route path="/donor" element={<BecomeDonor />}/>
        <Route path="/privacy" element={<PrivacyPolicy />}/>
        <Route path="/terms" element={<TermsOfService />}/>
        <Route path="/Volunteer-login" element={<VolunteerSignIn />}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
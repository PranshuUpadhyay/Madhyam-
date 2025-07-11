import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import NotificationContainer from './components/NotificationContainer';
// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Menu = lazy(() => import('./pages/Menu'));
const Signup = lazy(() => import('./pages/Signup'));
const SpecialsPage = lazy(() => import('./pages/Specials'));
const Login = lazy(() => import('./pages/Login'));
const BlogPostForm = lazy(() => import('./pages/Blog'));
const Volunteers = lazy(() => import('./pages/Volunteers'));
const BecomeDonor = lazy(() => import('./pages/BecomeDonor'));
const PrivacyPolicy = lazy(() => import('./pages/Privacy&policy'));
const TermsOfService = lazy(() => import('./pages/Terms&condition'));
const VolunteerSignIn = lazy(() => import('./pages/VolunteerSignIn'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VolunteerRegister = lazy(() => import('./pages/VolunteerRegister'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard'));
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'));
const LinkedInCallback = lazy(() => import('./pages/LinkedInCallback'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Google OAuth Client ID - Replace with your actual client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id-here';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
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
                    <Route path="/becomedonor" element={<BecomeDonor />}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/privacy" element={<PrivacyPolicy />}/>
                    <Route path="/terms" element={<TermsOfService />}/>
                    <Route path="/volunteer-signin" element={<VolunteerSignIn />} />
                    <Route path="/volunteer/register" element={<VolunteerRegister />} />
                    <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
                    <Route path="/donor-login" element={<Login />} />
                    <Route path="/Volunteer-login" element={<VolunteerSignIn />} />
                    <Route path="/donor-dashboard" element={<DonorDashboard />} />
                    <Route path="/auth/linkedin/success" element={<LinkedInCallback />} />
                    <Route path="/auth/linkedin/error" element={<LinkedInCallback />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              {/* Notification Container */}
              <NotificationContainer />
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AppProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
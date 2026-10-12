import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoPanel from '../components/DemoPanel';
import { Sparkles, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState(null);
  const [isDemoName, setIsDemoName] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Demo Quick Fill
  const handleSelectDemoProfile = (profile) => {
    setSelectedDemoId(profile.id);
    setName(profile.name);
    setIsDemoName(true);
    // Storing pre-selected conditions in sessionStorage for onboarding step 2
    if (profile.conditions) {
      sessionStorage.setItem('swasira_demo_conditions', JSON.stringify(profile.conditions));
    }
    if (profile.routine) {
      sessionStorage.setItem('swasira_demo_routine', JSON.stringify([profile.routine]));
    }
    // We intentionally generate a clean, unique demo email for testing convenience
    if (!email) {
      setEmail(`${profile.id.toLowerCase()}@example.com`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      // Fresh user always heads to Onboarding
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Signup failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-swasira-mint">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Demo Mode Presentation Panel */}
          <DemoPanel
            onSelectProfile={handleSelectDemoProfile}
            activeProfileId={selectedDemoId}
          />

          {/* Signup Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-swasira-mint-border shadow-soft"
          >
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-swasira-mint text-swasira-teal border border-swasira-mint-border mb-3">
                <Sparkles className="w-3.5 h-3.5 text-swasira-saffron" />
                Personalized Health
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-swasira-teal">
                Join SWASIRA
              </h2>
              <p className="text-xs sm:text-sm text-swasira-muted mt-2">
                Begin your tailored health journey rooted in authentic well-being.
              </p>
            </div>

            {/* Error Message (Amber styling, never harsh red) */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-swasira-amber-border text-swasira-amber-dark text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-swasira-saffron shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-swasira-charcoal">
                    Full Name
                  </label>
                  {isDemoName && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-swasira-amber-dark border border-swasira-amber-border">
                      Demo
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-swasira-muted">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setIsDemoName(false);
                    }}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm text-swasira-charcoal placeholder:text-swasira-muted/60 bg-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-swasira-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm text-swasira-charcoal placeholder:text-swasira-muted/60 bg-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-swasira-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm text-swasira-charcoal placeholder:text-swasira-muted/60 bg-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-swasira-teal text-white text-sm font-semibold hover:bg-swasira-teal-light focus:outline-none focus:ring-2 focus:ring-swasira-teal/30 shadow-md shadow-swasira-teal/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Continue to Personalization</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-swasira-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-swasira-teal hover:underline">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

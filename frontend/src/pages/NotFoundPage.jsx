import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-swasira-mint">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white rounded-3xl p-10 border border-swasira-mint-border shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-swasira-mint flex items-center justify-center mx-auto text-swasira-teal mb-4">
            <Compass className="w-7 h-7 text-swasira-saffron" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-swasira-teal">Page Not Found</h2>
          <p className="text-xs sm:text-sm text-swasira-muted mt-2">
            The page you requested could not be located. Let's return to your dashboard or home.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-swasira-teal text-white text-xs font-semibold hover:bg-swasira-teal-light transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

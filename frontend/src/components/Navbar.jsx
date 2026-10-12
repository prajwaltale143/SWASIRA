import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Flame, Shield, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-swasira-mint-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          {/* Rounded Teal Logo Icon with Saffron Mark */}
          <div className="relative w-11 h-11 rounded-2xl bg-swasira-teal flex items-center justify-center shadow-md shadow-swasira-teal/20 group-hover:scale-105 transition-transform">
            <svg
              className="w-6 h-6 text-swasira-saffron"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {/* Droplet / Leaf Motif */}
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-swasira-saffron rounded-full border-2 border-white" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-swasira-teal">
                SWASIRA
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-swasira-mint text-swasira-teal border border-swasira-mint-border">
                SWASTH
              </span>
            </div>
            <span className="text-xs text-swasira-muted font-medium -mt-0.5">
              Health That Understands You
            </span>
          </div>
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Streak Counter */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-swasira-mint-subtle rounded-full border border-swasira-mint-border text-xs font-medium text-swasira-teal">
                <Flame className="w-4 h-4 text-swasira-saffron" />
                <span>Streak: <strong className="font-semibold">{user?.streak ?? 0}d</strong></span>
              </div>

              {/* Flex Passes */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full border border-swasira-amber-border text-xs font-medium text-swasira-amber-dark">
                <Shield className="w-3.5 h-3.5 text-swasira-saffron" />
                <span>{user?.flexPasses ?? 2} Flex Passes</span>
              </div>

              {/* User Link */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-swasira-teal hover:text-swasira-teal-light px-3 py-1.5 rounded-lg hover:bg-swasira-mint-subtle transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-swasira-teal/10 flex items-center justify-center text-swasira-teal text-xs font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                </div>
                <span className="hidden sm:inline font-medium">{user?.name || 'My Plan'}</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-swasira-muted hover:text-swasira-teal rounded-lg hover:bg-swasira-mint transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                to="/login"
                className="text-sm font-semibold text-swasira-teal hover:text-swasira-teal-light transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-swasira-teal text-white text-sm font-semibold hover:bg-swasira-teal-light shadow-md shadow-swasira-teal/20 transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-swasira-saffron" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

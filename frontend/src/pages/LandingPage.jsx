import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, ShieldCheck, Soup, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-swasira-mint">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          {/* Subtle Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-swasira-sage/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-72 h-72 bg-swasira-saffron/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col items-center"
            >
              {/* Pill badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-swasira-mint-border shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-swasira-saffron animate-pulse" />
                <span className="text-xs font-semibold tracking-wide uppercase text-swasira-teal">
                  Life-Stage Aware Nutrition
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-swasira-teal leading-[1.15]"
              >
                SWASIRA
                <span className="block font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-swasira-charcoal/90 mt-2">
                  Health That Understands You
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="mt-6 text-base sm:text-xl text-swasira-muted max-w-3xl mx-auto leading-relaxed"
              >
                A personalized, life-stage-aware diet and lifestyle platform that gives every user food and lifestyle guidance based on their exact age, health conditions, allergies, and diet type. Never generic, never judgmental.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-swasira-teal text-white text-base font-semibold hover:bg-swasira-teal-light shadow-premium shadow-swasira-teal/20 transition-all hover:-translate-y-1"
                >
                  <Sparkles className="w-5 h-5 text-swasira-saffron" />
                  <span>Get Started with SWASIRA</span>
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-swasira-teal text-base font-semibold border border-swasira-mint-border hover:bg-swasira-mint-subtle transition-all"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-swasira-muted"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-swasira-sage" /> Zero Pre-filled Guesses
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-swasira-sage" /> 100% Home Cooked Flavors
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-swasira-sage" /> No-Shame Flex Passes
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* WHY SWASIRA SECTION */}
        <section className="py-20 bg-white border-y border-swasira-mint-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-swasira-saffron">
                Cultural Heritage & Modern Care
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-swasira-teal mt-2">
                Why SWASIRA?
              </h2>
              <p className="text-sm sm:text-base text-swasira-muted mt-4 leading-relaxed">
                The name <strong>SWASIRA</strong> is deeply rooted in <em>"Swasth"</em> (the ancient concept of self-abiding vitality, balanced health, and pure contentment). We combine time-honored Indian food wisdom with modern metabolic science to craft daily sustenance that fits your exact life stage.
              </p>
            </div>

            {/* Core Idea Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-3xl bg-swasira-mint/50 border border-swasira-mint-border hover:shadow-premium transition-all">
                <div className="w-12 h-12 rounded-2xl bg-swasira-teal flex items-center justify-center text-white mb-4 shadow-sm">
                  <Compass className="w-6 h-6 text-swasira-saffron" />
                </div>
                <h3 className="font-serif text-lg font-bold text-swasira-teal">
                  Life-Stage Personalization
                </h3>
                <p className="text-xs text-swasira-muted mt-2 leading-relaxed">
                  Nutritional demands transform with age. From teenage growth to young adult hustle and senior rejuvenation, your plan dynamically adapts.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-3xl bg-swasira-mint/50 border border-swasira-mint-border hover:shadow-premium transition-all">
                <div className="w-12 h-12 rounded-2xl bg-swasira-sage flex items-center justify-center text-white mb-4 shadow-sm">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-lg font-bold text-swasira-teal">
                  No-Shame Streak System
                </h3>
                <p className="text-xs text-swasira-muted mt-2 leading-relaxed">
                  Life happens. With 2 weekly Flex Passes, swap meals or pause without guilt. We believe in gentle consistency, never reprimand.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-3xl bg-swasira-mint/50 border border-swasira-mint-border hover:shadow-premium transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-swasira-amber-dark mb-4 shadow-sm">
                  <Soup className="w-6 h-6 text-swasira-saffron" />
                </div>
                <h3 className="font-serif text-lg font-bold text-swasira-teal">
                  Homemade Regional Food
                </h3>
                <p className="text-xs text-swasira-muted mt-2 leading-relaxed">
                  Comforting, authentic Indian meals you actually want to eat: Moong Cheela, Palak Khichdi, Ragi Idli, and Kadhi — naturally wholesome.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-3xl bg-swasira-mint/50 border border-swasira-mint-border hover:shadow-premium transition-all">
                <div className="w-12 h-12 rounded-2xl bg-swasira-teal/10 flex items-center justify-center text-swasira-teal mb-4 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-swasira-teal" />
                </div>
                <h3 className="font-serif text-lg font-bold text-swasira-teal">
                  Transparent "Why This?"
                </h3>
                <p className="text-xs text-swasira-muted mt-2 leading-relaxed">
                  No black-box recommendations. Every suggestion reveals clinical reasoning tailored precisely to the conditions and allergies you entered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-swasira-mint">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-14 rounded-3xl bg-swasira-teal text-white shadow-premium relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-swasira-sage/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                  Ready to Experience Health That Truly Listens?
                </h2>
                <p className="text-white/80 text-sm sm:text-base mt-4 max-w-xl mx-auto">
                  Take the gentle 5-minute onboarding. Your personalized daily plan will be crafted purely from what you tell us.
                </p>
                <div className="mt-8">
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-swasira-saffron text-swasira-charcoal font-bold text-sm hover:bg-swasira-saffron-light shadow-glow transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 text-swasira-teal" />
                    <span>Create Your Free Account</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

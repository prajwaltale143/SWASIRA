import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NutrientDonut from '../components/NutrientDonut';
import Toast from '../components/Toast';
import {
  Flame,
  Shield,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar,
  Activity,
  Heart,
  Soup,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Accordion state for "Why this?"
  const [expandedReasoning, setExpandedReasoning] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch diet plan and streak data
  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const [planRes, streakRes] = await Promise.all([
        api.getDietPlan(user.id),
        api.getStreak(user.id).catch(() => null)
      ]);

      setPlanData(planRes);
      if (streakRes) {
        setStreakData(streakRes);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
      showToast(err.message, 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const toggleReasoning = (slot) => {
    setExpandedReasoning(prev => ({ ...prev, [slot]: !prev[slot] }));
  };

  // Mark meal as Done
  const handleMarkDone = async (slot) => {
    if (!user?.id || actionLoading) return;
    setActionLoading(true);

    try {
      const res = await api.markMealDone(user.id, slot);
      showToast(res.message || 'Meal marked as done! Great momentum.', 'success');

      // Update state locally
      setPlanData(prev => {
        if (!prev || !prev.plan) return prev;
        return {
          ...prev,
          plan: {
            ...prev.plan,
            [slot]: {
              ...prev.plan[slot],
              status: 'done'
            }
          }
        };
      });

      // Update streak
      if (res.currentStreak !== undefined) {
        setStreakData(prev => prev ? { ...prev, currentStreak: res.currentStreak } : null);
        updateUser({ streak: res.currentStreak });
      }

      // Refresh 7-day calendar
      const refreshedStreak = await api.getStreak(user.id).catch(() => null);
      if (refreshedStreak) {
        setStreakData(refreshedStreak);
      }
    } catch (err) {
      showToast(err.message || 'Could not update meal status.', 'warning');
    } finally {
      setActionLoading(false);
    }
  };

  // Swap meal using 1 Flex Pass
  const handleSwap = async (slot, currentDishId) => {
    if (!user?.id || actionLoading) return;
    setActionLoading(true);

    try {
      const res = await api.swapMeal(user.id, slot, currentDishId);
      showToast(res.message || 'Meal swapped using 1 Flex Pass. Your streak is completely safe!', 'warning');

      // Update plan item locally and recalculate nutrients
      setPlanData(prev => {
        if (!prev || !prev.plan) return prev;
        const updatedPlan = {
          ...prev.plan,
          [slot]: {
            dish: res.newDish,
            reasoning: res.reasoning,
            status: 'flipped'
          }
        };

        const newTotals = { carbs: 0, protein: 0, vitamins: 0, calcium: 0, healthy_fats: 0 };
        Object.values(updatedPlan).forEach(item => {
          if (item?.dish?.nutrients) {
            newTotals.carbs += item.dish.nutrients.carbs || 0;
            newTotals.protein += item.dish.nutrients.protein || 0;
            newTotals.vitamins += item.dish.nutrients.vitamins || 0;
            newTotals.calcium += item.dish.nutrients.calcium || 0;
            newTotals.healthy_fats += item.dish.nutrients.healthy_fats || 0;
          }
        });

        return {
          ...prev,
          plan: updatedPlan,
          nutrientTotals: newTotals,
        };
      });

      // Update flex passes remaining
      if (res.flexPassesRemaining !== undefined) {
        setStreakData(prev => prev ? { ...prev, flexPassesRemaining: res.flexPassesRemaining } : null);
        updateUser({ flexPasses: res.flexPassesRemaining });
      }

      // Refresh 7-day calendar to reflect flipped/flexed day
      const refreshedStreak = await api.getStreak(user.id).catch(() => null);
      if (refreshedStreak) {
        setStreakData(refreshedStreak);
      }
    } catch (err) {
      showToast(err.message || 'Swap unavailable.', 'warning');
    } finally {
      setActionLoading(false);
    }
  };

  const getSlotIcon = (slot) => {
    switch (slot) {
      case 'breakfast':
        return <Coffee className="w-5 h-5 text-swasira-saffron" />;
      case 'lunch':
        return <Sun className="w-5 h-5 text-swasira-saffron" />;
      case 'activity_nudge':
        return <Activity className="w-5 h-5 text-swasira-sage" />;
      case 'dinner':
        return <Moon className="w-5 h-5 text-swasira-teal" />;
      default:
        return <Soup className="w-5 h-5 text-swasira-saffron" />;
    }
  };

  const getSlotTitle = (slot) => {
    switch (slot) {
      case 'breakfast':
        return 'Nourishing Breakfast';
      case 'lunch':
        return 'Balanced Midday Lunch';
      case 'activity_nudge':
        return 'Mindful Movement & Nudge';
      case 'dinner':
        return 'Gentle Evening Dinner';
      default:
        return slot;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-swasira-mint">
      <Navbar />

      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Header & Greeting Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-swasira-teal/10 text-swasira-teal">
                Today's Overview
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-swasira-teal">
              Namaste, {user?.name || 'Friend'}
            </h1>
            <p className="text-xs sm:text-sm text-swasira-muted mt-1">
              Here is your life-stage tuned food and activity plan for today.
            </p>
          </div>

          {/* Metric Badges: Streak & Flex Passes */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-2xl border border-swasira-mint-border shadow-soft">
              <div className="w-9 h-9 rounded-xl bg-swasira-mint flex items-center justify-center">
                <Flame className="w-5 h-5 text-swasira-saffron" />
              </div>
              <div>
                <span className="text-[11px] text-swasira-muted font-medium block">Current Streak</span>
                <span className="font-serif text-lg font-bold text-swasira-teal">
                  {streakData?.currentStreak ?? user?.streak ?? 0} Days
                </span>
              </div>
            </div>

            {/* Flex Passes */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-2xl border border-swasira-mint-border shadow-soft">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-swasira-saffron" />
              </div>
              <div>
                <span className="text-[11px] text-swasira-muted font-medium block">Weekly Flex Passes</span>
                <span className="font-serif text-lg font-bold text-swasira-amber-dark">
                  {streakData?.flexPassesRemaining ?? user?.flexPasses ?? 2} Remaining
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="p-16 text-center bg-white rounded-3xl border border-swasira-mint-border">
            <div className="w-10 h-10 border-4 border-swasira-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-swasira-teal font-medium">
              Consulting SWASIRA nutrition engine...
            </p>
          </div>
        )}

        {/* PROFILE INCOMPLETE CARD */}
        {!loading && planData && !planData.isComplete && (
          <div className="p-8 sm:p-10 rounded-3xl bg-amber-50 border border-swasira-amber-border shadow-soft mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5 mb-2">
                <AlertCircle className="w-6 h-6 text-swasira-saffron shrink-0" />
                <h3 className="font-serif text-xl font-bold text-swasira-amber-dark">
                  Complete Your Profile to Unlock Your Plan
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-swasira-charcoal/90 mt-2 leading-relaxed">
                SWASIRA never guesses your nutritional needs. To generate an accurate, safe plan, we need you to provide your:
              </p>
              <ul className="mt-3 space-y-1.5 text-xs font-semibold text-swasira-amber-dark list-disc list-inside">
                {planData.missingFields?.map((field, idx) => (
                  <li key={idx} className="capitalize">{field}</li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  to="/onboarding"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-swasira-teal text-white text-xs sm:text-sm font-semibold hover:bg-swasira-teal-light shadow-md shadow-swasira-teal/20 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-swasira-saffron" />
                  <span>Complete My Profile Now</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* PEDIATRIC REFERRAL SPECIAL NOTICE (Age <= 6) */}
        {!loading && planData && planData.isPediatricReferral && (
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-swasira-mint-border shadow-soft mb-8">
            <div className="max-w-2xl">
              <div className="w-12 h-12 rounded-2xl bg-swasira-mint flex items-center justify-center text-swasira-teal mb-4">
                <Heart className="w-6 h-6 text-swasira-saffron" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-swasira-teal">
                Pediatric Safety Standard
              </h3>
              <p className="text-xs sm:text-sm text-swasira-muted mt-3 leading-relaxed">
                {planData.message}
              </p>
              <div className="mt-6 p-4 rounded-2xl bg-swasira-mint/60 border border-swasira-mint-border text-xs text-swasira-teal">
                <strong>Why this is important:</strong> Children under 6 undergo rapid metabolic and organ development. Feeding routines must always be guided by direct clinical consultation.
              </div>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD CONTENT (When plan is ready) */}
        {!loading && planData && planData.isComplete && !planData.isPediatricReferral && (
          <>
            {/* User Badges Summary Row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-8">
              {planData.userSummary?.diet_type && (
                <span className="px-3.5 py-1.5 rounded-full bg-white border border-swasira-mint-border text-xs font-semibold text-swasira-teal shadow-xs">
                  Diet: {planData.userSummary.diet_type}
                </span>
              )}
              {planData.lifeStage && (
                <span className="px-3.5 py-1.5 rounded-full bg-white border border-swasira-mint-border text-xs font-semibold text-swasira-teal shadow-xs">
                  Stage: {planData.lifeStage}
                </span>
              )}
              {planData.bmi && (
                <span className="px-3.5 py-1.5 rounded-full bg-white border border-swasira-mint-border text-xs font-semibold text-swasira-teal shadow-xs">
                  BMI: {planData.bmi}
                </span>
              )}
              {planData.userSummary?.conditions?.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-swasira-mint text-swasira-teal border border-swasira-mint-border text-xs font-medium"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Unsupported Conditions Friendly Note */}
            {planData.unsupportedConditionsNotice && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-swasira-amber-border text-xs text-swasira-amber-dark flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-swasira-saffron shrink-0" />
                <span>{planData.unsupportedConditionsNotice}</span>
              </div>
            )}

            {/* Grid Layout: Plan Cards on Left, Nutrition & Streak on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Meal Cards (2 cols on large screen) */}
              <div className="lg:col-span-2 space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-serif text-2xl font-bold text-swasira-teal">
                    Today's Nourishment & Rhythm
                  </h2>
                  <span className="text-xs text-swasira-muted font-medium">
                    Personalized to your conditions
                  </span>
                </div>

                {['breakfast', 'lunch', 'activity_nudge', 'dinner'].map((slot) => {
                  const item = planData.plan ? planData.plan[slot] : null;
                  if (!item) return null;

                  const isDone = item.status === 'done';
                  const isFlipped = item.status === 'flipped';
                  const isExpanded = Boolean(expandedReasoning[slot]);

                  return (
                    <motion.div
                      key={slot}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-3xl border transition-all ${
                        isDone
                          ? 'bg-swasira-mint/40 border-swasira-sage/60'
                          : isFlipped
                          ? 'bg-amber-50/40 border-swasira-amber-border/70'
                          : 'bg-white border-swasira-mint-border shadow-soft'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2.5 rounded-2xl bg-swasira-mint shrink-0 mt-0.5">
                            {getSlotIcon(slot)}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-swasira-muted block">
                              {getSlotTitle(slot)}
                            </span>
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-swasira-charcoal mt-0.5">
                              {item.dish?.name || 'Wholesome Regional Preparation'}
                            </h3>
                            {/* One-line why this was suggested */}
                            <p className="text-xs text-swasira-muted mt-1.5 leading-relaxed">
                              {item.reasoning}
                            </p>
                          </div>
                        </div>

                        {/* Status tag if completed/swapped */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isDone && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-swasira-mint text-swasira-teal border border-swasira-sage">
                              <CheckCircle2 className="w-3.5 h-3.5 text-swasira-sage" />
                              Done
                            </span>
                          )}
                          {isFlipped && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-swasira-amber-dark border border-swasira-amber-border">
                              <RefreshCw className="w-3.5 h-3.5 text-swasira-saffron" />
                              Flexed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-4 border-t border-swasira-mint-border/60 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {/* Done Action */}
                          {!isDone && (
                            <button
                              type="button"
                              onClick={() => handleMarkDone(slot)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-swasira-teal text-white text-xs font-semibold hover:bg-swasira-teal-light shadow-xs transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-swasira-saffron" />
                              <span>Mark Done</span>
                            </button>
                          )}

                          {/* Swap Action (Uses 1 Flex Pass) */}
                          <button
                            type="button"
                            onClick={() => handleSwap(slot, item.dish?.id)}
                            disabled={actionLoading || (streakData?.flexPassesRemaining ?? 2) <= 0}
                            title="Swap with an alternative dish using 1 Flex Pass"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-swasira-mint-border hover:border-swasira-amber-border hover:bg-amber-50 text-swasira-charcoal text-xs font-medium transition-all disabled:opacity-50"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-swasira-amber-dark" />
                            <span>Swap Dish</span>
                          </button>
                        </div>

                        {/* "Why this?" Accordion */}
                        <button
                          type="button"
                          onClick={() => toggleReasoning(slot)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-swasira-teal hover:text-swasira-teal-light transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-swasira-saffron" />
                          <span>Why this?</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Accordion Detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-4 rounded-2xl bg-swasira-mint-subtle border border-swasira-mint-border text-xs text-swasira-charcoal space-y-1.5"
                          >
                            <p className="font-semibold text-swasira-teal">
                              Nutritional Rationale:
                            </p>
                            <p className="leading-relaxed">
                              {item.reasoning}
                            </p>
                            {item.dish?.suited_conditions && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {item.dish.suited_conditions.map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="px-2 py-0.5 rounded-md bg-white border border-swasira-mint-border text-[10px] text-swasira-teal font-medium"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Column: Nutrient Breakdown Donut & 7-Day Streak Calendar */}
              <div className="space-y-6">
                {/* Recharts Nutrient Donut */}
                <NutrientDonut nutrientTotals={planData.nutrientTotals} />

                {/* 7-Day Mini-Calendar Progress */}
                <div className="bg-white rounded-3xl p-6 border border-swasira-mint-border shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-swasira-teal" />
                      <h3 className="font-serif text-lg font-bold text-swasira-teal">
                        Streak & Rhythm
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-swasira-muted">
                      Last 7 Days
                    </span>
                  </div>

                  {/* Calendar 7-Day Strip */}
                  <div className="grid grid-cols-7 gap-2">
                    {streakData?.history7Days?.map((day, idx) => {
                      const isDone = day.status === 'done';
                      const isFlipped = day.status === 'flipped';
                      const isToday = day.isToday;

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                            isDone
                              ? 'bg-swasira-teal text-white border-swasira-teal'
                              : isFlipped
                              ? 'bg-amber-100 text-swasira-amber-dark border-swasira-amber-border'
                              : isToday
                              ? 'bg-swasira-mint text-swasira-teal border-swasira-teal'
                              : 'bg-white text-swasira-muted border-swasira-mint-border/60'
                          }`}
                        >
                          <span className="text-[10px] font-medium uppercase">
                            {day.dayName}
                          </span>
                          <span className="text-xs font-bold mt-1">
                            {day.date.split('-')[2]}
                          </span>
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Calendar Legend */}
                  <div className="mt-4 pt-3 border-t border-swasira-mint-border/60 flex items-center justify-between text-[11px] text-swasira-muted">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-swasira-teal" />
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span>Flexed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                      <span>Upcoming</span>
                    </div>
                  </div>
                </div>

                {/* Friendly Mindset Card */}
                <div className="p-5 rounded-3xl bg-swasira-mint/50 border border-swasira-mint-border text-xs text-swasira-muted leading-relaxed">
                  <strong className="text-swasira-teal block mb-1">
                    The SWASIRA Consistency Mindset:
                  </strong>
                  "Let's shift this to tomorrow" — we never believe in failure or streak guilt. Health is a lifelong lifelong companionship with your body.
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

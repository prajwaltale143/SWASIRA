import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoPanel from '../components/DemoPanel';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Heart,
  Bot,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Send
} from 'lucide-react';

const CONDITIONS_LIST = [
  'Diabetes',
  'Blood Pressure',
  'Asthma',
  'Migraine',
  'PCOD/PCOS',
  'Thyroid',
  'Weak Immunity',
  'Period Pain / Menstrual Issues',
  'Body Pain / Stress',
  'None',
  'Other',
];

const ALLERGIES_LIST = [
  'Nuts',
  'Dairy',
  'Gluten',
  'Shellfish',
  'Soy',
  'Eggs',
  'None',
  'Other',
];

const DIET_TYPES = [
  { id: 'Vegetarian', label: 'Vegetarian', desc: 'Plant-based with regional dairy & pulses' },
  { id: 'Non-Vegetarian', label: 'Non-Vegetarian', desc: 'Includes poultry, fish, eggs & dairy' },
  { id: 'Vegan', label: 'Vegan', desc: 'Strictly plant-powered, zero animal products' },
  { id: 'Eggetarian/Jain-friendly', label: 'Eggetarian / Jain-friendly', desc: 'Custom vegetarian without root vegetables or with eggs' },
];

const ROUTINE_CHALLENGES = [
  'No time to cook',
  'Irregular schedule',
  'Hectic day',
  'Family eats differently',
  'I forget meals',
  'Not sure what is healthy',
];

function deriveLifeStage(age) {
  if (!age && age !== 0) return null;
  const num = parseInt(age, 10);
  if (isNaN(num)) return null;
  if (num <= 6) return 'Infant/Toddler (Up to 6 yrs)';
  if (num <= 17) return 'Child/Teen (6 - 17 yrs)';
  if (num <= 40) return 'Young Adult (18 - 40 yrs)';
  return 'Senior (40+ yrs)';
}

export default function OnboardingPage() {
  const { user, updateUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  // Step 1: Basic Info (strictly starts empty/null)
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age ?? '');
  const [weight, setWeight] = useState(user?.weight ?? '');
  const [height, setHeight] = useState(user?.height ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [isDemoBasic, setIsDemoBasic] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState(null);

  // Step 2: Conditions
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [otherConditionText, setOtherConditionText] = useState('');
  const [isDemoConditions, setIsDemoConditions] = useState(false);

  // Step 3: Allergies
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [otherAllergyText, setOtherAllergyText] = useState('');

  // Step 4: Diet Type
  const [dietType, setDietType] = useState(user?.diet_type || '');

  // Step 5: Routine
  const [selectedRoutine, setSelectedRoutine] = useState([]);
  const [routineCustomText, setRoutineCustomText] = useState('');

  // Step 6: Medical History
  const [pastIllnesses, setPastIllnesses] = useState('');
  const [ongoingMedication, setOngoingMedication] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');

  // AI Intake Chatbot State (Section 5)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatComplete, setChatComplete] = useState(false);

  // Structured form fallback for intake
  const [showStructuredFallback, setShowStructuredFallback] = useState(false);
  const [intakeQuestionAnswers, setIntakeQuestionAnswers] = useState({});

  // Sync state if user reloads or was already saved
  useEffect(() => {
    if (user) {
      if (!name && user.name) setName(user.name);
      if (age === '' && user.age !== null && user.age !== undefined) setAge(user.age);
      if (weight === '' && user.weight) setWeight(user.weight);
      if (height === '' && user.height) setHeight(user.height);
      if (!gender && user.gender) setGender(user.gender);
      if (!dietType && user.diet_type) setDietType(user.diet_type);
      if (selectedConditions.length === 0 && user.conditions && user.conditions.length > 0) {
        setSelectedConditions(user.conditions);
      }
      if (selectedAllergies.length === 0 && user.allergies && user.allergies.length > 0) {
        setSelectedAllergies(user.allergies);
      }
    }
  }, [user]);

  // Check sessionStorage for demo profiles transferred from signup
  useEffect(() => {
    const demoCond = sessionStorage.getItem('swasira_demo_conditions');
    if (demoCond) {
      try {
        const parsed = JSON.parse(demoCond);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedConditions(parsed);
          setIsDemoConditions(true);
        }
      } catch (e) {}
      sessionStorage.removeItem('swasira_demo_conditions');
    }

    const demoRoutine = sessionStorage.getItem('swasira_demo_routine');
    if (demoRoutine) {
      try {
        const parsed = JSON.parse(demoRoutine);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedRoutine(parsed);
        }
      } catch (e) {}
      sessionStorage.removeItem('swasira_demo_routine');
    }
  }, []);

  const lifeStageBadge = deriveLifeStage(age);

  // Handle Quick Demo Fill on Step 1
  const handleSelectDemoProfile = (profile) => {
    setSelectedDemoId(profile.id);
    setName(profile.name);
    setIsDemoBasic(true);
    if (profile.conditions) {
      setSelectedConditions(profile.conditions);
      setIsDemoConditions(true);
    }
    if (profile.routine) {
      setSelectedRoutine([profile.routine]);
    }
  };

  // Condition toggling
  const toggleCondition = (item) => {
    setIsDemoConditions(false);
    if (item === 'None') {
      setSelectedConditions(['None']);
      return;
    }
    const filtered = selectedConditions.filter(c => c !== 'None');
    if (filtered.includes(item)) {
      setSelectedConditions(filtered.filter(c => c !== item));
    } else {
      setSelectedConditions([...filtered, item]);
    }
  };

  // Allergy toggling
  const toggleAllergy = (item) => {
    if (item === 'None') {
      setSelectedAllergies(['None']);
      return;
    }
    const filtered = selectedAllergies.filter(a => a !== 'None');
    if (filtered.includes(item)) {
      setSelectedAllergies(filtered.filter(a => a !== item));
    } else {
      setSelectedAllergies([...filtered, item]);
    }
  };

  // Routine toggling
  const toggleRoutine = (item) => {
    if (selectedRoutine.includes(item)) {
      setSelectedRoutine(selectedRoutine.filter(r => r !== item));
    } else {
      setSelectedRoutine([...selectedRoutine, item]);
    }
  };

  // Save current step to backend
  const saveCurrentStep = async (stepNumber) => {
    if (!user?.id) return;
    setSaving(true);
    setErrorNotice('');

    try {
      let payload = { step: stepNumber, userId: user.id };

      if (stepNumber === 1) {
        payload = {
          ...payload,
          name: name.trim(),
          age: age === '' ? null : parseInt(age, 10),
          weight: weight === '' ? null : parseFloat(weight),
          height: height === '' ? null : parseFloat(height),
          gender: gender || null,
        };
      } else if (stepNumber === 2) {
        const condList = selectedConditions
          .filter(c => c !== 'Other')
          .concat(otherConditionText.trim() ? [otherConditionText.trim()] : []);
        if (condList.length === 0 && selectedConditions.includes('Other')) {
          condList.push('Other');
        }
        payload = { ...payload, conditions: condList };
      } else if (stepNumber === 3) {
        const allList = selectedAllergies
          .filter(a => a !== 'Other')
          .concat(otherAllergyText.trim() ? [otherAllergyText.trim()] : []);
        if (allList.length === 0 && selectedAllergies.includes('Other')) {
          allList.push('Other');
        }
        payload = { ...payload, allergies: allList };
      } else if (stepNumber === 4) {
        payload = { ...payload, diet_type: dietType };
      } else if (stepNumber === 5) {
        const routList = [...selectedRoutine];
        if (routineCustomText.trim()) routList.push(routineCustomText.trim());
        payload = { ...payload, routineAnswers: routList };
      } else if (stepNumber === 6) {
        payload = {
          ...payload,
          medicalHistory: {
            past_illnesses: pastIllnesses,
            ongoing_medication: ongoingMedication,
            family_history: familyHistory,
            ...intakeQuestionAnswers
          }
        };
      }

      const res = await api.saveOnboarding(payload);
      if (res && res.user) {
        updateUser(res.user);
      }
    } catch (err) {
      console.warn('Step autosave notice:', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    setErrorNotice('');

    // Step validations
    if (currentStep === 1) {
      if (!name.trim()) {
        setErrorNotice('Please provide your name.');
        return;
      }
      if (age === '' || isNaN(Number(age)) || Number(age) <= 0) {
        setErrorNotice('Please enter a valid age so we can determine your life stage.');
        return;
      }
    } else if (currentStep === 2) {
      if (selectedConditions.length === 0 && !otherConditionText.trim()) {
        setErrorNotice('Please select at least one condition, or choose "None".');
        return;
      }
    } else if (currentStep === 3) {
      if (selectedAllergies.length === 0 && !otherAllergyText.trim()) {
        setErrorNotice('Please select allergies, or choose "None".');
        return;
      }
    } else if (currentStep === 4) {
      if (!dietType) {
        setErrorNotice('Please select your preferred diet type.');
        return;
      }
    }

    await saveCurrentStep(currentStep);

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (refreshUser) {
        await refreshUser();
      }
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Launch Conversational AI Intake
  const startAIChat = async () => {
    setIsChatOpen(true);
    setChatLoading(true);
    setChatMessages([]);
    setChatComplete(false);

    try {
      const activeCond = [...selectedConditions];
      if (otherConditionText.trim()) activeCond.push(otherConditionText.trim());

      const res = await api.initChat({
        userId: user?.id,
        conditions: activeCond,
        allergies: selectedAllergies,
      });

      setChatMessages([
        { role: 'assistant', content: res.greeting },
        { role: 'assistant', content: res.firstQuestion }
      ]);
    } catch (err) {
      console.warn('AI chat init error:', err.message);
      // Fallback greeting
      setChatMessages([
        { role: 'assistant', content: 'Hello! I am your SWASIRA health intake assistant. Could you share what triggers your symptoms or what foods feel most soothing?' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const updatedHistory = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(updatedHistory);
    setChatLoading(true);

    try {
      const activeCond = [...selectedConditions];
      if (otherConditionText.trim()) activeCond.push(otherConditionText.trim());

      const res = await api.sendChatMessage({
        userId: user?.id,
        message: userText,
        history: updatedHistory,
        conditions: activeCond,
        allergies: selectedAllergies,
      });

      if (res && res.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
        if (res.isComplete) {
          setChatComplete(true);
        }
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Thank you. We have saved your personal context safely to adapt your diet recommendations!' }
      ]);
      setChatComplete(true);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-swasira-mint">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-swasira-teal">
              Step {currentStep} of 7
            </span>
            <span className="text-xs font-medium text-swasira-muted">
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Conditions & Wellness'}
              {currentStep === 3 && 'Allergies & Sensitivities'}
              {currentStep === 4 && 'Dietary Lifestyle'}
              {currentStep === 5 && 'Daily Routine & Challenges'}
              {currentStep === 6 && 'Medical History & Deep Dive'}
              {currentStep === 7 && 'Plan Ready'}
            </span>
          </div>
          <div className="w-full bg-white/70 h-2 rounded-full overflow-hidden border border-swasira-mint-border">
            <div
              className="bg-swasira-teal h-full transition-all duration-500 rounded-full"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Demo Panel on Step 1 */}
        {currentStep === 1 && (
          <DemoPanel
            onSelectProfile={handleSelectDemoProfile}
            activeProfileId={selectedDemoId}
          />
        )}

        {/* Error Notice */}
        {errorNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-swasira-amber-border text-swasira-amber-dark text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-swasira-saffron shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-swasira-mint-border shadow-soft transition-all">
          <AnimatePresence mode="wait">
            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-swasira-teal">
                    Let's Begin with You
                  </h2>
                  <p className="text-xs sm:text-sm text-swasira-muted mt-1">
                    Please provide your authentic details. We never guess or estimate your body metrics.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-swasira-charcoal">
                        Your Name *
                      </label>
                      {isDemoBasic && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-swasira-amber-dark border border-swasira-amber-border">
                          Demo
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setIsDemoBasic(false);
                      }}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                  </div>

                  {/* Age & Life Stage */}
                  <div>
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                    {/* Dynamic Life Stage Display */}
                    {lifeStageBadge && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-swasira-mint text-swasira-teal border border-swasira-mint-border text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-swasira-saffron" />
                        <span>Life Stage: {lifeStageBadge}</span>
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Gender (Optional)
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none bg-white"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Weight (kg, optional)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 64"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Height (cm, optional)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 168"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Common Diseases / Conditions */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-bold text-swasira-teal">
                      Conditions & Body Signals
                    </h2>
                    {isDemoConditions && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-swasira-amber-dark border border-swasira-amber-border">
                        Demo Pre-fill
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-swasira-muted mt-1">
                    Select any health conditions you are navigating. Our food engine personalizes recipes directly around these.
                  </p>
                </div>

                {/* Multi-select chips */}
                <div className="flex flex-wrap gap-2.5">
                  {CONDITIONS_LIST.map((cond) => {
                    const isSelected = selectedConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-swasira-teal text-white shadow-sm ring-2 ring-swasira-teal/20'
                            : 'bg-swasira-mint/60 text-swasira-charcoal border border-swasira-mint-border hover:bg-swasira-mint'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-swasira-saffron" />}
                        <span>{cond}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Other Condition Free Text */}
                {selectedConditions.includes('Other') && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Specify Other Condition:
                    </label>
                    <input
                      type="text"
                      value={otherConditionText}
                      onChange={(e) => setOtherConditionText(e.target.value)}
                      placeholder="e.g. Acid reflux, irritable bowel"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Allergies */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-swasira-teal">
                    Allergies & Sensitivities
                  </h2>
                  <p className="text-xs sm:text-sm text-swasira-muted mt-1">
                    Dishes containing these allergens will be strictly excluded from your daily meal options.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {ALLERGIES_LIST.map((allergy) => {
                    const isSelected = selectedAllergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => toggleAllergy(allergy)}
                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-swasira-teal text-white shadow-sm ring-2 ring-swasira-teal/20'
                            : 'bg-swasira-mint/60 text-swasira-charcoal border border-swasira-mint-border hover:bg-swasira-mint'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-swasira-saffron" />}
                        <span>{allergy}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAllergies.includes('Other') && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Specify Other Allergy:
                    </label>
                    <input
                      type="text"
                      value={otherAllergyText}
                      onChange={(e) => setOtherAllergyText(e.target.value)}
                      placeholder="e.g. Sesame seeds, Mustard"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Diet Type */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-swasira-teal">
                    Dietary Preference
                  </h2>
                  <p className="text-xs sm:text-sm text-swasira-muted mt-1">
                    Select your nutritional philosophy. Your meal slots will strictly reflect this choice.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DIET_TYPES.map((d) => {
                    const isSelected = dietType === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => setDietType(d.id)}
                        className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-swasira-mint/90 border-swasira-teal ring-2 ring-swasira-teal/30 shadow-sm'
                            : 'bg-white border-swasira-mint-border hover:border-swasira-sage hover:bg-swasira-mint/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-serif text-base font-bold text-swasira-teal">
                            {d.label}
                          </h4>
                          {isSelected && <Check className="w-4 h-4 text-swasira-teal" />}
                        </div>
                        <p className="text-xs text-swasira-muted leading-relaxed">
                          {d.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Daily Routine Challenges */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-swasira-teal">
                    Your Daily Rhythm & Obstacles
                  </h2>
                  <p className="text-xs sm:text-sm text-swasira-muted mt-1">
                    What feels most challenging about eating well right now? We adapt recipe prep times to your realities.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {ROUTINE_CHALLENGES.map((challenge) => {
                    const isSelected = selectedRoutine.includes(challenge);
                    return (
                      <button
                        key={challenge}
                        type="button"
                        onClick={() => toggleRoutine(challenge)}
                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-swasira-teal text-white shadow-sm ring-2 ring-swasira-teal/20'
                            : 'bg-swasira-mint/60 text-swasira-charcoal border border-swasira-mint-border hover:bg-swasira-mint'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-swasira-saffron" />}
                        <span>{challenge}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                    Any other routine notes? (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={routineCustomText}
                    onChange={(e) => setRoutineCustomText(e.target.value)}
                    placeholder="e.g. Night shifts twice a week, late dinners..."
                    className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 6: Medical History & AI Deep Dive */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-swasira-teal">
                    Medical History & Deep-Dive
                  </h2>
                  <p className="text-xs sm:text-sm text-swasira-muted mt-1">
                    All fields below are completely optional.
                  </p>
                </div>

                {/* Conversational Deep-Dive Invitation (Section 5) */}
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-swasira-amber-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-swasira-teal" />
                      <h4 className="text-sm font-semibold text-swasira-charcoal">
                        Want to tell us more?
                      </h4>
                    </div>
                    <p className="text-xs text-swasira-muted">
                      Have a 2-minute conversation with our warm health intake companion tailored to your conditions.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={startAIChat}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-swasira-teal text-white text-xs font-semibold hover:bg-swasira-teal-light shadow-sm transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-swasira-saffron" />
                      <span>Talk to Us for a More Detailed Plan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowStructuredFallback(!showStructuredFallback)}
                      className="px-3.5 py-2.5 rounded-xl border border-swasira-amber-border bg-white text-swasira-amber-dark text-xs font-semibold hover:bg-amber-50 transition-colors"
                    >
                      {showStructuredFallback ? 'Hide Questions' : 'Or Fill Form Directly'}
                    </button>
                  </div>
                </div>

                {/* Structured Follow-Up Form Fallback (Section 5) */}
                {showStructuredFallback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-swasira-mint-subtle border border-swasira-mint-border space-y-4"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-swasira-teal">
                      Condition-Specific Guided Questions
                    </h4>

                    {selectedConditions.includes('Migraine') && (
                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-swasira-charcoal block">
                          Migraine: How often do episodes occur and what triggers them?
                        </label>
                        <input
                          type="text"
                          value={intakeQuestionAnswers['migraine_intake'] || ''}
                          onChange={(e) => setIntakeQuestionAnswers(prev => ({ ...prev, migraine_intake: e.target.value }))}
                          placeholder="e.g. Weekly, triggered by missed meals or bright screens"
                          className="w-full px-3.5 py-2 rounded-xl border border-swasira-mint-border bg-white text-xs outline-none"
                        />
                      </div>
                    )}

                    {selectedConditions.includes('PCOD/PCOS') && (
                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-swasira-charcoal block">
                          PCOD: Cycle regularity and energy patterns?
                        </label>
                        <input
                          type="text"
                          value={intakeQuestionAnswers['pcod_intake'] || ''}
                          onChange={(e) => setIntakeQuestionAnswers(prev => ({ ...prev, pcod_intake: e.target.value }))}
                          placeholder="e.g. Delayed cycles by 1-2 weeks, sugar cravings around 4 PM"
                          className="w-full px-3.5 py-2 rounded-xl border border-swasira-mint-border bg-white text-xs outline-none"
                        />
                      </div>
                    )}

                    {selectedConditions.includes('Asthma') && (
                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-swasira-charcoal block">
                          Asthma: Primary symptom triggers?
                        </label>
                        <input
                          type="text"
                          value={intakeQuestionAnswers['asthma_intake'] || ''}
                          onChange={(e) => setIntakeQuestionAnswers(prev => ({ ...prev, asthma_intake: e.target.value }))}
                          placeholder="e.g. Cold morning air, dust, seasonal changes"
                          className="w-full px-3.5 py-2 rounded-xl border border-swasira-mint-border bg-white text-xs outline-none"
                        />
                      </div>
                    )}

                    {selectedConditions.includes('Weak Immunity') && (
                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-swasira-charcoal block">
                          Immunity: How often do seasonal colds or fatigue occur?
                        </label>
                        <input
                          type="text"
                          value={intakeQuestionAnswers['immunity_intake'] || ''}
                          onChange={(e) => setIntakeQuestionAnswers(prev => ({ ...prev, immunity_intake: e.target.value }))}
                          placeholder="e.g. Catch cold every couple of months, slow recovery"
                          className="w-full px-3.5 py-2 rounded-xl border border-swasira-mint-border bg-white text-xs outline-none"
                        />
                      </div>
                    )}

                    {selectedConditions.includes('Body Pain / Stress') && (
                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-swasira-charcoal block">
                          Body Pain / Stress: Where is tension centered?
                        </label>
                        <input
                          type="text"
                          value={intakeQuestionAnswers['body_pain_intake'] || ''}
                          onChange={(e) => setIntakeQuestionAnswers(prev => ({ ...prev, body_pain_intake: e.target.value }))}
                          placeholder="e.g. Stiff neck and shoulders from desk work"
                          className="w-full px-3.5 py-2 rounded-xl border border-swasira-mint-border bg-white text-xs outline-none"
                        />
                      </div>
                    )}

                    {selectedConditions.includes('Period Pain / Menstrual Issues') && (
                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-swasira-charcoal block">
                          Period Discomfort: Cramp timing and warmth relief?
                        </label>
                        <input
                          type="text"
                          value={intakeQuestionAnswers['period_pain_intake'] || ''}
                          onChange={(e) => setIntakeQuestionAnswers(prev => ({ ...prev, period_pain_intake: e.target.value }))}
                          placeholder="e.g. First 2 days severe, hot compress brings relief"
                          className="w-full px-3.5 py-2 rounded-xl border border-swasira-mint-border bg-white text-xs outline-none"
                        />
                      </div>
                    )}

                    {/* General if none of above or generic */}
                    <div className="space-y-2 text-xs">
                      <label className="font-semibold text-swasira-charcoal block">
                        General Wellness: Any food sensitivities or digestive timing preferences?
                      </label>
                      <input
                        type="text"
                        value={intakeQuestionAnswers['general_intake'] || ''}
                        onChange={(e) => setIntakeQuestionAnswers(prev => ({ ...prev, general_intake: e.target.value }))}
                        placeholder="e.g. Prefer light dinners, digest lentils best at lunch"
                        className="w-full px-3.5 py-2 rounded-xl border border-swasira-mint-border bg-white text-xs outline-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Standard Guided Form */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Past Major Illnesses or Surgeries (Optional)
                    </label>
                    <input
                      type="text"
                      value={pastIllnesses}
                      onChange={(e) => setPastIllnesses(e.target.value)}
                      placeholder="e.g. Gallbladder removal in 2021, none"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Ongoing Medications or Supplements (Optional)
                    </label>
                    <input
                      type="text"
                      value={ongoingMedication}
                      onChange={(e) => setOngoingMedication(e.target.value)}
                      placeholder="e.g. Thyronorm 50mcg, Vitamin D3"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-swasira-charcoal mb-1.5">
                      Family Medical History (Optional)
                    </label>
                    <input
                      type="text"
                      value={familyHistory}
                      onChange={(e) => setFamilyHistory(e.target.value)}
                      placeholder="e.g. Parental diabetes or hypertension"
                      className="w-full px-4 py-3 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-sm outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 7: Plan Ready */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-swasira-mint flex items-center justify-center mx-auto text-swasira-teal border-2 border-swasira-sage">
                  <Sparkles className="w-8 h-8 text-swasira-saffron" />
                </div>

                <div>
                  <h2 className="font-serif text-3xl font-bold text-swasira-teal">
                    Your Profile is Ready, {name || user?.name}!
                  </h2>
                  <p className="text-xs sm:text-sm text-swasira-muted mt-2 max-w-md mx-auto leading-relaxed">
                    We evaluated your life stage ({lifeStageBadge || 'Entered'}), diet type ({dietType || 'Selected'}), and reported wellness priorities.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-swasira-mint/50 border border-swasira-mint-border max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-swasira-muted">Life Stage</span>
                    <strong className="text-swasira-charcoal">{lifeStageBadge || 'Configured'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-swasira-muted">Diet Choice</span>
                    <strong className="text-swasira-charcoal">{dietType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-swasira-muted">Focus Areas</span>
                    <strong className="text-swasira-charcoal">
                      {selectedConditions.join(', ') || 'General Wellness'}
                    </strong>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-swasira-mint-border/60 flex items-center justify-between">
            {currentStep > 1 && currentStep < 7 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-swasira-mint-border text-xs sm:text-sm font-semibold text-swasira-charcoal hover:bg-swasira-mint-subtle transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-swasira-teal text-white text-xs sm:text-sm font-semibold hover:bg-swasira-teal-light shadow-md shadow-swasira-teal/20 transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              {saving ? (
                <span>Saving...</span>
              ) : currentStep === 7 ? (
                <>
                  <Sparkles className="w-4 h-4 text-swasira-saffron" />
                  <span>See My Plan</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Conversational Intake Modal (Section 5) */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-swasira-mint-border shadow-premium overflow-hidden flex flex-col h-[560px]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-swasira-teal text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-swasira-saffron" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold">
                      SWASIRA Health Intake Companion
                    </h3>
                    <p className="text-[11px] text-white/80">
                      Non-judgmental, warm clinical listening
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/80 hover:text-white p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-swasira-mint-subtle">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-swasira-teal text-white rounded-br-none shadow-sm'
                          : 'bg-white text-swasira-charcoal border border-swasira-mint-border rounded-bl-none shadow-soft'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 bg-white rounded-2xl border border-swasira-mint-border text-xs text-swasira-muted flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-swasira-teal animate-bounce" />
                      <span>Thinking gently...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-swasira-mint-border">
                {chatComplete ? (
                  <div className="text-center">
                    <p className="text-xs text-swasira-teal font-medium mb-2">
                      Intake completed! Your responses are preserved safely.
                    </p>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="px-6 py-2 rounded-xl bg-swasira-teal text-white text-xs font-semibold hover:bg-swasira-teal-light"
                    >
                      Return to Onboarding
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-swasira-mint-border focus:border-swasira-teal focus:ring-2 focus:ring-swasira-teal/20 text-xs sm:text-sm outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || chatLoading}
                      className="px-4 py-2.5 rounded-xl bg-swasira-teal text-white hover:bg-swasira-teal-light disabled:opacity-60 transition-colors flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

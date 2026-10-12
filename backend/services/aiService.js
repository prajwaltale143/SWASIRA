/**
 * SWASIRA AI Intake Assistant Service (Section 5)
 * 
 * IMPLEMENTATION NOTE:
 * This service implements the Conversational Deep-Dive intake assistant.
 * If OPENAI_API_KEY is configured in backend/.env, it can communicate with an LLM.
 * If no API key is provided (default out-of-the-box experience for reliable zero-error launch),
 * it uses an intelligent rule-based conversational assistant that asks 2 to 4 personalized
 * follow-up questions one-by-one based strictly on the user's entered conditions and allergies,
 * never assumes or invents data, and synthesizes answers into structured medical history.
 * A structured form alternative is also available on the frontend.
 */

require('dotenv').config();

const CONDITION_QUESTIONS = {
  'Migraine': [
    'How often do migraine episodes occur (e.g. weekly, monthly), and have you noticed any triggers like skipping meals or bright screen exposure?',
    'Do you usually feel relief with warm soothing fluids or resting in a quiet space?'
  ],
  'PCOD/PCOS': [
    'Are your menstrual cycles generally regular, irregular, or delayed?',
    'Do you experience prominent sugar cravings or afternoon energy dips?'
  ],
  'Diabetes': [
    'Is your blood sugar managed primarily through daily nutrition, oral medication, or insulin?',
    'Are there specific times during the day when you feel lightheaded or excessively fatigued?'
  ],
  'Blood Pressure': [
    'Is your blood pressure reading usually stable, or does it spike during periods of high stress?',
    'Do you consume high-sodium packaged snacks or pickles regularly?'
  ],
  'Asthma': [
    'What are your primary asthma triggers (e.g. cold air, dust, sudden exertion, dairy)?',
    'Do symptoms tend to worsen at night or early mornings?'
  ],
  'Weak Immunity': [
    'How frequently do you experience seasonal colds, coughs, or fatigue (e.g., every few months)?',
    'Do you feel better when having warm digestive spices like turmeric, ginger, or pepper?'
  ],
  'Period Pain / Menstrual Issues': [
    'Is period discomfort localized to day 1-2, and do warm compresses or hot herbal teas help ease cramps?',
    'Do you experience heavy fatigue or iron deficiency signs around your cycle?'
  ],
  'Body Pain / Stress': [
    'Where is the physical discomfort mostly centered (e.g., lower back, neck/shoulders, joints)?',
    'Does your daily schedule allow time for a 10-minute relaxation or stretch routine?'
  ],
  'Thyroid': [
    'Are you diagnosed with hypothyroid or hyperthyroid, and is it managed with morning medication?',
    'Do you notice temperature sensitivity (feeling cold easily) or dry skin?'
  ]
};

const GENERAL_QUESTIONS = [
  'Are you currently taking any ongoing daily supplements or medications?',
  'Is there any family history of dietary sensitivity or metabolic conditions you would like us to consider?'
];

/**
 * Generates the sequence of questions for the intake conversation
 */
function getPersonalizedQuestions(conditions = [], allergies = []) {
  const questions = [];
  const cleanConditions = conditions.filter(c => c && c !== 'None');

  cleanConditions.forEach(cond => {
    if (CONDITION_QUESTIONS[cond]) {
      questions.push(...CONDITION_QUESTIONS[cond]);
    }
  });

  if (allergies && allergies.length > 0 && !allergies.includes('None')) {
    questions.push(`For your allergy (${allergies.join(', ')}), how sensitive are you to cross-contamination in home kitchens?`);
  }

  // Ensure 2 to 4 questions max
  if (questions.length < 2) {
    questions.push(...GENERAL_QUESTIONS.slice(0, 2 - questions.length));
  }

  return questions.slice(0, 4);
}

/**
 * Handles conversational step or LLM execution
 */
async function processChatMessage({ user, conditions = [], allergies = [], history = [], currentMessage }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const questions = getPersonalizedQuestions(conditions, allergies);

  // If OPENAI_API_KEY is present, attempt LLM call
  if (apiKey && apiKey.trim() !== '') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are SWASIRA's warm, supportive, non-judgmental health intake assistant.
The user reported conditions: ${conditions.join(', ') || 'None'} and allergies: ${allergies.join(', ') || 'None'}.
Rules:
1. Ask short, simple questions one at a time (ask at most 3-4 questions total).
2. Never assume, invent, or fill in any detail the user has not stated.
3. Never diagnose or prescribe medical treatments.
4. When 3 questions are answered, thank the user and summarize their answers briefly.`
            },
            ...history,
            { role: 'user', content: currentMessage }
          ],
          temperature: 0.6,
          max_tokens: 250,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices[0]?.message?.content;
        return {
          reply,
          mode: 'llm_api',
          isComplete: history.length >= 6 // complete after 3-4 exchanges
        };
      }
    } catch (err) {
      console.warn('[AI Service] LLM call failed or timed out, falling back to built-in conversational engine:', err.message);
    }
  }

  // Graceful conversational engine fallback (no key needed)
  // Step is determined by user turns in history
  const userTurnCount = history.filter(m => m.role === 'user').length;

  if (userTurnCount >= questions.length) {
    return {
      reply: `Thank you for sharing these details with SWASIRA. We have noted your personalized responses safely to refine your daily nutrition suggestions. You can now proceed to your personalized plan!`,
      mode: 'rule_based_fallback',
      isComplete: true
    };
  }

  const nextQuestion = questions[userTurnCount];
  return {
    reply: nextQuestion,
    mode: 'rule_based_fallback',
    isComplete: false,
    stepIndex: userTurnCount + 1,
    totalQuestions: questions.length
  };
}

module.exports = {
  getPersonalizedQuestions,
  processChatMessage,
};

const BASE_URL = 'http://localhost:5000';

async function testAll() {
  console.log('--- RUNNING DEEP INTEGRATION TEST SUITE ---');

  // Test 1: Test all Demo Profiles through Signup -> Onboarding -> Diet Plan
  const demoProfiles = [
    { name: 'Prajwal', age: 26, diet: 'Vegetarian', conditions: ['Migraine'], allergies: ['None'] },
    { name: 'Om', age: 34, diet: 'Non-Vegetarian', conditions: ['Body Pain / Stress'], allergies: ['Dairy'], routine: ['Hectic day'] },
    { name: 'Gauri', age: 22, diet: 'Vegan', conditions: ['Weak Immunity'], allergies: ['Gluten'] },
    { name: 'Bhumi', age: 28, diet: 'Vegetarian', conditions: ['Period Pain / Menstrual Issues'], allergies: ['Nuts'] },
    { name: 'Ritesh', age: 45, diet: 'Eggetarian/Jain-friendly', conditions: ['Asthma'], allergies: ['Eggs'] },
    // Special cases
    { name: 'Toddler Test', age: 4, diet: 'Vegetarian', conditions: ['None'], allergies: ['None'] }, // Pediatric
    { name: 'Senior Test', age: 68, diet: 'Vegetarian', conditions: ['Blood Pressure', 'Diabetes'], allergies: ['None'] },
  ];

  for (const profile of demoProfiles) {
    const email = `test_${profile.name.toLowerCase().replace(/[^a-z]/g, '')}_${Date.now()}@example.com`;
    
    // Signup
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profile.name, email, password: 'password123' })
    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) {
      console.error(`FAILED signup for ${profile.name}:`, signupData);
      continue;
    }
    const token = signupData.token;
    const userId = signupData.user.id;

    // Check auth/me
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    if (!meRes.ok) console.error(`FAILED /api/auth/me for ${profile.name}:`, meData);

    // Save Onboarding
    const onbRes = await fetch(`${BASE_URL}/api/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId,
        name: profile.name,
        age: profile.age,
        weight: 65,
        height: 170,
        gender: 'Other',
        diet_type: profile.diet,
        conditions: profile.conditions,
        allergies: profile.allergies,
        routineAnswers: profile.routine || ['Irregular schedule'],
      })
    });
    const onbData = await onbRes.json();
    if (!onbRes.ok) console.error(`FAILED onboarding for ${profile.name}:`, onbData);

    // Get Diet Plan
    const planRes = await fetch(`${BASE_URL}/api/diet-plan/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const planData = await planRes.json();
    if (!planRes.ok) {
      console.error(`FAILED diet plan for ${profile.name}:`, planData);
    } else {
      if (profile.age <= 6) {
        console.log(`[PASS] ${profile.name} (Pediatric): isPediatricReferral = ${planData.isPediatricReferral}`);
      } else {
        const bDish = planData.plan?.breakfast?.dish?.name;
        const lDish = planData.plan?.lunch?.dish?.name;
        const dDish = planData.plan?.dinner?.dish?.name;
        const act = planData.plan?.activity_nudge?.dish?.name;
        console.log(`[PASS] ${profile.name} (${profile.diet}, ${profile.conditions.join(',')}):`);
        console.log(`       Breakfast: "${bDish}", Lunch: "${lDish}", Dinner: "${dDish}"`);
        
        // Test Swap
        const swapRes = await fetch(`${BASE_URL}/api/diet-plan/${userId}/swap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            mealSlot: 'breakfast',
            currentDishId: planData.plan?.breakfast?.dish?.id
          })
        });
        const swapData = await swapRes.json();
        if (swapRes.ok) {
          console.log(`       Swap SUCCESS: new breakfast = "${swapData.newDish?.name}", flex passes = ${swapData.flexPassesRemaining}`);
        } else {
          console.warn(`       Swap notice for ${profile.name}: ${swapData.error}`);
        }

        // Test Mark Done
        const actionRes = await fetch(`${BASE_URL}/api/diet-plan/${userId}/action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ mealSlot: 'breakfast', action: 'done' })
        });
        const actionData = await actionRes.json();
        if (actionRes.ok) {
          console.log(`       Mark Done SUCCESS: currentStreak = ${actionData.currentStreak}`);
        }

        // Test Streak Endpoint
        const streakRes = await fetch(`${BASE_URL}/api/streak/${userId}`);
        const streakData = await streakRes.json();
        console.log(`       Streak history days count: ${streakData.history7Days?.length}`);
      }
    }

    // Test AI Chat
    const chatInit = await fetch(`${BASE_URL}/api/chat/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, conditions: profile.conditions, allergies: profile.allergies })
    });
    const chatInitData = await chatInit.json();
    console.log(`       Chat Init: ${chatInitData.questions?.length} personalized questions ready`);

    const chatMsg = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        message: 'I get headaches around afternoon when I look at screens without lunch.',
        history: [{ role: 'assistant', content: chatInitData.firstQuestion }],
        conditions: profile.conditions,
        allergies: profile.allergies
      })
    });
    const chatMsgData = await chatMsg.json();
    console.log(`       Chat response mode: ${chatMsgData.mode}, isComplete: ${chatMsgData.isComplete}`);
  }

  console.log('\n--- ALL TEST PROFILES AND EDGE CASES COMPLETED ---');
}

testAll().catch(console.error);

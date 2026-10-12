/**
 * SWASIRA Verification Health Check Script (Rule 8)
 * Tests an already RUNNING backend instance on http://localhost:5000.
 * Verifies: Health -> Signup -> Login -> Onboarding -> Diet Plan Recommendation
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

async function runCheck() {
  console.log('\n======================================================');
  console.log('       SWASIRA FULL-STACK AUTOMATED HEALTH CHECK       ');
  console.log('======================================================\n');
  console.log(`Target Backend: ${BASE_URL}\n`);

  let passedCount = 0;
  let totalCount = 5;

  let testUser = {
    name: 'Automation Tester',
    email: `tester_${Date.now()}@example.com`,
    password: 'Password123!',
  };
  let authToken = null;
  let userId = null;

  // STEP 1: /api/health
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    if (res.status === 200 && data.status === 'ok') {
      console.log('  [PASS] Step 1: GET /api/health responded with status "ok"');
      passedCount++;
    } else {
      console.log(`  [FAIL] Step 1: GET /api/health failed with status ${res.status}`);
    }
  } catch (err) {
    console.log(`  [FAIL] Step 1: GET /api/health failed. Is backend running on port 5000?`);
    console.log(`         Error: ${err.message}\n`);
    console.log('Please ensure the SWASIRA backend is running before running "npm run check".');
    console.log('Run: npm run dev\n');
    process.exit(1);
  }

  // STEP 2: POST /api/auth/signup
  try {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const data = await res.json();
    if (res.status === 201 && data.token && data.user) {
      authToken = data.token;
      userId = data.user.id;
      console.log(`  [PASS] Step 2: POST /api/auth/signup created user #${userId} (${testUser.email})`);
      passedCount++;
    } else {
      console.log(`  [FAIL] Step 2: POST /api/auth/signup returned ${res.status}:`, data);
    }
  } catch (err) {
    console.log(`  [FAIL] Step 2: POST /api/auth/signup error:`, err.message);
  }

  // STEP 3: POST /api/auth/login
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.token) {
      authToken = data.token;
      console.log('  [PASS] Step 3: POST /api/auth/login successfully authenticated');
      passedCount++;
    } else {
      console.log(`  [FAIL] Step 3: POST /api/auth/login returned ${res.status}:`, data);
    }
  } catch (err) {
    console.log(`  [FAIL] Step 3: POST /api/auth/login error:`, err.message);
  }

  // STEP 4: POST /api/onboarding
  try {
    const res = await fetch(`${BASE_URL}/api/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        userId,
        name: 'Automation Tester',
        age: 29,
        weight: 65,
        height: 172,
        gender: 'Female',
        diet_type: 'Vegetarian',
        conditions: ['Migraine'],
        allergies: ['None'],
        routineAnswers: ['No time to cook'],
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.user && data.user.age === 29) {
      console.log('  [PASS] Step 4: POST /api/onboarding saved user health and condition inputs');
      passedCount++;
    } else {
      console.log(`  [FAIL] Step 4: POST /api/onboarding returned ${res.status}:`, data);
    }
  } catch (err) {
    console.log(`  [FAIL] Step 4: POST /api/onboarding error:`, err.message);
  }

  // STEP 5: GET /api/diet-plan/:userId
  try {
    const res = await fetch(`${BASE_URL}/api/diet-plan/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    const data = await res.json();
    if (res.status === 200 && data.isComplete && data.plan && data.plan.breakfast && data.plan.lunch) {
      console.log(`  [PASS] Step 5: GET /api/diet-plan/:userId generated personalized plan:`);
      console.log(`         • Breakfast: "${data.plan.breakfast.dish?.name}"`);
      console.log(`         • Lunch:     "${data.plan.lunch.dish?.name}"`);
      console.log(`         • Dinner:    "${data.plan.dinner.dish?.name}"`);
      console.log(`         • Nutrients: Carbs: ${data.nutrientTotals?.carbs}g, Protein: ${data.nutrientTotals?.protein}g`);
      passedCount++;
    } else {
      console.log(`  [FAIL] Step 5: GET /api/diet-plan/:userId returned:`, data);
    }
  } catch (err) {
    console.log(`  [FAIL] Step 5: GET /api/diet-plan/:userId error:`, err.message);
  }

  console.log('\n------------------------------------------------------');
  if (passedCount === totalCount) {
    console.log(`🎉 ALL ${totalCount} CHECKS PASSED! The SWASIRA system is 100% operational.`);
    console.log('------------------------------------------------------\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${passedCount}/${totalCount} checks passed. Please review the output above.`);
    console.log('------------------------------------------------------\n');
    process.exit(1);
  }
}

runCheck();

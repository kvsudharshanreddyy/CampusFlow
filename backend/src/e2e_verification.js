const API_URL = 'http://localhost:5000/api/v1';
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('🚀 [E2E] Starting complete CampusFlow API verification...\n');

  const testEmail = `verification-${Date.now()}@example.com`;
  const testPassword = 'password123';
  let userId;
  let token;
  let taskId;
  let eventId;

  // =========================================================================
  // 1. AUTHENTICATION FLOW
  // =========================================================================
  try {
    console.log('[AUTH] Registering user:', testEmail);
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const regData = await regRes.json();
    if (regRes.status !== 201) throw new Error(`Registration failed: ${regData.message}`);
    userId = regData.data.id;
    console.log(`[AUTH] User registered. ID: ${userId}`);

    console.log('[AUTH] Logging in...');
    const logRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const logData = await logRes.json();
    if (logRes.status !== 200) throw new Error(`Login failed: ${logData.message}`);
    token = logData.data.token;
    console.log('[AUTH] Logged in successfully. Token generated.');
  } catch (err) {
    console.error('❌ AUTH FLOW FAILED:', err.message);
    process.exit(1);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Automation-Token': 'campusflow_secret'
  };

  // =========================================================================
  // 2. TASK OPERATIONS
  // =========================================================================
  try {
    console.log('[TASKS] Creating a new pending task...');
    const taskRes = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Complete E2E Test Suite',
        status: 'pending',
        due_date: new Date(Date.now() + 24*60*60*1000).toISOString()
      })
    });
    const taskData = await taskRes.json();
    if (taskRes.status !== 201) throw new Error(`Task creation failed: ${taskData.message}`);
    taskId = taskData.data.id;
    console.log(`[TASKS] Task created. ID: ${taskId}`);

    console.log('[TASKS] Fetching upcoming tasks...');
    const upcomingRes = await fetch(`${API_URL}/tasks/upcoming`, { headers: authHeaders });
    const upcomingData = await upcomingRes.json();
    if (upcomingRes.status !== 200) throw new Error('Failed to fetch upcoming tasks');
    console.log(`[TASKS] Upcoming tasks loaded. Count: ${upcomingData.data.length}`);
  } catch (err) {
    console.error('❌ TASK OPERATIONS FAILED:', err.message);
    cleanup(userId);
    process.exit(1);
  }

  // =========================================================================
  // 3. CALENDAR EVENTS
  // =========================================================================
  try {
    console.log('[CALENDAR] Creating a study group session event...');
    const calRes = await fetch(`${API_URL}/calendar-events`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Study Session: Software Engineering',
        description: 'E2E test study group session for group ID: 00000000-0000-0000-0000-000000000000',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 60*60*1000).toISOString(),
        event_type: 'class'
      })
    });
    const calData = await calRes.json();
    if (calRes.status !== 201) throw new Error(`Calendar event creation failed: ${calData.message}`);
    eventId = calData.data.id;
    console.log(`[CALENDAR] Calendar event created. ID: ${eventId}`);
  } catch (err) {
    console.error('❌ CALENDAR OPERATIONS FAILED:', err.message);
    cleanup(userId);
    process.exit(1);
  }

  // =========================================================================
  // 4. AUTOMATION LOGS & WEBHOOKS
  // =========================================================================
  try {
    const webhookHeaders = {
      'Content-Type': 'application/json',
      'X-Automation-Token': 'campusflow_secret'
    };

    console.log('[AUTOMATION] Testing n8n workflow execution logger webhook...');
    const webRes = await fetch(`${API_URL}/automation-logs/webhooks`, {
      method: 'POST',
      headers: webhookHeaders,
      body: JSON.stringify({
        workflow_name: 'E2E Verification Run',
        status: 'success',
        message: 'Successfully validated webhook connection.'
      })
    });
    const webData = await webRes.json();
    if (webRes.status !== 201) throw new Error(`Webhook logging failed: ${webData.message}`);
    console.log('[AUTOMATION] Webhook log successfully saved in database.');

    console.log('[AUTOMATION] Testing Twilio/mock WhatsApp dispatcher...');
    const waRes = await fetch(`${API_URL}/automation-logs/whatsapp-dispatch`, {
      method: 'POST',
      headers: webhookHeaders,
      body: JSON.stringify({
        phone_number: '+1234567890',
        message: 'E2E Test Message: CampusFlow is fully functional!'
      })
    });
    const waData = await waRes.json();
    if (waRes.status !== 200) throw new Error(`WhatsApp dispatch failed: ${waData.message}`);
    console.log('[AUTOMATION] WhatsApp message log dispatched successfully.');
  } catch (err) {
    console.error('❌ AUTOMATION LOGS FAILED:', err.message);
    cleanup(userId);
    process.exit(1);
  }

  // =========================================================================
  // 5. AI ENDPOINTS
  // =========================================================================
  try {
    console.log('[AI] Testing GET /daily-tip...');
    const tipRes = await fetch(`${API_URL}/ai/daily-tip`, { headers: authHeaders });
    const tipData = await tipRes.json();
    if (tipRes.status !== 200) {
      console.error('[AI] Daily Tip failed. Status:', tipRes.status, 'Response:', tipData);
      throw new Error('Daily tip failed');
    }
    console.log('[AI] Daily Tip response received:', tipData.data.tip.slice(0, 50) + '...');

    console.log('[AI] Testing POST /ai/generate-flashcards...');
    const fcRes = await fetch(`${API_URL}/ai/generate-flashcards`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ text: 'Database transactions must follow ACID rules.', count: 2 })
    });
    const fcData = await fcRes.json();
    if (fcRes.status !== 200) throw new Error('Flashcard generator failed');
    console.log(`[AI] Generated ${fcData.data.length} flashcards.`);

    console.log('[AI] Testing POST /ai/generate-mcqs...');
    const mcqRes = await fetch(`${API_URL}/ai/generate-mcqs`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ text: 'Next.js supports static exports and dynamic rendering.', count: 1 })
    });
    const mcqData = await mcqRes.json();
    if (mcqRes.status !== 200) throw new Error('MCQ generator failed');
    console.log('[AI] MCQ response received.');

    console.log('[AI] Testing POST /ai/summarize-notice...');
    const noticeRes = await fetch(`${API_URL}/ai/summarize-notice`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ text: 'The mid-term exams will be conducted online from October 12th. Attendance is mandatory.' })
    });
    const noticeData = await noticeRes.json();
    if (noticeRes.status !== 200) throw new Error('Notice summarization failed');
    console.log('[AI] Notice summary completed.');

    console.log('[AI] Testing POST /ai/generate-study-plan...');
    const planRes = await fetch(`${API_URL}/ai/generate-study-plan`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ subjects: ['Algorithms', 'Systems'], goals: 'Pass with grade A' })
    });
    const planData = await planRes.json();
    if (planRes.status !== 200) throw new Error('Study plan failed');
    console.log('[AI] Study plan generated.');

    console.log('[AI] Testing POST /ai/predict-attendance...');
    const attRes = await fetch(`${API_URL}/ai/predict-attendance`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ subjectCode: 'CS101', attended: 12, total: 15, remaining: 10 })
    });
    const attData = await attRes.json();
    if (attRes.status !== 200) throw new Error('Attendance prediction failed');
    console.log('[AI] Attendance prediction completed.');

    console.log('[AI] Testing POST /ai/resume-suggestions...');
    const resumeRes = await fetch(`${API_URL}/ai/resume-suggestions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ resumeText: 'Wrote python script. Optimized database.', targetRole: 'Backend Engineer' })
    });
    const resumeData = await resumeRes.json();
    if (resumeRes.status !== 200) throw new Error('Resume suggestions failed');
    console.log('[AI] Resume suggestions completed.');

    console.log('[AI] Testing POST /ai/interview-questions...');
    const ivRes = await fetch(`${API_URL}/ai/interview-questions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ company: 'Google', role: 'SWE Intern', industry: 'Tech' })
    });
    const ivData = await ivRes.json();
    if (ivRes.status !== 200) throw new Error('Interview questions failed');
    console.log('[AI] Interview questions generated.');
  } catch (err) {
    console.error('❌ AI ENDPOINTS FAILED:', err.message);
    cleanup(userId);
    process.exit(1);
  }

  // =========================================================================
  // SUCCESS & CLEANUP
  // =========================================================================
  console.log('\n🎉 [E2E] All API integration checks successfully completed!');
  await cleanup(userId);
  console.log('[E2E] Cleaned up temporary test user data.');
  process.exit(0);
}

async function cleanup(userId) {
  if (userId) {
    try {
      await supabase.from('users').delete().eq('id', userId);
    } catch (err) {
      console.warn('[CLEANUP] Failed to remove test user:', err.message);
    }
  }
}

runTests();

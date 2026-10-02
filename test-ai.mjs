import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testGemini() {
  console.log('Testing Gemini...');
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GOOGLE_GENAI_API_KEY);
    const data = await res.json();
    if (data.error) console.error('Gemini Error:', data.error);
    else console.log('Gemini Models:', data.models.map(m => m.name).filter(n => n.includes('gemini')));
  } catch (e) {
    console.error(e);
  }
}

async function testGroq() {
  console.log('Testing Groq...');
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: 'Bearer ' + process.env.GROQ_API_KEY }
    });
    const data = await res.json();
    if (data.error) console.error('Groq Error:', data.error);
    else console.log('Groq Models:', data.data.map(m => m.id));
  } catch (e) {
    console.error(e);
  }
}

await testGemini();
await testGroq();

const https = require('https');

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDsiiPdtAn7VQ56WOgNYvRDA7h0OoApgrU';

async function testGemini(modelName) {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    responseMimeType: 'text/plain',
  };

  const payload = {
    generationConfig,
    contents: [
      {
        parts: [
          { text: 'Explain how AI works in a few words' },
        ],
      },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  console.log(`\nTesting model: ${modelName}`);
  console.log(`URL: ${url.replace(apiKey, 'API_KEY')}`);

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            const content = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`✅ SUCCESS! Model: ${modelName}`);
            console.log(`Response: ${content}`);
            resolve({ model: modelName, success: true, content });
          } else {
            console.log(`❌ FAILED! Status: ${res.statusCode}`);
            console.log(`Error: ${JSON.stringify(jsonData, null, 2)}`);
            resolve({ model: modelName, success: false, error: jsonData });
          }
        } catch (e) {
          console.log(`❌ Parse error:`, e.message);
          console.log(`Raw response:`, data);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Request error:`, error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('API Key:', apiKey.substring(0, 10) + '...');
  console.log('\n=== Testing Gemini Models ===\n');

  const modelsToTest = [
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
  ];

  for (const model of modelsToTest) {
    try {
      await testGemini(model);
    } catch (error) {
      console.log(`Error testing ${model}:`, error.message);
    }
    console.log('\n' + '-'.repeat(60));
  }
}

main().catch(console.error);

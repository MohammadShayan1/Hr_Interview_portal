const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDsiiCNJsWz6VUPxQe1LW43PKaQcB9FbcU';
  
  if (!apiKey) {
    console.error('No API key found!');
    return;
  }
  
  console.log('API Key:', apiKey.substring(0, 10) + '...');
  console.log('\nFetching available models...\n');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Try to list models
    const models = await genAI.listModels();
    
    console.log('Available models:');
    for await (const model of models) {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('');
    }
  } catch (error) {
    console.error('Error listing models:', error.message);
    
    // Try alternative: test common model names
    console.log('\nTrying common model names...\n');
    
    const modelsToTest = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash',
    ];
    
    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} - WORKS!`);
      } catch (err) {
        console.log(`❌ ${modelName} - ${err.message.split('\n')[0]}`);
      }
    }
  }
}

listModels();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  // テスト用の簡単なDALL-E呼び出し
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ 
        success: false,
        error: 'OpenAI API key not configured',
        message: 'Please set OPENAI_API_KEY environment variable'
      });
    }

    const testPrompt = "Create a simple low-poly 3D character illustration of a friendly person in modern clothing, geometric style, vibrant colors, 1:1 square format";
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: testPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(200).json({ 
        success: false,
        error: `DALL-E API error: ${response.status}`,
        details: errorData
      });
    }

    const data = await response.json();
    
    return res.status(200).json({ 
      success: true,
      message: 'DALL-E 3 is working!',
      imageUrl: data.data?.[0]?.url || '',
      prompt: testPrompt
    });

  } catch (error) {
    return res.status(200).json({ 
      success: false,
      error: error.message
    });
  }
}
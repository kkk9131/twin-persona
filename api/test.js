module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  return res.status(200).json({ 
    message: 'API is working',
    env: process.env.GEMINI_API_KEY ? 'API key is set' : 'API key is NOT set',
    method: req.method,
    body: req.body
  });
};
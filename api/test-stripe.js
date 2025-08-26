import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'No API key found',
        env: process.env.NODE_ENV
      });
    }

    console.log('API Key found:', apiKey ? `${apiKey.substring(0, 12)}...` : 'undefined');
    
    const stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      timeout: 10000,
      maxNetworkRetries: 2
    });

    // 簡単なAPI呼び出しでテスト
    const account = await stripe.accounts.retrieve();
    
    return res.status(200).json({
      success: true,
      accountId: account.id,
      livemode: account.details_submitted,
      keyType: apiKey.startsWith('sk_test_') ? 'test' : 'live',
      message: 'Stripe connection successful'
    });
    
  } catch (error) {
    console.error('Stripe test error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.type,
      message: error.message,
      code: error.code
    });
  }
}
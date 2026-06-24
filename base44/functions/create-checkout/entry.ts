import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const origin = req.headers.get('Origin') || req.headers.get('origin') || '';
    if (!origin) {
      return Response.json({ error: 'Missing Origin header' }, { status: 400 });
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const apiKey = Deno.env.get('WIX_PAYMENTS_API_KEY');
    const siteId = Deno.env.get('WIX_PAYMENTS_SITE_ID');

    if (!apiKey || !siteId) {
      console.error('Missing WIX_PAYMENTS_API_KEY or WIX_PAYMENTS_SITE_ID');
      return Response.json({ error: 'Payment configuration missing' }, { status: 500 });
    }

    const requestBody = {
      cart: {
        items: [
          {
            name: 'Tip the Developer — 1984: The Baseball Season',
            quantity: 1,
            price: parseFloat(amount).toFixed(2),
          },
        ],
      },
      returnUrls: {
        successUrl: `${origin}/ThankYou`,
        cancelUrl: origin,
      },
    };

    console.log('Creating checkout with:', { amount, origin });
    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch(
      'https://www.wixapis.com/v1/payments/checkout-sessions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'wix-site-id': siteId,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    console.log('Wix response status:', response.status);
    console.log('Wix response:', JSON.stringify(data));

    if (!response.ok) {
      console.error('Wix checkout error:', { status: response.status, error: data });
      return Response.json({ error: data?.message || data?.errorDescription || 'Checkout creation failed' }, { status: response.status });
    }

    return Response.json({ redirectUrl: data.checkoutSession.redirectUrl });
  } catch (error) {
    console.error('create-checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    // Try to get origin from headers, or construct from request URL
    let origin = req.headers.get('Origin') || req.headers.get('origin') || '';
    if (!origin) {
      // Fallback: construct origin from request URL
      try {
        const url = new URL(req.url);
        origin = `${url.protocol}//${url.host}`;
      } catch {
        origin = 'http://localhost:3000';
      }
    }
    console.log('Using origin:', origin);

    const body = await req.json();
    const { amount } = body;
    console.log('Received body:', JSON.stringify(body), 'amount:', amount, 'type:', typeof amount);

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      console.error('Amount validation failed:', { amount, parsed: parseFloat(amount), isNaN: isNaN(parseFloat(amount)) });
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
      callbackUrls: {
        postFlowUrl: origin,
        thankYouPageUrl: `${origin}/ThankYou`,
      },
    };

    console.log('Creating checkout with:', { amount, origin });
    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch(
      'https://www.wixapis.com/payments/platform/v1/checkout-sessions/construct',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
          'wix-site-id': siteId,
        },
        body: JSON.stringify(requestBody),
      }
    );

    let data;
    let responseText = '';
    try {
      responseText = await response.text();
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse Wix response. Status:', response.status, 'Raw text:', responseText, 'Error:', jsonError.message);
      return Response.json({ error: 'Invalid response from payment provider' }, { status: 500 });
    }

    console.log('Wix response status:', response.status);
    console.log('Wix response:', JSON.stringify(data));

    if (!response.ok) {
      console.error('Wix checkout error:', { status: response.status, error: data });
      const errorMsg = data?.message || data?.details?.applicationError?.description || data?.errorDescription || 'Checkout creation failed';
      return Response.json({ error: errorMsg }, { status: response.status });
    }

    const redirectUrl = data?.checkoutSession?.redirectUrl;
    if (!redirectUrl) {
      console.error('No redirect URL in Wix response:', JSON.stringify(data));
      return Response.json({ error: 'No checkout URL received from payment provider' }, { status: 500 });
    }

    console.log('Checkout session created successfully:', redirectUrl);
    return Response.json({ redirectUrl });
  } catch (error) {
    console.error('create-checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
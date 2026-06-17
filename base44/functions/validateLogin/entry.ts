import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const { username, password } = await req.json();
    const validUser = Deno.env.get("GAME_USERNAME");
    const validPass = Deno.env.get("GAME_PASSWORD");

    if (!validUser || !validPass) {
      return Response.json({ success: false, error: 'Login not configured' }, { status: 500 });
    }

    if (username === validUser && password === validPass) {
      return Response.json({ success: true });
    }

    return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return Response.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
});
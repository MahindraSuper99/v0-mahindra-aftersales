import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Only intercept requests going to our secret internal bridge
  if (request.nextUrl.pathname === '/api/survey') {
    
    // Hardcode your unique Pabbly Webhook URL right here in the cloud script
    const pabblyWebhookUrl = "https://connect.pabbly.com/webhook-listener/webhook/IjU3NmQwNTZhMDYzMDA0MzQ1MjZiIg_3D_3D_pc/IjU3NjcwNTZlMDYzZjA0MzE1MjZhNTUzMDUxM2Ii_pc";

    try {
      // Clone the incoming data block payload from your form
      const data = await request.json();

      // Safely push it over to your Pabbly workflow stream
      await fetch(pabblyWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to route data' }, { status: 500 });
    }
  }

  return NextResponse.next();
}

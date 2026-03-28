import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Look up Stripe customer ID from user profile in database
    const mockStripeCustomerId = `cus_mock_${user.id.slice(0, 8)}`;

    const _stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!_stripeSecretKey) {
      console.error('Missing STRIPE_SECRET_KEY environment variable');
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }

    // TODO: Replace with real Stripe API call
    // const stripe = new Stripe(_stripeSecretKey);
    // const portalSession = await stripe.billingPortal.sessions.create({
    //   customer: mockStripeCustomerId,
    //   return_url: `${request.nextUrl.origin}/settings`,
    // });

    // Mock portal session
    const mockPortalSession = {
      id: `bps_mock_${crypto.randomUUID()}`,
      url: `https://billing.stripe.com/p/session/mock_${mockStripeCustomerId}`,
    };

    return NextResponse.json({
      portal_url: mockPortalSession.url,
    });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

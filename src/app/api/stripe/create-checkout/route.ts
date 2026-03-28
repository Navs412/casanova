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

    const body = await request.json();
    const { tier } = body as { tier: 'pro' | 'annual' };

    if (!tier || !['pro', 'annual'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "pro" or "annual".' },
        { status: 400 }
      );
    }

    // Resolve price ID from environment
    const priceId =
      tier === 'pro'
        ? process.env.STRIPE_PRO_PRICE_ID
        : process.env.STRIPE_ANNUAL_PRICE_ID;

    if (!priceId) {
      console.error(`Missing Stripe price ID for tier: ${tier}`);
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }

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
    // const checkoutSession = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   customer_email: user.email,
    //   metadata: { user_id: user.id, tier },
    //   success_url: `${request.nextUrl.origin}/settings?checkout=success`,
    //   cancel_url: `${request.nextUrl.origin}/settings?checkout=cancelled`,
    // });

    // Mock checkout session
    const mockCheckoutSession = {
      id: `cs_mock_${crypto.randomUUID()}`,
      url: `https://checkout.stripe.com/c/pay/mock_${tier}_${Date.now()}`,
    };

    return NextResponse.json({
      checkout_url: mockCheckoutSession.url,
    });
  } catch (error) {
    console.error('Stripe create-checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

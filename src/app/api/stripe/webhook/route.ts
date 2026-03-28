import { NextRequest, NextResponse } from 'next/server';

// Stripe webhook events we handle
type StripeEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted';

interface StripeEvent {
  id: string;
  type: StripeEventType;
  data: {
    object: Record<string, unknown>;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Read raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const _webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // TODO: Verify real Stripe webhook signature
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // let event: Stripe.Event;
    // try {
    //   event = stripe.webhooks.constructEvent(rawBody, signature, _webhookSecret!);
    // } catch (err) {
    //   console.error('Webhook signature verification failed:', err);
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }

    // Mock: parse the raw body as JSON directly (skip signature verification)
    let event: StripeEvent;
    try {
      event = JSON.parse(rawBody) as StripeEvent;
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata
          ? (session.metadata as Record<string, string>).user_id
          : null;
        const tier = session.metadata
          ? (session.metadata as Record<string, string>).tier
          : null;

        if (userId && tier) {
          // TODO: Update user profile subscription_tier in database
          console.log(
            `[Webhook] Checkout completed: user=${userId}, tier=${tier}`
          );

          // Mock: update profile subscription tier
          const _updatedProfile = {
            user_id: userId,
            subscription_tier: tier,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            updated_at: new Date().toISOString(),
          };
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = subscription.status as string;
        const customerId = subscription.customer as string;

        // TODO: Look up user by stripe_customer_id and update subscription status
        console.log(
          `[Webhook] Subscription updated: customer=${customerId}, status=${status}`
        );

        // Map Stripe status to app tier
        let subscriptionTier = 'free';
        if (status === 'active' || status === 'trialing') {
          subscriptionTier = 'pro';
        }

        // Mock: update profile
        const _updatedProfile = {
          stripe_customer_id: customerId,
          subscription_tier: subscriptionTier,
          updated_at: new Date().toISOString(),
        };
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        // TODO: Look up user by stripe_customer_id and downgrade to free
        console.log(
          `[Webhook] Subscription deleted: customer=${customerId}`
        );

        // Mock: downgrade profile to free
        const _updatedProfile = {
          stripe_customer_id: customerId,
          subscription_tier: 'free',
          updated_at: new Date().toISOString(),
        };
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

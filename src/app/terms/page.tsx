import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — Casanova',
  description: 'Terms and conditions for using Casanova.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-casanova-bg text-casanova-text">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-casanova-accent font-bold text-xl block mb-12">Casanova</Link>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-casanova-muted text-sm mb-10">Last updated: March 2026 · Version 1.0 (Beta)</p>

        <div className="space-y-8 text-casanova-muted leading-relaxed">

          <div className="bg-casanova-surface border border-casanova-accent/20 rounded-xl p-5 text-sm">
            <p className="text-casanova-text font-medium mb-1">Plain English Summary</p>
            <p>Casanova is a coaching tool, not a therapist or doctor. Use it responsibly. Don't misuse it to harm or manipulate others. You own your data. We can suspend accounts that violate these terms.</p>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">1. What Casanova Is</h2>
            <p>Casanova is an AI-powered communication skills coaching service. It is designed to help you develop interpersonal communication skills through practice, reflection, and coaching.</p>
            <p className="mt-3 text-casanova-text/80">Casanova is <strong className="text-casanova-text">not</strong> a mental health service, therapy, counseling, or medical advice. It is not a substitute for professional psychological treatment. If you are experiencing a mental health crisis, please contact a qualified professional or a crisis service in your country.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">2. Eligibility</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>You must be at least 16 years old to use Casanova.</li>
              <li>You must provide accurate information when creating your account.</li>
              <li>One account per person. Shared accounts are not permitted.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">3. Acceptable Use</h2>
            <p className="mb-3">You agree to use Casanova only for lawful purposes and in ways that do not harm others. You must not use Casanova to:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Manipulate, coerce, or psychologically harm another person.</li>
              <li>Harass, stalk, or intimidate anyone.</li>
              <li>Generate content that is discriminatory, hateful, or abusive.</li>
              <li>Attempt to extract personal data about other users.</li>
              <li>Circumvent rate limits, access controls, or subscription restrictions.</li>
              <li>Use the service in ways that violate any applicable law or regulation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">4. Subscriptions and Billing</h2>
            <ul className="space-y-2 list-none pl-0">
              {[
                ['Free tier', '3 sessions per month at no charge. No credit card required.'],
                ['Pro tier', '$9.99/month or $79.99/year, billed in advance. Includes a 7-day free trial for new subscribers.'],
                ['Cancellation', 'You may cancel at any time from your profile. Your access continues until the end of the current billing period. No refunds for partial periods.'],
                ['Price changes', 'We will give you at least 30 days notice before changing subscription prices.'],
              ].map(([title, desc]) => (
                <li key={title} className="border-l-2 border-casanova-border pl-4">
                  <span className="text-casanova-text font-medium">{title}:</span> {desc}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">5. Your Content</h2>
            <p>You own the content you create in Casanova. By using the service, you grant us a limited license to process your content solely for the purpose of providing coaching responses. We do not use your personal conversations to train AI models.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">6. Limitation of Liability</h2>
            <p>Casanova is provided "as is." We do not guarantee that the coaching advice will produce specific outcomes in your conversations or relationships. Communication is complex — results depend on many factors outside our control.</p>
            <p className="mt-3">To the maximum extent permitted by law, our liability to you for any claim arising from use of Casanova is limited to the amount you paid us in the 3 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">7. Account Termination</h2>
            <p>We may suspend or terminate accounts that violate these terms, with or without notice depending on the severity of the violation. You may delete your account at any time from your profile page.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">8. Governing Law</h2>
            <p>These terms are governed by the laws of Singapore. Any disputes will be resolved in the courts of Singapore.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">9. Beta Notice</h2>
            <p>Casanova is currently in beta. Features may change, and occasional downtime may occur. We appreciate your patience and feedback during this period.</p>
          </section>

          <div className="border-t border-casanova-border pt-6 text-sm">
            <p>Questions? Contact us at <a href="mailto:hello@heycasanova.com" className="text-casanova-accent hover:underline">hello@heycasanova.com</a></p>
            <p className="mt-2"><Link href="/privacy" className="text-casanova-accent hover:underline">Privacy Policy</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

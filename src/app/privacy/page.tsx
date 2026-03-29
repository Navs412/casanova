import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Casanova',
  description: 'How Casanova collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-casanova-bg text-casanova-text">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-casanova-accent font-bold text-xl block mb-12">Casanova</Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-casanova-muted text-sm mb-10">Last updated: March 2026 · Version 1.0 (Beta)</p>

        <div className="prose prose-invert max-w-none space-y-8 text-casanova-muted leading-relaxed">

          <div className="bg-casanova-surface border border-casanova-accent/20 rounded-xl p-5 text-sm">
            <p className="text-casanova-text font-medium mb-1">Plain English Summary</p>
            <p>We collect only what we need to coach you. We don't sell your data. Conversation content used to coach you about other people is treated with strict confidentiality and deleted when you end a session. You can delete all your data at any time.</p>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">1. Who We Are</h2>
            <p>Casanova is an AI communication skills coaching service operated by [Company Name], based in Singapore. Contact us at privacy@heycasanova.com with any questions about this policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">2. What We Collect</h2>
            <ul className="space-y-2 list-none pl-0">
              {[
                ['Account data', 'Your email address and encrypted password, required to create and access your account.'],
                ['Profile data', 'Your communication archetype, the Seven Arts you have practiced, and your session count. This is the coaching profile Casanova builds over time.'],
                ['Session content', 'The messages you send to Casanova during coaching sessions. This content is used solely to provide coaching responses.'],
                ['Ephemeral content', 'Messages you share about other people (what they said, their behavior) are marked ephemeral and deleted when you close the session. We do not retain information about third parties.'],
                ['Usage data', 'Basic logs including session timestamps and feature usage. No detailed behavioral tracking.'],
              ].map(([title, desc]) => (
                <li key={title} className="border-l-2 border-casanova-border pl-4">
                  <span className="text-casanova-text font-medium">{title}:</span> {desc}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">3. What We Do Not Collect</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>We do not collect audio or video recordings of any kind.</li>
              <li>We do not track your location.</li>
              <li>We do not access your contacts, calendar, or any other app on your device.</li>
              <li>We do not sell, rent, or share your personal data with third parties for marketing purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">4. How We Use Your Data</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>To provide AI coaching responses personalized to your archetype and history.</li>
              <li>To maintain your coaching profile across sessions.</li>
              <li>To process subscription payments via Stripe (we never see your card details).</li>
              <li>To send transactional emails (account confirmation, password reset). We do not send marketing emails without your explicit consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">5. AI and Third-Party Services</h2>
            <p className="mb-3">Casanova uses the following third-party services to operate:</p>
            <ul className="space-y-2 list-none pl-0">
              {[
                ['Anthropic', 'Powers the AI coaching responses. Your messages are processed by Anthropic\'s API under their privacy policy. We do not share your name or account details with Anthropic — only the conversation content required to generate a response.'],
                ['Supabase', 'Hosts our database and authentication. Your data is stored in Supabase\'s secure, encrypted infrastructure.'],
                ['Vercel', 'Hosts the application. Standard server access logs may be retained for up to 30 days.'],
                ['Stripe', 'Processes subscription payments. We never see or store your card details.'],
              ].map(([name, desc]) => (
                <li key={name} className="border-l-2 border-casanova-border pl-4">
                  <span className="text-casanova-text font-medium">{name}:</span> {desc}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">6. Data Retention</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>Your account and coaching profile are retained as long as your account is active.</li>
              <li>Session messages are retained to provide ongoing coaching context. You can delete individual sessions from your profile.</li>
              <li>Ephemeral messages (content about other people) are deleted automatically when you close a session.</li>
              <li>If you delete your account, all your data is permanently deleted within 30 days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">7. Your Rights</h2>
            <p className="mb-3">Regardless of where you are based, you have the right to:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li><strong className="text-casanova-text">Access</strong> — request a copy of all data we hold about you.</li>
              <li><strong className="text-casanova-text">Correction</strong> — request correction of inaccurate data.</li>
              <li><strong className="text-casanova-text">Deletion</strong> — request deletion of your account and all associated data. Available directly from your profile page.</li>
              <li><strong className="text-casanova-text">Portability</strong> — request your data in a machine-readable format.</li>
              <li><strong className="text-casanova-text">Objection</strong> — object to processing of your data for any purpose.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at privacy@heycasanova.com. We respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">8. Security</h2>
            <p>We use industry-standard security measures including encrypted data storage, HTTPS for all connections, and strict access controls. No system is 100% secure — if you discover a vulnerability, please report it responsibly to security@heycasanova.com.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">9. Children</h2>
            <p>Casanova is designed for users aged 16 and older. We do not knowingly collect data from children under 16. If you believe a child has created an account, contact us at privacy@heycasanova.com and we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-casanova-text mb-3">10. Changes to This Policy</h2>
            <p>We will notify you of material changes to this policy via email or an in-app notice at least 14 days before they take effect. Continued use of Casanova after that date constitutes acceptance of the updated policy.</p>
          </section>

          <div className="border-t border-casanova-border pt-6 text-sm">
            <p>Questions? Contact us at <a href="mailto:privacy@heycasanova.com" className="text-casanova-accent hover:underline">privacy@heycasanova.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

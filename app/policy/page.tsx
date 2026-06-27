import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#080d0e] px-6 py-28 text-white md:px-20">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
        <Link href="/" className="text-sm font-medium text-yellow-400">
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-white/50">Last Updated: June 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-white/70">
          <p>
            At <strong className="text-white">MECO (Mechanic. Connect. Deliver.)</strong>,
            we value your privacy and are committed to protecting the personal
            information you share with us.
          </p>

          <PolicySection title="1. Information We Collect">
            <ul className="list-disc space-y-2 pl-5">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Vehicle details</li>
              <li>Service booking details</li>
              <li>Service location and address</li>
              <li>Payment references and transaction details</li>
              <li>Mechanic profile information</li>
              <li>Account activity and usage data</li>
            </ul>
          </PolicySection>

          <PolicySection title="2. How We Use Your Information">
            <ul className="list-disc space-y-2 pl-5">
              <li>Create and manage your account.</li>
              <li>Process service bookings and secure payments.</li>
              <li>Match customers with qualified mechanics.</li>
              <li>Assign mechanics to service requests.</li>
              <li>Send booking confirmations and service updates.</li>
              <li>Improve platform performance and customer experience.</li>
              <li>Prevent fraud and unauthorized activities.</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. Data Security">
            <p>
              We implement reasonable security measures to protect your personal
              information from unauthorized access, disclosure, alteration, or
              destruction.
            </p>
          </PolicySection>

          <PolicySection title="4. Information Sharing">
            <p>MECO does not sell or rent your personal information.</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Approved mechanics assigned to your booking.</li>
              <li>Trusted payment providers for payment processing.</li>
              <li>Service providers that help operate our platform.</li>
              <li>Authorities when required by law.</li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Payments">
            <p>
              Payments are processed securely by trusted third-party payment
              providers. MECO does not store complete debit or credit card
              details on its servers.
            </p>
          </PolicySection>

          <PolicySection title="6. Cookies and Analytics">
            <p>
              MECO may use cookies and analytics tools to improve performance,
              remember preferences, and understand platform usage.
            </p>
          </PolicySection>

          <PolicySection title="7. Your Rights">
            <ul className="list-disc space-y-2 pl-5">
              <li>Access your personal information.</li>
              <li>Update or correct inaccurate information.</li>
              <li>Request account deletion.</li>
              <li>Withdraw consent where applicable.</li>
            </ul>
          </PolicySection>

          <PolicySection title="8. Data Retention">
            <p>
              We retain your information only for as long as necessary to provide
              services, meet legal requirements, resolve disputes, and maintain
              business records.
            </p>
          </PolicySection>

          <PolicySection title="9. Updates">
            <p>
              We may update this Privacy Policy from time to time. Continued use
              of MECO after updates means you accept the revised policy.
            </p>
          </PolicySection>

          <PolicySection title="10. Contact Us">
            <p>
              For privacy-related questions, contact MECO support through the
              contact information provided on the platform.
            </p>
          </PolicySection>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}
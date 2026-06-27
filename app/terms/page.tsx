import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#080d0e] px-6 py-28 text-white md:px-20">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
        <Link href="/" className="text-sm font-medium text-yellow-400">
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl font-bold">Terms & Conditions</h1>

        <p className="mt-2 text-sm text-white/50">
          Last Updated: June 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-white/70">
          <p>
            Welcome to <strong className="text-white">MECO (Mechanic. Connect.
            Deliver.)</strong>. By accessing or using our platform, you agree to
            be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <Section title="1. Acceptance of Terms">
            By creating an account or using MECO, you agree to comply with these
            Terms and all applicable laws and regulations.
          </Section>

          <Section title="2. Our Services">
            MECO connects customers with qualified mechanics for vehicle
            maintenance, diagnostics, repairs, and other automotive services.
            Service availability may vary depending on location.
          </Section>

          <Section title="3. User Responsibilities">
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide accurate account information.</li>
              <li>Keep your login credentials secure.</li>
              <li>Provide correct booking and vehicle details.</li>
              <li>Use the platform only for lawful purposes.</li>
            </ul>
          </Section>

          <Section title="4. Mechanic Responsibilities">
            Approved mechanics must provide professional services, maintain
            accurate profile information, and perform assigned jobs with care and
            integrity.
          </Section>

          <Section title="5. Payments">
            Customers are required to complete payment before services are
            confirmed. All payments are securely processed through approved
            payment providers.
          </Section>

          <Section title="6. Cancellations">
            Cancellation requests may be subject to applicable fees depending on
            the stage of the booking process.
          </Section>

          <Section title="7. Limitation of Liability">
            While MECO carefully reviews mechanics before approval, MECO acts as
            a platform connecting customers and service providers and is not
            responsible for damages resulting from services performed by
            independent mechanics.
          </Section>

          <Section title="8. Account Suspension">
            We reserve the right to suspend or permanently terminate accounts
            involved in fraudulent activities, abuse, or violations of these
            Terms.
          </Section>

          <Section title="9. Changes to Terms">
            These Terms may be updated from time to time. Continued use of MECO
            constitutes acceptance of any revised Terms.
          </Section>

          <Section title="10. Contact Us">
            For questions regarding these Terms, please contact MECO through our
            official support channels.
          </Section>
        </div>
      </section>
    </main>
  );
}

function Section({
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
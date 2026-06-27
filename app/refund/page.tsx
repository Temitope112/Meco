import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#080d0e] px-6 py-28 text-white md:px-20">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
        <Link href="/" className="text-sm font-medium text-yellow-400">
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl font-bold">Refund Policy</h1>

        <p className="mt-2 text-sm text-white/50">
          Last Updated: June 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-white/70">
          <p>
            At <strong className="text-white">MECO</strong>, customer
            satisfaction is important to us. This Refund Policy explains when a
            refund may be issued for bookings made through our platform.
          </p>

          <Section title="1. Eligible Refunds">
            Refunds may be considered if:
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>The booking was cancelled before a mechanic was assigned.</li>
              <li>Payment was made successfully but the booking failed.</li>
              <li>A duplicate payment was made.</li>
              <li>A technical error resulted in an incorrect charge.</li>
            </ul>
          </Section>

          <Section title="2. Non-Refundable Situations">
            Refunds are generally not available if:
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>The mechanic has already started the service.</li>
              <li>The customer provides incorrect booking information.</li>
              <li>The customer fails to be available at the scheduled location.</li>
              <li>The issue is outside MECO's control.</li>
            </ul>
          </Section>

          <Section title="3. Processing Time">
            Approved refunds are usually processed within 5–10 business days,
            depending on your payment provider or financial institution.
          </Section>

          <Section title="4. Cancellation Requests">
            Customers are encouraged to cancel bookings as early as possible.
            Late cancellations may incur administrative charges.
          </Section>

          <Section title="5. Refund Method">
            Where applicable, refunds will be issued using the original payment
            method used during checkout.
          </Section>

          <Section title="6. Contact Support">
            If you believe you qualify for a refund, please contact MECO support
            with your booking reference and payment details for review.
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
import Link from "next/link";
import { Mail, Phone, HelpCircle } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-[#080d0e] px-6 py-28 text-white md:px-20">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
        <Link href="/" className="text-sm font-medium text-yellow-400">
          ← Back to Home
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <HelpCircle className="text-yellow-400" size={32} />
          <h1 className="text-4xl font-bold">Help Center</h1>
        </div>

        <p className="mt-4 text-white/60">
          Need help using MECO? Find answers to common questions or contact our
          support team.
        </p>

        <div className="mt-10 space-y-6">
          <FAQ
            question="How do I book a service?"
            answer="Browse available services, choose the service you need, fill in your vehicle details and address, then complete your payment."
          />

          <FAQ
            question="How do I track my booking?"
            answer="After logging in, go to your dashboard and open My Bookings to view your booking status, payment status, and assigned mechanic."
          />

          <FAQ
            question="Can I cancel a pending booking?"
            answer="Yes. If your booking is still unpaid or pending, you can delete it from your dashboard before completing payment."
          />

          <FAQ
            question="How are mechanics assigned?"
            answer="Once your booking is confirmed, MECO admin assigns a verified mechanic based on service type, availability, and location."
          />

          <FAQ
            question="Is my payment secure?"
            answer="Yes. Payments are processed securely through trusted third-party payment providers. MECO does not store your complete card details."
          />

          <FAQ
            question="How can mechanics join MECO?"
            answer="Mechanics can create an account by selecting Mechanic during signup, submitting their details, and waiting for admin approval."
          />
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-black/30 p-6">
          <h2 className="text-2xl font-bold">Still need help?</h2>

          <p className="mt-3 text-white/60">
            Contact MECO support and we’ll get back to you as soon as possible.
          </p>

          <div className="mt-6 space-y-4 text-sm text-white/70">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-yellow-400" />
              <span>+2348057977603</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-yellow-400" />
              <span>support@meco.com</span>
            </div>
          </div>

          <Link
            href="/contact-us"
            className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-bold text-white">{question}</h2>
      <p className="mt-3 text-sm leading-6 text-white/60">{answer}</p>
    </div>
  );
}
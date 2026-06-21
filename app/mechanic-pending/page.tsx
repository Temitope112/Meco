import Link from "next/link";

export default function MechanicPendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050708] px-6 text-white">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-3xl font-bold text-yellow-400">Application Submitted</h1>
        <p className="mt-4 text-white/60">
          Your mechanic account has been submitted. MECO admin will review your application before assigning jobs.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black cursor-pointer"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}
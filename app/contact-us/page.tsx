import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import Footer from "@/app/Component/layout/footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f8] text-black">
      <section className="px-4 pb-20 pt-36 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-10 text-4xl font-bold md:text-5xl">
            Contact Us
          </h1>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* LEFT FORM */}
            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Your Email Address
                </label>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Your Message
                </label>
                <textarea
                  placeholder="Your Message"
                  rows={7}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-yellow-400 px-7 py-3 text-sm font-medium text-black transition hover:bg-yellow-300"
              >
                Send Message
              </button>
            </form>

            {/* RIGHT CONTACT INFO */}
            <div className="pt-4">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="mt-1 text-black" size={22} />
                  <div className="text-sm leading-6">
                    <p>CarFix Headquarters</p>
                    <p>123 Auto Drive,</p>
                    <p>Mechanicsville, MD 20659</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="text-black" size={22} />
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="text-black" size={22} />
                  <p className="text-sm">support@carfix.com</p>
                </div>
              </div>

              <div className="relative mt-6 h-[230px] overflow-hidden rounded-2xl border border-gray-200">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126840.5008041812!2d3.276737!3d6.548369!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8f9a0f8f5dcb%3A0x9f8c2f3f6f7a2b1!2sLagos!5e0!3m2!1sen!2sng!4v1710000000000!5m2!1sen!2sng"
    width="100%"
    height="100%"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
    className="border-0"
  ></iframe>
</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
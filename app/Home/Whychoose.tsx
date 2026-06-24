import Image from "next/image";
import { Check } from "lucide-react";

const features = [
  "Verified and experienced mechanics",
  "Transparent pricing with no hidden fees",
  "Convenient booking in just a few taps",
  "Customer support that cares",
];

export default function WhyChoose() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        
        {/* LEFT */}
        <div>
          <h2 className="mb-8 text-3xl font-bold text-black md:text-4xl">
            Why Choose Meco?
          </h2>

          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-600">
                  <Check size={16} />
                </div>

                <p className="text-base text-gray-700">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src="/cta-car.png"
            alt="Mechanic working"
            width={700}
            height={500}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute left-8 top-8 max-w-xs text-white">
            <h3 className="text-3xl font-bold leading-tight">
              Your Car, <br /> Our Priority.
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/80">
              We keep you moving safely and smoothly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Oil Change",
    price: 30000,
    image: "/images/oil-change.jpg",
    description:
      "Keep your engine running smoothly with professional oil and filter replacement using high-quality lubricants.",
    included: [
      "Oil Drain & Replacement",
      "Oil Filter Change",
      "Fluid Level Check",
      "Engine Inspection",
    ],
  },
  {
    id: 2,
    title: "Engine Repair",
    price: 35000,
    image: "/images/engine-repair.jpg",
    description:
      "Our expert technicians use state-of-the-art diagnostic tools to identify and fix engine issues for smooth performance.",
    included: [
      "Computerized Diagnostics",
      "Engine Block Inspection",
      "Cylinder Head Check",
      "Timing Belt/Chain Check",
      "Spark Plug Replacement",
      "Oil & Filter Change",
    ],
  },
  {
    id: 3,
    title: "Brake Service",
    price: 80000,
    image: "/images/brake-service.jpg",
    description:
      "Improve your vehicle safety with complete brake inspection, pad replacement, and brake system servicing.",
    included: [
      "Brake Pad Check",
      "Rotor Inspection",
      "Brake Fluid Check",
      "Caliper Inspection",
    ],
  },
];

const relatedServices = [
  {
    id: 1,
    title: "Oil Change",
    image: "/images/oil-change.jpg",
  },
  {
    id: 3,
    title: "Brake Service",
    image: "/images/brake-service.jpg",
  },
  {
    id: 6,
    title: "Transmission Repair",
    image: "/images/transmission-repair.jpg",
  },
];

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = services.find((item) => item.id === Number(id));

  if (!service) {
    return (
      <main className="min-h-screen px-6 pt-32 text-center">
        <h1 className="text-3xl font-bold">Service not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-20 text-black">
      {/* Hero */}
      <section className="relative h-[360px] overflow-hidden bg-black">
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          className="object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
          <h1 className="text-5xl font-bold text-white">{service.title}</h1>
          <p className="mt-4 max-w-md text-xl text-white">
            Comprehensive diagnostics and expert repair for optimal performance.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-3xl font-bold">Service Description</h2>
          <p className="max-w-lg leading-7">{service.description}</p>
        </div>

        <div>
          <h2 className="mb-4 text-3xl font-bold">What’s Included</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {service.included.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-gray-600">From</p>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-4xl font-bold">
              ₦{service.price.toLocaleString()}
            </h3>

           <Link href={`/booking?serviceId=${service.id}`}>
  <button className="rounded-lg bg-yellow-400 px-8 py-4 font-bold text-black">
    Book Appointment
  </button>
</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#070d0e] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-3xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              "How do I know if my engine needs repair?",
              "How long does engine repair take?",
              "Is there a warranty on engine repairs?",
            ].map((question) => (
              <details
                key={question}
                className="rounded-lg border border-white/20 px-6 py-4"
              >
                <summary className="cursor-pointer font-medium">
                  {question}
                </summary>
                <p className="mt-3 text-sm text-white/60">
                  Our experts will inspect your vehicle and recommend the best
                  repair solution based on the issue.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-3xl font-bold">Related Services</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {relatedServices.map((item) => (
            <Link
              href={`/services/${item.id}`}
              key={item.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative h-40">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 text-sm">Learn More</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
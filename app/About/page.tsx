import Image from "next/image";
import { ShieldCheck, Wrench, Handshake } from "lucide-react";
import Footer from "@/app/Component/layout/footer";

const mechanics = [
  {
    id: 1,
    name: "Sola Adeyemi",
    role: "Brake Specialist",
    image: "/mech-1.jpg",
  },
  {
    id: 2,
    name: "Emeka Okafor",
    role: "Transmission Expert",
    image: "/mech-2.jpg",
  },
  {
    id: 3,
    name: "Funmi Adebayo",
    role: "Engine Specialist",
    image: "/mech-3.jpg",
  },
];

const values = [
  {
    id: 1,
    title: "Quality Workmanship",
    description:
      "Quality workmanship, diagnostics, repair, and maintenance servicing.",
    icon: Wrench,
  },
  {
    id: 2,
    title: "Transparency",
    description:
      "Our quality money and transparency to copors with customers.",
    icon: Handshake,
  },
  {
    id: 3,
    title: "Trust & Reliability",
    description:
      "Our trust & reliability remidies and oversees to ensure communities.",
    icon: ShieldCheck,
  },
];


export default function AboutPage() {
  return (
    <main className="bg-[#f8f8f8] text-black">
      {/* HERO SECTION */}
      <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
        <Image
          src="/about.hero.png"
          alt="About Hero"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                Our <span className="text-orange-500">Story</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/90 md:text-lg">
                MECO is a modern automotive service platform dedicated to connecting vehicle owners with trusted mechanics. We simplify car maintenance and repairs through reliable service, seamless booking, and professional support, ensuring every customer enjoys a stress-free experience.

              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MEET OUR MECHANICS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-14 text-center text-4xl font-bold md:text-5xl">
          Meet Our Mechanics
        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {mechanics.map((mechanic) => (
            <div key={mechanic.id}>
              <div className="relative h-[420px] overflow-hidden rounded-3xl">
                <Image
                  src={mechanic.image}
                  alt={mechanic.name}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="mt-5">
                <h3 className="text-2xl font-semibold">{mechanic.name}</h3>

                <p className="mt-1 text-gray-600">{mechanic.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="mb-14 text-center text-4xl font-bold md:text-5xl">
          Our Values
        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.id}
                className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400">
                  <Icon className="text-black" size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-semibold">
                  {value.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </main>
  );
}
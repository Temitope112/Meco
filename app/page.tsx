import Hero from "./Home/hero";
import Services from "./Home/Services";
import HowItWorks from "./Home/HowItWorks";
import WhyChoose from "./Home/Whychoose";
import Footer from "./Component/layout/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] font-sans text-white">
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <WhyChoose />
      </main>

      {/* POPULAR SERVICES */}
      <section className="bg-[#f5f5f5] px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-black">
              Popular Services
            </h2>

            <button className="text-sm text-gray-500 hover:text-black">
              View all
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Oil Change",
                image: "/oil-change.png",
                price: "₦10,000",
              },
              {
                title: "Battery Replacement",
                image: "/battery.jpg",
                price: "₦25,000",
              },
              {
                title: "AC Repair",
                image: "/Ac-repair.jpg",
                price: "₦30,000",
              },
              {
                title: "Car Diagnostics",
                image: "/Diagnostics.png",
                price: "₦20,000",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-base font-semibold text-black">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    From {service.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#f8f8f8] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">
              What Our Customers Say
            </h2>

            <button className="cursor-pointer text-sm text-gray-500 hover:text-black">
              View all reviews
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Chinedu O.",
                image: "/img (2).jpeg",
                review:
                  "Meco is a lifesaver! Quick service and very reliable mechanics.",
              },
              {
                name: "Adaora M.",
                image: "/img (2).jpeg",
                review:
                  "I love how easy it is to book and how transparent the pricing is.",
              },
              {
                name: "Tunde A.",
                image: "/img (2).jpeg",
                review:
                  "Great experience every time. Highly recommended for car owners!",
              },
            ].map((customer) => (
              <div
                key={customer.name}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={customer.image}
                    alt={customer.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-sm font-bold text-black">
                      {customer.name}
                    </h3>

                    <p className="text-xs text-yellow-500">★★★★★</p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {customer.review}
                </p>

                <p className="mt-4 text-xs text-gray-400">Review</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* READY TO TAKE CARE OF YOUR CAR */}
      <section className="bg-[#f8f8f8] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#05080a]">
          <div className="relative h-[320px] w-full">
            <img
              src="/Car.png"
              alt="Luxury Car"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/60" />

            <div className="absolute left-8 top-8 max-w-md text-white md:left-12 md:top-12">
              <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                Ready to take care <br /> of your car?
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/75">
                Book service now and get back on the road worry-free.
              </p>

              <Link href="/login">
                <button className="mt-8 cursor-pointer rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED PARTNERS */}
      <section className="bg-[#f8f8f8] px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#05080a] px-6 py-12 md:px-10">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-yellow-400">
                Trusted By
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Our Partners & Brands
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/60">
              We collaborate with trusted automotive brands and service
              providers to deliver quality car care solutions.
            </p>
          </div>

          <div className="grid cursor-pointer grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {["Toyota", "Honda", "Mercedes", "BMW", "Ford", "Lexus"].map(
              (brand) => (
                <div
                  key={brand}
                  className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold text-white/80">
                    {brand}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
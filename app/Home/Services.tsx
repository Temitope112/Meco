import Link from "next/link";
import { Car, Cog, Disc3, CircleDot, Wrench } from "lucide-react";

const services = [
  {
    title: "General Service",
    description: "Routine checkups and maintenance",
    price: "₦20,000",
    icon: Wrench,
  },
  {
    title: "Engine Repair",
    description: "Diagnostics and engine repair",
    price: "₦35,000",
    icon: Cog,
  },
  {
    title: "Brake Service",
    description: "Brake inspection and repair",
    price: "₦15,000",
    icon: Disc3,
  },
  {
    title: "Tire Services",
    description: "Tire replacement and balancing",
    price: "₦10,000",
    icon: CircleDot,
  },
  {
    title: "Body Work",
    description: "Dent repair and painting",
    price: "₦50,000",
    icon: Car,
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black md:text-3xl">
            Our Services
          </h2>

          <Link
            href="/services"
            className="text-sm font-medium text-gray-500 hover:text-black"
          >
            View all services
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/20 text-yellow-600">
                  <Icon size={26} />
                </div>

                <h3 className="mb-2 text-base font-bold text-black">
                  {service.title}
                </h3>

                <p className="mb-6 text-sm leading-6 text-gray-500">
                  {service.description}
                </p>

                <p className="text-sm font-semibold text-black">
                  From {service.price}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
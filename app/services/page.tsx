import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/Component/layout/footer";
import { supabase } from "@/lib/supabase";

type Service = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
};

export default async function ServicesPage() {
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f7f7] px-6 pt-28">
        <h1 className="text-2xl font-bold text-red-500">
          Failed to load services
        </h1>
        <p className="mt-2 text-black">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f7] px-6 pt-28 pb-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-black">All Services</h1>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="mb-3 font-bold text-black">Category</h2>

              {["Maintenance", "Repair", "Diagnostics"].map((item) => (
                <label
                  key={item}
                  className="mb-2 flex items-center gap-2 text-sm text-black"
                >
                  <input type="checkbox" className="h-4 w-4" />
                  {item}
                </label>
              ))}
            </div>

            <div className="border-b border-gray-200 p-4">
              <h2 className="mb-3 font-bold text-black">Price Range</h2>

              <input type="range" className="w-full accent-black" />

              <div className="mt-3 flex items-center gap-3">
                <input
                  value="₦0"
                  readOnly
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-black"
                />
                <span className="text-black">to</span>
                <input
                  value="₦500,000"
                  readOnly
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-black"
                />
              </div>
            </div>

            <div className="p-4">
              <h2 className="mb-3 font-bold text-black">Vehicle Type</h2>

              <select className="w-full rounded border border-gray-400 px-3 py-2 text-sm text-black">
                <option>Select Type...</option>
                <option>Sedans</option>
                <option>SUVs</option>
                <option>Trucks</option>
              </select>
            </div>
          </aside>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services && services.length > 0 ? (
              services.map((service: Service) => (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-lg bg-white shadow-md"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={
  service.image_url?.startsWith("/")
    ? service.image_url
    : "/oil-change.png"
}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h2 className="font-bold text-black">{service.title}</h2>

                      <p className="text-sm text-black">
                        from{" "}
                        <span className="text-lg font-bold">
                          ₦{service.price.toLocaleString()}
                        </span>
                      </p>
                    </div>

                    <Link href={`/services/${service.id}`}>
                      <button className="w-full rounded-md bg-[#111719] py-3 text-sm font-medium text-white transition hover:bg-black">
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black">No services available yet.</p>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
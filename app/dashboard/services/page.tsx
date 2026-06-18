"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Minus, ShoppingCart, Trash2, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Service = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
};

type CartItem = Service & {
  quantity: number;
};

export default function DashboardServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setServices(data || []);
      setLoading(false);
    };

    fetchServices();
  }, []);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === service.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const proceedToBooking = () => {
    if (cart.length === 0) {
      alert("Please add at least one service to cart.");
      return;
    }

    localStorage.setItem("meco_cart", JSON.stringify(cart));
    router.push("/booking?cart=true");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const taxesAndFees = cart.length > 0 ? 2000 : 0;
  const total = subtotal + taxesAndFees;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="mt-2 text-white/60">
            View service details or add multiple services to your cart.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <ShoppingCart className="text-yellow-400" size={20} />
          <span className="text-sm text-white/70">
            {cart.length} item{cart.length === 1 ? "" : "s"} in cart
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-white/60">Loading services...</p>
          ) : services.length > 0 ? (
            services.map((service) => {
              const imageSrc =
                service.image_url?.startsWith("http") ||
                service.image_url?.startsWith("/")
                  ? service.image_url
                  : "/oil-change.png";

              return (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={imageSrc}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold">{service.title}</h2>
                        <p className="mt-1 text-xs text-white/50">
                          {service.category}
                        </p>
                      </div>

                      <p className="font-bold text-yellow-400">
                        ₦{service.price.toLocaleString()}
                      </p>
                    </div>

                    <p className="line-clamp-2 text-sm text-white/60">
                      {service.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/services/${service.id}`)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-white/10 py-3 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        <Eye size={16} />
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => addToCart(service)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white/60">No services available yet.</p>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-xl font-bold">Your Cart</h2>

          {cart.length === 0 ? (
            <p className="text-sm text-white/50">
              No services added yet. Add services from the list.
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/services/${item.id}`)}
                        className="text-left"
                      >
                        <h3 className="font-semibold hover:text-yellow-400">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/50">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="rounded-md border border-white/10 p-1"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="text-sm">{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="rounded-md border border-white/10 p-1"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <p className="font-bold text-yellow-400">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="mb-3 flex justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>

                <div className="mb-3 flex justify-between text-sm text-white/60">
                  <span>Taxes & Fees</span>
                  <span>₦{taxesAndFees.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-yellow-400">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>

                <button
                  type="button"
                  onClick={proceedToBooking}
                  className="mt-6 w-full rounded-lg bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300"
                >
                  Proceed to Booking
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
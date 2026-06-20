"use client";

import Footer from "@/app/Component/layout/footer";
import { supabase } from "@/lib/supabase";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  CalendarDays,
} from "lucide-react";

type Service = {
  id: number;
  service_code: string | null;
  title: string;
  price: number;
};

type CartItem = {
  id: number;
  service_code?: string | null;
  title: string;
  price: number;
  quantity: number;
};

const timeSlots = [
  "9:00 AM",
  "1:00 PM",
  "12:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 AM",
  "8:00 AM",
];

function BookingCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("serviceId");
  const isCartBooking = searchParams.get("cart") === "true";

  const [checkingUser, setCheckingUser] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [address, setAddress] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState("9:00 AM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login or create an account before booking a service.");
        router.push("/login");
        return;
      }

      setCustomerEmail(user.email || "");
      setCheckingUser(false);
    };

    checkLoggedInUser();
  }, [router]);

  useEffect(() => {
    const fetchService = async () => {
      if (isCartBooking) return;
      if (!serviceId) return;

      const { data, error } = await supabase
        .from("services")
        .select("id, service_code, title, price")
        .eq("id", Number(serviceId))
        .single();

      if (error) {
        console.log(error);
        return;
      }

      setSelectedService(data);
    };

    fetchService();
  }, [serviceId, isCartBooking]);

  useEffect(() => {
    if (!isCartBooking) return;

    const savedCart = localStorage.getItem("meco_cart");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [isCartBooking]);

  const subtotal = isCartBooking
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : selectedService
    ? selectedService.price
    : 0;

  const taxesAndFees = subtotal > 0 ? 2000 : 0;
  const total = subtotal + taxesAndFees;

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const selectedDateText = selectedDate
    ? selectedDate.toLocaleDateString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No date selected";

  const handleConfirmBooking = async () => {
    if (!isCartBooking && !selectedService) {
      alert("Please select a service first.");
      return;
    }

    if (isCartBooking && cartItems.length === 0) {
      alert("Your cart is empty. Please add services first.");
      router.push("/dashboard/services");
      return;
    }

    if (!customerName || !customerEmail || !yearInput || !vehicleModel || !address) {
      alert("Please fill in all vehicle details, email and address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const serviceTitle = isCartBooking
        ? cartItems
            .map((item) =>
              item.service_code
                ? `${item.service_code} - ${item.title} x${item.quantity}`
                : `${item.title} x${item.quantity}`
            )
            .join(", ")
        : selectedService?.service_code
        ? `${selectedService.service_code} - ${selectedService.title}`
        : selectedService?.title;

      const serviceIdValue = isCartBooking ? null : selectedService?.id;
      const servicePriceValue = subtotal;

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
          service_id: serviceIdValue,
          service_title: serviceTitle,
          service_price: servicePriceValue,
          customer_name: customerName,
          customer_email: customerEmail,
          vehicle_year: yearInput,
          vehicle_model: vehicleModel,
          address,
          booking_date: selectedDateText,
          booking_time: selectedTime,
          subtotal,
          taxes_and_fees: taxesAndFees,
          total,
          status: "pending",
          payment_status: "unpaid",
        })
        .select()
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      const paymentRes = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: total,
          bookingId: booking.id,
          customerName,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        alert(paymentData.message || "Unable to start payment.");
        return;
      }

      if (isCartBooking) {
        localStorage.removeItem("meco_cart");
      }

      window.location.href = paymentData.paymentLink;
    } catch (error) {
      console.log(error);
      alert("Unable to process booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d0e] text-white">
        <p>Checking login status...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d0e] px-6 pt-28 pb-10 text-white md:px-20">
      <section className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-4xl font-bold md:text-5xl">
          <span className="text-yellow-400">Booking</span> Checkout
        </h1>

        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-10">
              <div className="mb-2 flex justify-between border-b border-white/15 pb-3">
                <h2 className="text-xl font-semibold">
                  Your Selected Service
                </h2>
              </div>

              {isCartBooking ? (
                cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between border-b border-white/15 py-4 text-lg"
                    >
                      <div>
                        <span>
                          {item.title} x {item.quantity}
                        </span>

                        {item.service_code && (
                          <p className="text-sm text-yellow-400">
                            {item.service_code}
                          </p>
                        )}
                      </div>

                      <span>
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-white/60">No service in cart</p>
                )
              ) : selectedService ? (
                <div className="flex justify-between border-b border-white/15 py-4 text-lg">
                  <div>
                    <span>{selectedService.title}</span>

                    {selectedService.service_code && (
                      <p className="text-sm text-yellow-400">
                        {selectedService.service_code}
                      </p>
                    )}
                  </div>

                  <span>₦{selectedService.price.toLocaleString()}</span>
                </div>
              ) : (
                <p className="py-4 text-white/60">No service selected</p>
              )}
            </div>

            <h2 className="mb-5 text-2xl font-semibold">
              Schedule Your Appointment
            </h2>

            <div className="flex flex-col gap-8 md:flex-row">
              <div className="w-full rounded-xl border border-white/15 bg-white/5 p-4 md:w-[280px]">
                <div className="mb-5 flex items-center justify-between">
                  <button onClick={previousMonth}>
                    <ChevronLeft size={18} />
                  </button>

                  <h3 className="font-medium">
                    {monthName} {year}
                  </h3>

                  <button onClick={nextMonth}>
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="mb-3 grid cursor-default grid-cols-7 text-center text-sm text-white/50">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {calendarDays.map((day, index) => {
                    if (!day) return <div key={index} className="h-8 w-8" />;

                    const isSelected =
                      selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === month &&
                      selectedDate?.getFullYear() === year;

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(day)}
                        className={`mx-auto h-8 w-8 rounded-full transition ${
                          isSelected
                            ? "bg-yellow-400 font-bold text-black"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg">Time/slot</h3>

                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg border px-4 py-2 text-sm transition ${
                        selectedTime === time
                          ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                          : "border-white/15 bg-white/5 hover:border-yellow-400"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 mb-6">
              <h2 className="mb-5 text-2xl font-semibold">Vehicle Details</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  placeholder="Year"
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none"
                />

                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none"
                />

                <input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none"
                />

                <input
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Your Model"
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none"
                />

                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your address"
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 outline-none md:col-span-2"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="ml-auto max-w-md overflow-hidden rounded-xl border border-white/15 bg-white/5">
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">
                  Payment Summary
                </h2>

                <div className="space-y-4 border-b border-white/15 pb-5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>₦{taxesAndFees.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-5 text-xl font-bold text-yellow-400">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                  <CalendarDays size={16} />
                  {selectedDateText} at {selectedTime}
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={subtotal === 0 || isSubmitting}
                className="flex w-full items-center justify-center gap-2 bg-yellow-400 py-5 text-lg font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Pay Now"}
                <CheckCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function BookingCheckout() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#080d0e]" />}>
      <BookingCheckoutContent />
    </Suspense>
  );
}
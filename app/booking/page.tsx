"use client";

import Footer from "@/app/Component/layout/footer";
import { supabase } from "@/lib/supabase";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  CalendarDays,
} from "lucide-react";

type Service = {
  id: number;
  title: string;
  price: number;
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
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState("9:00 AM");

  const [yearInput, setYearInput] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      const { data, error } = await supabase
        .from("services")
        .select("id, title, price")
        .eq("id", Number(serviceId))
        .single();

      if (error) {
        console.log(error);
        return;
      }

      setSelectedService(data);
    };

    fetchService();
  }, [serviceId]);

  const subtotal = selectedService ? selectedService.price : 0;
  const taxesAndFees = 2000;
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
    if (!selectedService) {
      alert("Please select a service first.");
      return;
    }

    if (!customerName || !yearInput || !vehicleModel) {
      alert("Please fill in all vehicle details.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("bookings").insert({
        service_id: selectedService.id,
        service_title: selectedService.title,
        service_price: selectedService.price,
        customer_name: customerName,
        vehicle_year: yearInput,
        vehicle_model: vehicleModel,
        booking_date: selectedDateText,
        booking_time: selectedTime,
        subtotal,
        taxes_and_fees: taxesAndFees,
        total,
        status: "pending",
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Booking saved successfully!");

      setCustomerName("");
      setYearInput("");
      setVehicleModel("");
    } catch (error) {
      alert("Unable to save booking. Please try again.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080d0e] text-white px-6 pt-28 pb-10 md:px-20">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          <span className="text-yellow-400">Booking</span> Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="mb-10">
              <div className="flex justify-between border-b border-white/15 pb-3 mb-2">
                <h2 className="text-xl font-semibold">
                  Your Selected Service
                </h2>
              </div>

              {selectedService ? (
                <div className="flex justify-between border-b border-white/15 py-4 text-lg">
                  <span>{selectedService.title}</span>
                  <span>₦{selectedService.price.toLocaleString()}</span>
                </div>
              ) : (
                <p className="py-4 text-white/60">No service selected</p>
              )}
            </div>

            <h2 className="text-2xl font-semibold mb-5">
              Schedule Your Appointment
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-[280px] rounded-xl border border-white/15 bg-white/5 p-4">
                <div className="flex justify-between items-center mb-5">
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

                <div className="grid grid-cols-7 text-center text-sm text-white/50 mb-3 cursor-default">
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
                        className={`h-8 w-8 rounded-full mx-auto transition ${
                          isSelected
                            ? "bg-yellow-400 text-black font-bold"
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
                <h3 className="text-lg mb-4">Time/slot</h3>

                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg border px-4 py-2 text-sm transition ${
                        selectedTime === time
                          ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
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
              <h2 className="text-2xl font-semibold mb-5">Vehicle Details</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  placeholder="Year"
                  className="bg-white/5 border border-white/15 rounded-lg px-4 py-3 outline-none"
                />

                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="bg-white/5 border border-white/15 rounded-lg px-4 py-3 outline-none"
                />

                <input
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Your Model"
                  className="bg-white/5 border border-white/15 rounded-lg px-4 py-3 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-white/15 bg-white/5 overflow-hidden max-w-md ml-auto">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6">
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

                <div className="mt-4 text-sm text-white/60 flex items-center gap-2">
                  <CalendarDays size={16} />
                  {selectedDateText} at {selectedTime}
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={!selectedService || isSubmitting}
                className="w-full bg-yellow-400 text-black py-5 font-bold text-lg flex items-center justify-center gap-2 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Confirm Booking"}
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
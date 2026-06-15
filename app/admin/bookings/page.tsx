import { supabase } from "@/lib/supabase";

type Booking = {
  id: number;
  service_title: string;
  service_price: number;
  customer_name: string;
  vehicle_year: string;
  vehicle_model: string;
  booking_date: string;
  booking_time: string;
  total: number;
  status: string;
  created_at: string;
};

export default async function AdminBookingsPage() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="mt-4 text-red-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="mt-2 text-white/60">
          View and manage customer bookings.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-3">Customer</th>
                  <th>Service</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking: Booking) => (
                  <tr key={booking.id} className="border-t border-white/10">
                    <td className="py-4">{booking.customer_name}</td>
                    <td>{booking.service_title}</td>
                    <td className="text-white/60">
                      {booking.vehicle_year} {booking.vehicle_model}
                    </td>
                    <td className="text-white/60">{booking.booking_date}</td>
                    <td className="text-white/60">{booking.booking_time}</td>
                    <td className="font-bold text-yellow-400">
                      ₦{booking.total?.toLocaleString()}
                    </td>
                    <td>
                      <span className="rounded-md bg-yellow-400/20 px-3 py-1 text-xs text-yellow-400">
                        {booking.status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/50">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}
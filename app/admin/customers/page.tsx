"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Phone, User } from "lucide-react";

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total: number;
  payment_status: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("id, customer_name, customer_email, customer_phone, total, payment_status");

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const grouped = new Map();

    data?.forEach((booking) => {
      const email = booking.customer_email;

      if (!grouped.has(email)) {
        grouped.set(email, {
          name: booking.customer_name,
          email: booking.customer_email,
          phone: booking.customer_phone,
          bookings: 0,
          paidBookings: 0,
          totalSpent: 0,
        });
      }

      const customer = grouped.get(email);
      customer.bookings += 1;

      if (booking.payment_status === "paid") {
        customer.paidBookings += 1;
        customer.totalSpent += Number(booking.total || 0);
      }
    });

    setCustomers(Array.from(grouped.values()));
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Customers</h1>
      <p className="mt-2 text-white/60">View customers who have booked services.</p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        {loading ? (
          <p className="text-white/50">Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className="text-white/50">No customers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-3">Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Bookings</th>
                  <th>Paid Bookings</th>
                  <th>Total Spent</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.email} className="border-t border-white/10">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-yellow-400" />
                        {customer.name || "No name"}
                      </div>
                    </td>

                    <td className="text-white/60">
                      <Mail size={14} className="mr-2 inline text-yellow-400" />
                      {customer.email}
                    </td>

                    <td className="text-white/60">
                      <Phone size={14} className="mr-2 inline text-yellow-400" />
                      {customer.phone || "No phone"}
                    </td>

                    <td>{customer.bookings}</td>
                    <td>{customer.paidBookings}</td>

                    <td className="font-bold text-yellow-400">
                      ₦{customer.totalSpent.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
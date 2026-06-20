"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Wrench, Trash2, Plus } from "lucide-react";

type Mechanic = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  status: string;
};

export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");

  const fetchMechanics = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("mechanics")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setMechanics(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  const addMechanic = async () => {
    if (!fullName || !email || !phone || !specialization) {
      alert("Please fill in all mechanic details.");
      return;
    }

    const { error } = await supabase.from("mechanics").insert({
      full_name: fullName,
      email,
      phone,
      specialization,
      status: "available",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setFullName("");
    setEmail("");
    setPhone("");
    setSpecialization("");

    fetchMechanics();
  };

  const deleteMechanic = async (id: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this mechanic?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("mechanics")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setMechanics((prev) =>
      prev.filter((mechanic) => mechanic.id !== id)
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mechanics</h1>

        <p className="mt-2 text-white/60">
          Add, manage and assign mechanics to bookings.
        </p>
      </div>

      {/* Add Mechanic Form */}

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-5 text-lg font-bold">Add Mechanic</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />
        </div>

        <button
          onClick={addMechanic}
          className="mt-5 flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
        >
          <Plus size={18} />
          Add Mechanic
        </button>
      </div>

      {/* Mechanics List */}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-5 text-lg font-bold">
          Registered Mechanics
        </h2>

        {loading ? (
          <p className="text-white/50">Loading mechanics...</p>
        ) : mechanics.length === 0 ? (
          <p className="text-white/50">
            No mechanics registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-3">Mechanic</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {mechanics.map((mechanic) => (
                  <tr
                    key={mechanic.id}
                    className="border-t border-white/10"
                  >
                    <td className="py-4 flex items-center gap-2">
                      <Wrench size={16} />
                      {mechanic.full_name}
                    </td>

                    <td>{mechanic.email}</td>

                    <td>{mechanic.phone}</td>

                    <td>{mechanic.specialization}</td>

                    <td>
                      <span
                        className={`rounded-md px-3 py-1 text-xs ${
                          mechanic.status === "available"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {mechanic.status}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          deleteMechanic(mechanic.id)
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
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
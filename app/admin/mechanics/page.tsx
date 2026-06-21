"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Trash2, Wrench, XCircle } from "lucide-react";

type Mechanic = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string | null;
  location: string | null;
  image_url: string | null;
  status: string;
  is_approved: boolean;
};

export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

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

  const updateMechanicStatus = async (
    id: number,
    status: "available" | "rejected",
    approved: boolean
  ) => {
    const { error } = await supabase
      .from("mechanics")
      .update({
        status,
        is_approved: approved,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setMechanics((prev) =>
      prev.map((mechanic) =>
        mechanic.id === id
          ? { ...mechanic, status, is_approved: approved }
          : mechanic
      )
    );
  };

  const deleteMechanic = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this mechanic?");

    if (!confirmed) return;

    const { error } = await supabase.from("mechanics").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setMechanics((prev) => prev.filter((mechanic) => mechanic.id !== id));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mechanics</h1>

        <p className="mt-2 text-white/60">
          Review mechanic applications, approve qualified mechanics, or reject
          applications.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Registered Mechanics</h2>

          <button
            type="button"
            onClick={fetchMechanics}
            className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-white/50">Loading mechanics...</p>
        ) : mechanics.length === 0 ? (
          <p className="text-white/50">No mechanics registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-3">Mechanic</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Approved</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {mechanics.map((mechanic) => (
                  <tr key={mechanic.id} className="border-t border-white/10">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {mechanic.image_url ? (
                          <Image
                            src={mechanic.image_url}
                            alt={mechanic.full_name}
                            width={42}
                            height={42}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-yellow-400">
                            <Wrench size={18} />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold">
                            {mechanic.full_name}
                          </p>
                          <p className="text-xs text-white/40">
                            ID: {mechanic.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-white/60">{mechanic.email}</td>
                    <td className="text-white/60">{mechanic.phone}</td>
                    <td>{mechanic.specialization}</td>
                    <td className="text-white/60">
                      {mechanic.experience || "Not added"}
                    </td>
                    <td className="text-white/60">
                      {mechanic.location || "Not added"}
                    </td>

                    <td>
                      <span
                        className={`rounded-md px-3 py-1 text-xs ${
                          mechanic.status === "available"
                            ? "bg-green-500/20 text-green-400"
                            : mechanic.status === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {mechanic.status || "pending"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`rounded-md px-3 py-1 text-xs ${
                          mechanic.is_approved
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {mechanic.is_approved ? "Yes" : "No"}
                      </span>
                    </td>

                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        {mechanic.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateMechanicStatus(
                                  mechanic.id,
                                  "available",
                                  true
                                )
                              }
                              className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-600"
                            >
                              <CheckCircle size={14} />
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateMechanicStatus(
                                  mechanic.id,
                                  "rejected",
                                  false
                                )
                              }
                              className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          </>
                        )}

                        {mechanic.status === "rejected" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateMechanicStatus(
                                mechanic.id,
                                "available",
                                true
                              )
                            }
                            className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-600"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                        )}

                        {mechanic.status === "available" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateMechanicStatus(
                                mechanic.id,
                                "rejected",
                                false
                              )
                            }
                            className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteMechanic(mechanic.id)}
                          className="text-red-400 transition hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);
      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setPhoneNumber(data.phone_number || "");
        setVehicleType(data.vehicle_type || "");
        setVehicleModel(data.vehicle_model || "");
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!userId) return;
     if (!fullName || !phoneNumber || !vehicleType || !vehicleModel) {
  alert("Please fill in all profile details.");
  return;
}
    setLoading(true);

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      full_name: fullName,
      phone_number: phoneNumber,
      vehicle_type: vehicleType,
      vehicle_model: vehicleModel,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile saved successfully!");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-white/60">
          Save your details for faster bookings.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
          >
            <option value="" className="bg-[#080d0e]">
              Select Vehicle Type
            </option>
            <option value="Sedan" className="bg-[#080d0e]">
              Sedan
            </option>
            <option value="SUV" className="bg-[#080d0e]">
              SUV
            </option>
            <option value="Truck" className="bg-[#080d0e]">
              Truck
            </option>
            <option value="Bus" className="bg-[#080d0e]">
              Bus
            </option>
          </select>

          <input
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            placeholder="Vehicle Model e.g Toyota Corolla"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <button
            onClick={saveProfile}
            disabled={loading}
            className="rounded-lg bg-yellow-400 py-3 font-bold text-black disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
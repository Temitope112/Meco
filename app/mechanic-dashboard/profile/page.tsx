"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, MapPin, Phone, Save, User, Wrench } from "lucide-react";

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

export default function MechanicProfilePage() {
  const router = useRouter();

  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("mechanics")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error || !data) {
      router.push("/mechanic-pending");
      return;
    }

    if (!data.is_approved || data.status !== "available") {
      router.push("/mechanic-pending");
      return;
    }

    setMechanic(data);
    setFullName(data.full_name || "");
    setPhone(data.phone || "");
    setSpecialization(data.specialization || "");
    setExperience(data.experience || "");
    setLocation(data.location || "");
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    if (!mechanic) return;

    if (!fullName || !phone || !specialization || !experience || !location) {
      alert("Please fill in all fields.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("mechanics")
      .update({
        full_name: fullName,
        phone,
        specialization,
        experience,
        location,
      })
      .eq("id", mechanic.id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Profile updated successfully.");
    setSaving(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/50">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-white/60">
          Manage your mechanic profile information.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col items-center text-center">
            {mechanic?.image_url ? (
              <Image
                src={mechanic.image_url}
                alt={mechanic.full_name}
                width={120}
                height={120}
                className="h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-yellow-400 text-black">
                <User size={42} />
              </div>
            )}

            <h2 className="mt-5 text-2xl font-bold">{mechanic?.full_name}</h2>
            <p className="mt-1 text-sm text-white/50">{mechanic?.email}</p>

            <span className="mt-4 rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
              {mechanic?.status}
            </span>
          </div>

          <div className="mt-8 space-y-4 text-sm text-white/70">
            <Info icon={<Mail size={16} />} text={mechanic?.email || ""} />
            <Info icon={<Phone size={16} />} text={mechanic?.phone || ""} />
            <Info
              icon={<Wrench size={16} />}
              text={mechanic?.specialization || ""}
            />
            <Info
              icon={<MapPin size={16} />}
              text={mechanic?.location || ""}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-6 text-xl font-bold">Edit Profile</h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              placeholder="Full name"
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              placeholder="Phone number"
            />

            <Input
              label="Specialization"
              value={specialization}
              onChange={setSpecialization}
              placeholder="Engine repair, brake service..."
            />

            <Input
              label="Years of Experience"
              value={experience}
              onChange={setExperience}
              placeholder="e.g. 5 years"
            />

            <div className="md:col-span-2">
              <Input
                label="Location"
                value={location}
                onChange={setLocation}
                placeholder="Ogbomosho, Oyo State"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={updateProfile}
            disabled={saving}
            className="mt-6 flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">{label}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
      />
    </label>
  );
}

function Info({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-yellow-400">{icon}</span>
      <span>{text || "Not added"}</span>
    </div>
  );
}
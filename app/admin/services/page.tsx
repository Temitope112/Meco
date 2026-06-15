"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Plus, Trash2, X, Upload, CloudUpload } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Service = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  created_at?: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setServices(data || []);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImageFile(null);
  };

  const addService = async () => {
    if (!title || !price || !category || !description || !imageFile) {
      alert("Please fill all fields and choose an image.");
      return;
    }

    try {
      setLoading(true);

      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("service-images")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const { error } = await supabase.from("services").insert({
        title,
        price: Number(price),
        category,
        description,
        image_url: imageUrl,
      });

      if (error) {
        alert(error.message);
        return;
      }

      resetForm();
      setOpenModal(false);
      alert("Service added successfully!");
      fetchServices();
    } catch (error) {
      console.log(error);
      alert("Something went wrong while adding service.");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchServices();
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <p className="mt-2 text-white/60">
            Add, view and manage MECO services from Supabase.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 font-bold text-black cursor-pointer"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-5 text-xl font-bold">All Services</h2>
        

         {services.length === 0 ? (
          <p className="text-white/50">No services added yet.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => {
              const imageSrc =
                service.image_url?.startsWith("http") ||
                service.image_url?.startsWith("/")
                  ? service.image_url
                  : "/oil-change.png"; 

              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-24 overflow-hidden rounded-lg bg-white/10">
                      <Image
                        src={imageSrc}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold">{service.title}</h3>
                      <p className="text-sm text-white/50">
                        {service.category}
                      </p>
                      <p className="mt-2 max-w-xl text-sm text-white/60">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-5">
                    <p className="font-bold text-yellow-400">
                      ₦{service.price.toLocaleString()}
                    </p>

                    <button
                      type="button"
                      onClick={() => deleteService(service.id)}
                      className="text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {openModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-800 bg-[#0b1113] text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <p className="text-sm font-semibold">Add New Service</p>

        <button
          type="button"
          onClick={() => setOpenModal(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 transition hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-white/50">
            Service name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Oil Change"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-white/50">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short service description..."
            rows={3}
            className="resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-white/50">
              Price (₦)
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="30000"
              type="number"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-white/50">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none"
            >
              <option value="" className="bg-[#0b1113]">
                Select category
              </option>
              <option value="Maintenance" className="bg-[#0b1113]">
                Maintenance
              </option>
              <option value="Repair" className="bg-[#0b1113]">
                Repair
              </option>
              <option value="Diagnostics" className="bg-[#0b1113]">
                Diagnostics
              </option>
              <option value="Body Work" className="bg-[#0b1113]">
                Body Work
              </option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-white/50">
            Service image
          </label>

          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 p-5 text-center transition hover:bg-white/10">
            <CloudUpload size={22} className="text-yellow-400" />

            <span className="text-xs text-white/50">
              {imageFile
                ? imageFile.name
                : "Click to upload service image"}
            </span>

           <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("No image selected");
      return;
    }

    console.log("Selected image:", file);
    setImageFile(file);
  }}
  className="hidden"
/>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpenModal(false)}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={addService}
          disabled={loading}
          className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Add Service"}
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}
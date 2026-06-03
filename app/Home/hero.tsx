import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen">
      <div className="relative w-full min-h-screen overflow-hidden">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />

        <div className="relative z-20 grid min-h-screen lg:grid-cols-2">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center px-8 lg:px-14">
            <h1 className="max-w-xl text-5xl font-bold leading-tight text-white lg:text-7xl">
              Car Care,
              <br />
              Made{" "}
              <span className="text-yellow-400">Simple.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-gray-300">
              Book trusted car services, anytime, anywhere.
            </p>

            {/* Search */}
            <div className="mt-10 flex w-full max-w-xl overflow-hidden rounded-xl bg-white">
              <input
                type="text"
                placeholder="What does your car need?"
                className="flex-1 px-5 py-4 text-gray-700 outline-none"
              />
              <button className="bg-yellow-400 px-8 font-semibold text-black hover:bg-yellow-500 cursor-pointer transition-500">
                Search
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative min-h-[400px] lg:min-h-screen">
            <Image
              src="/BMW.png"
              alt="Luxury Car"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Feature Strip */}
        <div className="absolute bottom-6 left-1/2 z-30 w-[92%] -translate-x-1/2">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#0F172A] p-5 lg:grid-cols-4">
            {[
              { title: "Trusted Mechanics", desc: "Verified & Rated" },
              { title: "Quick Booking", desc: "Hassle-free Process" },
              { title: "Affordable Price", desc: "Best Value Guarantee" },
              { title: "Secure Payments", desc: "100% Safe & Secure" },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
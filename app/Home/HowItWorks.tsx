import { ArrowRight, CalendarDays, Car, ClipboardList, Wrench } from "lucide-react";

const steps = [
  {
    number: "1.",
    title: "Choose Service",
    description: "Select the service you need",
    icon: ClipboardList,
  },
  {
    number: "2.",
    title: "Book Appointment",
    description: "Pick a time and location",
    icon: CalendarDays,
  },
  {
    number: "3.",
    title: "Get It Fixed",
    description: "Our mechanic gets the job done",
    icon: Wrench,
  },
  {
    number: "4.",
    title: "Drive Happy",
    description: "Enjoy your smooth ride",
    icon: Car,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-[#05080a] px-6 py-10 text-white shadow-sm md:px-10">
          <h2 className="mb-10 text-center text-2xl font-bold">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="relative flex items-start gap-4">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-yellow-400">
                      <Icon size={32} strokeWidth={1.7} />
                    </div>

                    <h3 className="text-sm font-bold">
                      {step.number} {step.title}
                    </h3>

                    <p className="mt-2 max-w-[150px] text-sm leading-6 text-white/70">
                      {step.description}
                    </p>
                  </div>

                  {index !== steps.length - 1 && (
                    <ArrowRight className="absolute right-4 top-5 hidden text-white/50 md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
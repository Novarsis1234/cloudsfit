const services = [
  {
    title: "Personal Training",
    desc: "1-on-1 sessions tailored to your goals with certified trainers.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    ),
  },
  {
    title: "Group Classes",
    desc: "High-energy group workouts for all fitness levels.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" /></svg>
    ),
  },
  {
    title: "Nutrition Guidance",
    desc: "Personalized meal plans and expert nutrition advice.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
  },
  {
    title: "Online Coaching",
    desc: "Train anywhere with our digital programs and app.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" /></svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="programs" className="py-20 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          Our Programs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <div key={i} className="bg-neutral-900 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">{service.title}</h3>
              <p className="text-gray-300 text-center">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

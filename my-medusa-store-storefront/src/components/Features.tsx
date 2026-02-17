const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" /></svg>
    ),
    title: "24/7 Access",
    desc: "Train anytime with round-the-clock facility and app access.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" /></svg>
    ),
    title: "Modern Equipment",
    desc: "Top-tier machines and free weights for every workout style.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
    title: "Expert Trainers",
    desc: "Certified professionals to guide and motivate you.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    ),
    title: "Community Support",
    desc: "Join a vibrant, motivating fitness community.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="bg-neutral-900 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">{feature.title}</h3>
              <p className="text-gray-300 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

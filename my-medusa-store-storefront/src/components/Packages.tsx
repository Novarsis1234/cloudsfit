const packages = [
  {
    name: "Starter",
    price: "$49/mo",
    features: ["Gym Access", "2 Group Classes/week", "Basic Support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$89/mo",
    features: ["All Starter features", "Unlimited Classes", "Personal Trainer", "Nutrition Plan"],
    highlight: true,
  },
  {
    name: "Elite",
    price: "$149/mo",
    features: ["All Pro features", "1-on-1 Coaching", "Priority Support", "Exclusive Events"],
    highlight: false,
  },
];

export default function Packages() {
  return (
    <section id="packages" className="py-20 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Membership Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 shadow-lg flex flex-col items-center border-2 transition-transform hover:scale-105 ${pkg.highlight ? "bg-primary text-white border-primary" : "bg-neutral-900 text-white border-neutral-800"}`}
            >
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="text-3xl font-extrabold mb-4">{pkg.price}</div>
              <ul className="mb-6 space-y-2">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="text-green-400">✔️</span> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-auto px-6 py-2 rounded-full font-bold shadow ${pkg.highlight ? "bg-white text-primary hover:bg-gray-200" : "bg-primary text-white hover:bg-primary-dark"} transition`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

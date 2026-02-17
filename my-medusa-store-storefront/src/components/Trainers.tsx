const trainers = [
  {
    name: "Alex Strong",
    role: "Head Coach",
    img: "AS",
    desc: "10+ years experience in strength and conditioning."
  },
  {
    name: "Mia Flex",
    role: "Yoga & Mobility",
    img: "MF",
    desc: "Certified yoga instructor and flexibility expert."
  },
  {
    name: "Jake Power",
    role: "HIIT Specialist",
    img: "JP",
    desc: "High-intensity interval training and fat loss coach."
  },
];

export default function Trainers() {
  return (
    <section id="trainers" className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Meet Our Trainers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {trainers.map((trainer, i) => (
            <div key={i} className="bg-neutral-900 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
              <div className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-primary bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-4xl font-bold">
                {trainer.img}
              </div>
              <h3 className="text-xl font-semibold mb-1">{trainer.name}</h3>
              <span className="text-primary font-medium mb-2">{trainer.role}</span>
              <p className="text-gray-300 text-center">{trainer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

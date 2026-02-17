export default function About() {
  return (
    <section id="about" className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
        <div className="md:w-1/2 w-full">
          <div className="rounded-2xl shadow-lg object-cover bg-gradient-to-br from-neutral-900 to-neutral-800 w-full h-96 flex items-center justify-center">
            <span className="text-white/20 text-4xl font-bold">FitClub</span>
          </div>
        </div>
        <div className="md:w-1/2 w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About <span className="text-primary">FitClub</span></h2>
          <p className="text-lg text-gray-300 mb-4">
            FitClub is your destination for transformation. Our mission is to empower you to reach your fitness goals with world-class trainers, modern facilities, and a supportive community.
          </p>
          <ul className="space-y-2 text-gray-400">
            <li>✔️ State-of-the-art equipment</li>
            <li>✔️ Personalized training plans</li>
            <li>✔️ Nutrition and wellness support</li>
            <li>✔️ 24/7 access and online programs</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

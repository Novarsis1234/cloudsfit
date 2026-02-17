"use client";

import { useState } from "react";

const testimonials = [
  {
    name: "Sarah K.",
    text: "Joining FitClub was the best decision I made for my health. The trainers are amazing and the community is so supportive!",
  },
  {
    name: "Mike D.",
    text: "The group classes are intense and fun. I’ve never felt more motivated to work out!",
  },
  {
    name: "Emily R.",
    text: "The nutrition guidance helped me transform my lifestyle. Highly recommend!",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">What Our Members Say</h2>
        <div className="relative bg-neutral-900 rounded-2xl p-10 shadow-lg">
          <p className="text-xl md:text-2xl font-medium mb-6 text-gray-200">“{testimonials[index].text}”</p>
          <div className="font-bold text-primary mb-2">{testimonials[index].name}</div>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-primary text-white flex items-center justify-center transition">
              &#8592;
            </button>
            <button onClick={next} className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-primary text-white flex items-center justify-center transition">
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

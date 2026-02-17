import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-[80vh] bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black opacity-60 -z-10" />
      <div className="relative z-10 max-w-2xl text-center px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Transform Your Body, <span className="text-primary">Unleash</span> Your Potential
        </h1>
        <p className="mb-8 text-lg md:text-2xl font-medium text-gray-200">
          Premium fitness programs, expert trainers, and a community that motivates you to achieve more.
        </p>
        <Link href="#programs" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-primary-dark transition">
          Get Started
        </Link>
      </div>
    </section>
  );
}

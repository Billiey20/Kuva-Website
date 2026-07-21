import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    heading: "Welcome to Kuva Hospital",
    description: "Kuva Hospital is a modern, fully-equipped Level 4A referral hospital in Webuye. We have a dedicated outpatient facility purposefully separated from our urgent care unit.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=90&w=1600&h=900", // Bright modern hospital corridor
    linkText: "Learn More",
    link: "#about"
  },
  {
    heading: "Surgical Services",
    description: "Our surgical theatre services cover patients of all ages — from minor routine procedures to complex surgeries — delivered by board-certified surgical specialists.",
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=90&w=1600&h=900", // Clean surgical lights, no scary surgery
    linkText: "Find Out More",
    link: "#services"
  },
  {
    heading: "Obstetrics & Gynaecology",
    description: "The health of women during pregnancy and delivery is vital for both mother and child. Our OB/GYN team provides world-class maternal and reproductive healthcare.",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=90&w=1600&h=900", // Peaceful pregnant belly
    linkText: "Find Out More",
    link: "#services"
  },
  {
    heading: "Paediatric Services",
    description: "We have a dedicated children's ward with skilled and experienced medical staff providing round-the-clock care, including a full neonatal intensive care unit (NICU).",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=90&w=1600&h=900", // Doctor checking a child
    linkText: "Find Out More",
    link: "#services"
  },
  {
    heading: "Dental Services",
    description: "At Kuva Hospital we are committed to providing world-class dental treatment in a modern clinic where quality and patient care are of utmost importance.",
    image: "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?auto=format&fit=crop&q=90&w=1600&h=900", // Pristine, bright dental chair/room
    linkText: "Find Out More",
    link: "#services"
  },
  {
    heading: "Laboratory & Imaging",
    description: "Our diagnostic department is equipped with state-of-the-art laboratory analyzers and digital radiology imaging for fast, accurate results.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=90&w=1600&h=900", // High-tech lab equipment / microscopes
    linkText: "Find Out More",
    link: "#services"
  }
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [fading, setFading] = useState(false);

  const goToSlide = useCallback((index) => {
    if (index === activeSlide) return;
    setActiveSlide(index);
  }, [activeSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => goToSlide(activeSlide === 0 ? slides.length - 1 : activeSlide - 1);
  const handleNext = () => goToSlide(activeSlide === slides.length - 1 ? 0 : activeSlide + 1);

  const slide = slides[activeSlide];

  return (
    <section
      className="relative w-full overflow-hidden h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] min-h-[400px] md:min-h-[520px] max-h-[750px]"
    >

      {/* ── Full-width background images — all preloaded, cross-fading & slow zooming ── */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[6000ms] ease-out origin-center ${
            activeSlide === idx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ backgroundImage: `url(${s.image})` }}
          aria-hidden={activeSlide !== idx}
        />
      ))}

      {/*
        ── The magic: a very wide, very gradual multi-stop gradient
           that fades from pure white on the left all the way
           to completely transparent at ~70% of the width.
           The transition is so long and soft that the eye reads
           the whole thing as one unified composition.
      ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.97) 18%, rgba(255,255,255,0.88) 28%, rgba(255,255,255,0.60) 38%, rgba(255,255,255,0.20) 47%, rgba(255,255,255,0.04) 53%, rgba(255,255,255,0) 58%)'
        }}
      />

      {/* ── Text content — sits on top of the gradient ── */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16">

          {/* Text block with staggered fade+slide animation using framer-motion */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }}
              className="max-w-lg"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-5"
              >
                {slide.heading}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 font-medium max-w-sm"
              >
                {slide.description}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <a
                  href={slide.link}
                  className="inline-flex items-center bg-slate-800 hover:bg-slate-900 text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-xl shadow-lg backdrop-blur-sm"
                >
                  {slide.linkText}
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex gap-2 items-center mt-12">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`rounded-full transition-all duration-300 ${
                  activeSlide === idx ? 'bg-primary w-8 h-2.5' : 'bg-slate-400/60 hover:bg-slate-500/80 w-2.5 h-2.5'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Arrow controls — subtle, semi-transparent */}
      <button
        onClick={handlePrev}
        className="absolute right-16 bottom-8 z-30 bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 bottom-8 z-30 bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

    </section>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    heading: "Welcome to Kuva Hospital",
    description: "Kuva Hospital is a modern, fully-equipped Level 4A referral hospital in Webuye. We have a dedicated outpatient facility purposefully separated from our urgent care unit.",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=90&w=1600&h=900",
    linkText: "Learn More",
    link: "#about"
  },
  {
    heading: "Surgical Services",
    description: "Our surgical theatre services cover patients of all ages — from minor routine procedures to complex surgeries — delivered by board-certified surgical specialists.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=90&w=1600&h=900",
    linkText: "Find Out More",
    link: "#services"
  },
  {
    heading: "Obstetrics & Gynaecology",
    description: "The health of women during pregnancy and delivery is vital for both mother and child. Our OB/GYN team provides world-class maternal and reproductive healthcare.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=90&w=1600&h=900",
    linkText: "Find Out More",
    link: "#services"
  },
  {
    heading: "Paediatric Services",
    description: "We have a dedicated children's ward with skilled and experienced medical staff providing round-the-clock care, including a full neonatal intensive care unit (NICU).",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=90&w=1600&h=900",
    linkText: "Find Out More",
    link: "#services"
  },
  {
    heading: "Dental Services",
    description: "At Kuva Hospital we are committed to providing world-class dental treatment in a modern clinic where quality and patient care are of utmost importance.",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=90&w=1600&h=900",
    linkText: "Find Out More",
    link: "#services"
  },
  {
    heading: "Radiology & Imaging",
    description: "Our imaging department adheres to all regulatory requirements for quality assurance and radiation safety, delivering fast, accurate diagnostic results.",
    image: "https://images.unsplash.com/photo-1516069677018-378515003435?auto=format&fit=crop&q=90&w=1600&h=900",
    linkText: "Find Out More",
    link: "#services"
  }
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [fading, setFading] = useState(false);

  const goToSlide = useCallback((index) => {
    if (fading || index === activeSlide) return;
    setFading(true);
    setTimeout(() => {
      setActiveSlide(index);
      setFading(false);
    }, 400);
  }, [fading, activeSlide]);

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
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 80px)', minHeight: '520px', maxHeight: '750px' }}
    >

      {/* ── Full-width background images — all preloaded, cross-fading ── */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${s.image})`,
            opacity: activeSlide === idx ? 1 : 0,
          }}
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

          {/* Text block with fade+slide animation on change */}
          <div
            className="max-w-lg transition-all duration-500"
            style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(12px)' : 'translateY(0)' }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-5">
              {slide.heading}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 font-medium max-w-sm">
              {slide.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={slide.link}
                className="inline-flex items-center bg-slate-700/70 hover:bg-slate-700/90 text-white/90 hover:text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 backdrop-blur-sm border border-white/10"
              >
                {slide.linkText}
              </a>
            </div>
          </div>

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

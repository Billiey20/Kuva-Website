import React, { useState } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: "Wycliffe Wafula",
    location: "Webuye Town",
    quote: "The emergency team at Kuva Hospital saved my life after a serious motorcycle accident along the highway. They were prompt, professional, and handled me with utmost care.",
    rating: 5,
    role: "Emergency Patient"
  },
  {
    name: "Naomi Nafula",
    location: "Misikhu",
    quote: "Delivering my daughter at the Kuva Maternity wing was a wonderful experience. The midwives and pediatricians were incredibly warm and supportive throughout my stay.",
    rating: 5,
    role: "Maternity Care Patient"
  },
  {
    name: "John Simiyu",
    location: "Lugulu",
    quote: "Their laboratory diagnostics are very fast and accurate. I was able to get my test results within an hour, and the chief doctor explained the treatment plan very clearly.",
    rating: 5,
    role: "Outpatient Clinic"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-10 bg-slate-50 dark:bg-slate-900/20 text-slate-900 dark:text-white relative overflow-hidden">
      {/* Background soft blurs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            Patient Stories & Reviews
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 font-medium">
            Hear from our community about their treatment experiences at Kuva Hospital.
          </p>
        </div>

        {/* Carousel Layout */}
        <div className="max-w-4xl mx-auto relative px-12">
          
          {/* Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-8 sm:p-12 rounded-3xl shadow-xl relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />
            
            <div className="flex flex-col items-center text-center">
              
              {/* Rating stars */}
              <div className="flex gap-1 mb-6 text-amber-400">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl sm:text-2xl font-semibold leading-relaxed mb-8 italic text-slate-700 dark:text-slate-300">
                "{current.quote}"
              </blockquote>
              
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{current.name}</h4>
                <p className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">{current.role} &bull; {current.location}</p>
              </div>
              
            </div>
          </div>

          {/* Navigation Controls */}
          <button 
            onClick={handlePrev} 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 border border-slate-200 dark:border-slate-700 shadow-md w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer text-slate-600 dark:text-slate-300"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleNext} 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 border border-slate-200 dark:border-slate-700 shadow-md w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer text-slate-600 dark:text-slate-300"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-primary w-8' : 'bg-slate-300 hover:bg-slate-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

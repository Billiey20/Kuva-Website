import React from 'react';
import Hero from '../components/home/Hero';
import AboutUs from '../components/home/AboutUs';
import ServicesGrid from '../components/home/ServicesGrid';
import TrustBadges from '../components/home/TrustBadges';
import OurStaff from '../components/home/OurStaff';
import Testimonials from '../components/home/Testimonials';
import FAQAccordion from '../components/home/FAQAccordion';
import InsuranceIntegration from '../components/home/InsuranceIntegration';

export default function Home() {
  return (
    <div className="flex flex-col gap-0 w-full">
      <Hero />
      <AboutUs />
      <ServicesGrid />
      <TrustBadges />
      <OurStaff />
      <Testimonials />
      <FAQAccordion />
      <InsuranceIntegration />
    </div>
  );
}

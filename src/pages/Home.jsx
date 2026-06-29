import React from 'react';
import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';
import OurStaff from '../components/home/OurStaff';
import InsuranceIntegration from '../components/home/InsuranceIntegration';

export default function Home() {
  return (
    <div className="flex flex-col gap-0 w-full">
      <Hero />
      <ServicesGrid />
      <OurStaff />
      <InsuranceIntegration />
    </div>
  );
}

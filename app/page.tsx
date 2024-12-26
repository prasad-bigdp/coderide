'use client';

import { Navbar } from '@/components/home/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureSection } from '@/components/home/FeatureSection';
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel';
import { FaqSection } from '@/components/home/FaqSection';
import { Footer } from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <TestimonialCarousel />
      <FaqSection />
      <Footer />
    </div>
  );
}
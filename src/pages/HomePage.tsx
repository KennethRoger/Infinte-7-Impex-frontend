import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CertificationsStrip } from '../components/home/CertificationsStrip';
import { PromiseSection } from '../components/home/PromiseSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { ExportProcessSection } from '../components/home/ExportProcessSection';
import { MarketsSection } from '../components/home/MarketsSection';
import { ContactSection } from '../components/contact/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Certifications & Trust Strip */}
      <CertificationsStrip />

      {/* 3. Buyer Promise & Direct Connect */}
      <PromiseSection />

      {/* 4. What Makes Us The Right Export Partner (6 Grid Features) */}
      <FeaturesSection />

      {/* 5. Featured Produce Lines */}
      <FeaturedProductsSection />

      {/* 6. The Export Process Stepper */}
      <ExportProcessSection />

      {/* 7. Destination Markets */}
      <MarketsSection />

      {/* 8. Reusable Contact & Quote Section */}
      <ContactSection id="get-quote" />
    </div>
  );
};

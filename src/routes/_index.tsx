import { Hero } from '../app/components/Hero';
import { Features } from '../app/components/Features';
import { HowItWorks } from '../app/components/HowItWorks';
import { Testimonials } from '../app/components/Testimonials';
import { CTA } from '../app/components/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      {/* <Testimonials /> */}
      <CTA />
    </>
  );
}
import { Hero } from '../app/components/Hero';
import { Features } from '../app/components/Features';
import { HowItWorks } from '../app/components/HowItWorks';
import { Plans } from '../app/components/Plans';
import { Partners } from '../app/components/Partners';
import { DemoAccount } from '../app/components/DemoAccount';
import { Testimonials } from '../app/components/Testimonials';
import { CTA } from '../app/components/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Plans />
      <Partners />
      <DemoAccount />
      {/* <Testimonials /> */}
      <CTA />
    </>
  );
}
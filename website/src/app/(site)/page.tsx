import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { LoanRoutes } from "@/components/sections/LoanRoutes";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CostTable } from "@/components/sections/CostTable";
import { Testimonials } from "@/components/sections/Testimonials";
import { SafetyPoints } from "@/components/sections/SafetyPoints";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { FinalCta } from "@/components/sections/FinalCta";
import { getFaqs, getTestimonials } from "@/lib/content";

// Section order and jobs: docs/design/design-brief.html (Gate 3).
export default async function HomePage() {
  const [faqs, testimonials] = await Promise.all([getFaqs(), getTestimonials()]);

  return (
    <>
      <HomeHero />
      <TrustStrip />
      <LoanRoutes />
      <HowItWorks />
      <CostTable />
      <Testimonials items={testimonials} />
      <SafetyPoints />
      <FaqPreview items={faqs.slice(0, 5)} />
      <FinalCta />
    </>
  );
}

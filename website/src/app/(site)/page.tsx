import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { LoanRoutes } from "@/components/sections/LoanRoutes";
import { ProcessLanes } from "@/components/sections/ProcessLanes";
import { CostTable } from "@/components/sections/CostTable";
import { Testimonials } from "@/components/sections/Testimonials";
import { SafetyPoints } from "@/components/sections/SafetyPoints";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getFaqs, getTestimonials } from "@/lib/content";

// Section order and jobs: docs/design/design-brief.html (Gate 3).
export default async function HomePage() {
  const [faqs, testimonials] = await Promise.all([getFaqs(), getTestimonials()]);

  return (
    <>
      <HomeHero />
      <TrustStrip />
      <LoanRoutes />
      <ProcessLanes />
      <CostTable />
      <Testimonials items={testimonials} />
      <SafetyPoints />
      <FaqPreview items={faqs.slice(0, 5)} />
      <CtaBanner />
    </>
  );
}

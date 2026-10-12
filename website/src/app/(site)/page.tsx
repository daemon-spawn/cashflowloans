import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { LoanRoutes } from "@/components/sections/LoanRoutes";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CostTable } from "@/components/sections/CostTable";
import { Testimonials } from "@/components/sections/Testimonials";
import { SafetyPoints } from "@/components/sections/SafetyPoints";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { FinalCta } from "@/components/sections/FinalCta";
import { getFaqs, getPosts, getTestimonials } from "@/lib/content";

// Section order and jobs: docs/design/design-brief.html (Gate 3). The blog row
// mirrors the original homepage's six article cards.
export default async function HomePage() {
  const [faqs, testimonials, posts] = await Promise.all([getFaqs(), getTestimonials(), getPosts(6)]);

  return (
    <>
      <HomeHero />
      <TrustStrip />
      <LoanRoutes />
      <HowItWorks />
      <CostTable />
      <Testimonials items={testimonials} />
      <SafetyPoints />
      <BlogPreview posts={posts} />
      <FaqPreview items={faqs.slice(0, 5)} />
      <FinalCta />
    </>
  );
}

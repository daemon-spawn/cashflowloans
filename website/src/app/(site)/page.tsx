import { HomeHero } from "@/components/sections/HomeHero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { CompanyIntro } from "@/components/sections/CompanyIntro";
import { LoanRoutes } from "@/components/sections/LoanRoutes";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CostTable } from "@/components/sections/CostTable";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { SafetyPoints } from "@/components/sections/SafetyPoints";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { FinalCta } from "@/components/sections/FinalCta";
import { getFaqs, getPosts, getTestimonials } from "@/lib/content";

// Section order: design brief (Gate 3) plus the original homepage's Company
// Introductions, All Loans Services, Why Choose Us, blog row and full FAQ.
export default async function HomePage() {
  const [faqs, testimonials, posts] = await Promise.all([getFaqs(), getTestimonials(), getPosts(6)]);

  return (
    <>
      <HomeHero />
      <TrustStrip />
      <CompanyIntro />
      <LoanRoutes />
      <HowItWorks />
      <CostTable />
      <WhyChooseUs />
      <Testimonials items={testimonials} />
      <SafetyPoints />
      <BlogPreview posts={posts} />
      <FaqPreview items={faqs} />
      <FinalCta />
    </>
  );
}

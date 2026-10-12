/**
 * Customer testimonials. Never invent these: the section stays hidden until
 * real, consented testimonials exist. Moves to the CRM-managed content API.
 */
export type Testimonial = {
  quote: string;
  name: string;
  location?: string;
  loanType?: "secured" | "unsecured";
};

export const testimonials: readonly Testimonial[] = [];

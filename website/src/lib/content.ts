/**
 * Content access for pages. Today it reads the files in src/content; once the
 * CRM content editor ships, these fetch from the API instead and pages don't change.
 */
import { faq, type FaqItem } from "@/content/faq";
import { testimonials, type Testimonial } from "@/content/testimonials";
import { getPost as findPost, posts, type BlogPost } from "@/content/blog";

export async function getFaqs(): Promise<readonly FaqItem[]> {
  return faq;
}

export async function getTestimonials(): Promise<readonly Testimonial[]> {
  return testimonials;
}

export async function getPosts(limit?: number): Promise<readonly BlogPost[]> {
  return limit ? posts.slice(0, limit) : posts;
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return findPost(slug);
}

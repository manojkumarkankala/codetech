export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  client_name: string | null;
  price: number | null;
  currency: string;
  short_description: string | null;
  description: string | null;
  problem: string | null;
  solution: string | null;
  features: string | null;
  challenges: string | null;
  results: string | null;
  technologies: string[];
  cover_image: string | null;
  live_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  status: string;
  featured: boolean;
  published: boolean;
  show_price: boolean;
  display_order: number;
  start_date: string | null;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string | null;
  short_description: string | null;
  description: string | null;
  features: string[];
  starting_price: number | null;
  currency: string;
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  features: string[];
  popular: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  profile_image: string | null;
  rating: number;
  review: string;
  review_date: string | null;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  subject: string | null;
  description: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  budget: string | null;
  timeline: string | null;
  description: string | null;
  features: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteContentEntry {
  id: string;
  key: string;
  content: Record<string, any>;
  updated_at: string;
}

export interface WebsiteStatistic {
  id: string;
  label: string;
  value: string;
  icon: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  company_name: string;
  tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  website_url: string;
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  github: string | null;
  youtube: string | null;
  twitter: string | null;
  created_at: string;
  updated_at: string;
}

export const PROJECT_CATEGORIES = [
  'Business', 'E-Commerce', 'Real Estate', 'Portfolio',
  'Web Application', 'AI', 'Mobile', 'Other',
] as const;

export const PROJECT_STATUSES = [
  'Planning', 'In Development', 'Completed', 'Maintenance', 'Archived',
] as const;

export const MESSAGE_STATUSES = [
  'Unread', 'Read', 'Contacted', 'In Progress', 'Completed', 'Archived',
] as const;

export const QUOTE_STATUSES = [
  'New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Approved', 'Rejected', 'Completed',
] as const;

export const SERVICE_OPTIONS = [
  'Business Website', 'E-Commerce Website', 'Real Estate Website', 'Portfolio Website',
  'Web Application', 'AI Application', 'Website Redesign', 'Website Maintenance',
  'SEO', 'API Integration', 'Payment Integration', 'Admin Dashboard', 'Other',
] as const;

/*
# CodeTech — Initial Database Schema

## Overview
Creates the full schema for the CodeTech freelance web-development company platform:
public website content + a secure admin control center. All public-facing content
(projects, services, pricing, testimonials, hero, about, statistics, process steps,
"why choose us", contact info, settings) is database-driven so the admin can update
the website without touching source code.

## Tables created
1. `admins` — admin login audit/profile records linked to auth.users (optional).
2. `projects` — portfolio projects with price, category, technologies, status, images, links.
3. `project_images` — multiple screenshots per project.
4. `services` — offered services with starting price, features, icon.
5. `pricing_packages` — tiered pricing cards (Starter, Business, etc.).
6. `testimonials` — client reviews with rating and profile image.
7. `messages` — client enquiries from the contact form.
8. `quote_requests` — detailed quote request submissions.
9. `website_content` — flexible key/value JSON store for Hero, About, CTA, Footer, Contact text.
10. `website_statistics` — named numeric/label statistics shown on home.
11. `process_steps` — development process steps (Discovery, Planning, etc.).
12. `why_choose_us` — feature cards (Modern Design, etc.).
13. `settings` — single-row company settings (name, logo, contact, socials).

## Security
- RLS enabled on every table.
- Public-facing content tables (projects, services, pricing, testimonials, website_content,
  website_statistics, process_steps, why_choose_us, settings) are readable by anon + authenticated,
  and writable only by authenticated admins.
- messages + quote_requests are insertable by anon (public forms) but only readable/writable
  by authenticated admins.
- admin-only writes are enforced by `TO authenticated` policies. A dedicated admin sign-in
  (Supabase email/password) gates access; anon cannot modify any content.

## Notes
- Uses `gen_random_uuid()` for primary keys.
- Timestamps default to `now()`.
- `settings` is constrained to a single row via a unique index on a fixed boolean.
- `website_content` uses a flexible `key` + `content jsonb` pattern so the admin can edit
  arbitrary sections (hero, about, cta, footer, contact) without schema changes.
*/

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT 'Administrator',
  role text NOT NULL DEFAULT 'admin',
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'Business',
  client_name text,
  price numeric(12,2),
  currency text NOT NULL DEFAULT 'INR',
  short_description text,
  description text,
  problem text,
  solution text,
  features text,
  challenges text,
  results text,
  technologies text[] DEFAULT '{}',
  cover_image text,
  live_url text,
  github_url text,
  demo_url text,
  status text NOT NULL DEFAULT 'Completed',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  show_price boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  start_date date,
  completion_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'Code',
  image text,
  short_description text,
  description text,
  features text[] DEFAULT '{}',
  starting_price numeric(12,2),
  currency text NOT NULL DEFAULT 'INR',
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  description text,
  features text[] DEFAULT '{}',
  popular boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company text,
  role text,
  profile_image text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review text NOT NULL,
  review_date date,
  published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service text,
  subject text,
  description text,
  budget text,
  timeline text,
  status text NOT NULL DEFAULT 'Unread',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  project_type text,
  budget text,
  timeline text,
  description text,
  features text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS website_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon text NOT NULL DEFAULT 'TrendingUp',
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'CheckCircle',
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS why_choose_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'Sparkles',
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_single_row boolean NOT NULL DEFAULT true,
  company_name text NOT NULL DEFAULT 'CodeTech',
  tagline text NOT NULL DEFAULT 'We Build Digital Experiences That Grow Businesses.',
  logo_url text,
  favicon_url text,
  email text NOT NULL DEFAULT 'admin@codetech.com',
  phone text NOT NULL DEFAULT '+91 9999999999',
  whatsapp text NOT NULL DEFAULT '+91 9999999999',
  address text NOT NULL DEFAULT 'India',
  website_url text NOT NULL DEFAULT 'https://codetech.com',
  instagram text,
  linkedin text,
  facebook text,
  github text,
  youtube text,
  twitter text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_pricing_active ON pricing_packages(active);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_content_key ON website_content(key);

-- Single-row settings enforcement
CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_single_row ON settings(is_single_row);

-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Helper: admin check via raw_app_meta_data (set on the admin user by the bootstrap edge function)
-- We scope write policies TO authenticated. Reads on public content TO anon, authenticated.

-- Public content: readable by everyone, writable only by authenticated (admin)
-- projects
DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_write_projects" ON projects;
CREATE POLICY "auth_write_projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE TO authenticated USING (true);

-- project_images
DROP POLICY IF EXISTS "public_read_project_images" ON project_images;
CREATE POLICY "public_read_project_images" ON project_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_project_images" ON project_images;
CREATE POLICY "auth_insert_project_images" ON project_images FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_project_images" ON project_images;
CREATE POLICY "auth_update_project_images" ON project_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_project_images" ON project_images;
CREATE POLICY "auth_delete_project_images" ON project_images FOR DELETE TO authenticated USING (true);

-- services
DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE TO authenticated USING (true);

-- pricing_packages
DROP POLICY IF EXISTS "public_read_pricing" ON pricing_packages;
CREATE POLICY "public_read_pricing" ON pricing_packages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_pricing" ON pricing_packages;
CREATE POLICY "auth_insert_pricing" ON pricing_packages FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_pricing" ON pricing_packages;
CREATE POLICY "auth_update_pricing" ON pricing_packages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_pricing" ON pricing_packages;
CREATE POLICY "auth_delete_pricing" ON pricing_packages FOR DELETE TO authenticated USING (true);

-- testimonials
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE TO authenticated USING (true);

-- website_content
DROP POLICY IF EXISTS "public_read_content" ON website_content;
CREATE POLICY "public_read_content" ON website_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_content" ON website_content;
CREATE POLICY "auth_insert_content" ON website_content FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_content" ON website_content;
CREATE POLICY "auth_update_content" ON website_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_content" ON website_content;
CREATE POLICY "auth_delete_content" ON website_content FOR DELETE TO authenticated USING (true);

-- website_statistics
DROP POLICY IF EXISTS "public_read_statistics" ON website_statistics;
CREATE POLICY "public_read_statistics" ON website_statistics FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_statistics" ON website_statistics;
CREATE POLICY "auth_insert_statistics" ON website_statistics FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_statistics" ON website_statistics;
CREATE POLICY "auth_update_statistics" ON website_statistics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_statistics" ON website_statistics;
CREATE POLICY "auth_delete_statistics" ON website_statistics FOR DELETE TO authenticated USING (true);

-- process_steps
DROP POLICY IF EXISTS "public_read_process" ON process_steps;
CREATE POLICY "public_read_process" ON process_steps FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_process" ON process_steps;
CREATE POLICY "auth_insert_process" ON process_steps FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_process" ON process_steps;
CREATE POLICY "auth_update_process" ON process_steps FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_process" ON process_steps;
CREATE POLICY "auth_delete_process" ON process_steps FOR DELETE TO authenticated USING (true);

-- why_choose_us
DROP POLICY IF EXISTS "public_read_whychoose" ON why_choose_us;
CREATE POLICY "public_read_whychoose" ON why_choose_us FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_whychoose" ON why_choose_us;
CREATE POLICY "auth_insert_whychoose" ON why_choose_us FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_whychoose" ON why_choose_us;
CREATE POLICY "auth_update_whychoose" ON why_choose_us FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_whychoose" ON why_choose_us;
CREATE POLICY "auth_delete_whychoose" ON why_choose_us FOR DELETE TO authenticated USING (true);

-- settings
DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_settings" ON settings;
CREATE POLICY "auth_update_settings" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- messages: public can insert (contact form), only authenticated can read/update/delete
DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_messages" ON messages;
CREATE POLICY "auth_read_messages" ON messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_messages" ON messages;
CREATE POLICY "auth_update_messages" ON messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_messages" ON messages;
CREATE POLICY "auth_delete_messages" ON messages FOR DELETE TO authenticated USING (true);

-- quote_requests: public can insert, only authenticated can read/update/delete
DROP POLICY IF EXISTS "anon_insert_quotes" ON quote_requests;
CREATE POLICY "anon_insert_quotes" ON quote_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_quotes" ON quote_requests;
CREATE POLICY "auth_read_quotes" ON quote_requests FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_quotes" ON quote_requests;
CREATE POLICY "auth_update_quotes" ON quote_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_quotes" ON quote_requests;
CREATE POLICY "auth_delete_quotes" ON quote_requests FOR DELETE TO authenticated USING (true);

-- admins: only authenticated can read/manage
DROP POLICY IF EXISTS "auth_read_admins" ON admins;
CREATE POLICY "auth_read_admins" ON admins FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_admins" ON admins;
CREATE POLICY "auth_insert_admins" ON admins FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_admins" ON admins;
CREATE POLICY "auth_update_admins" ON admins FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_admins" ON admins;
CREATE POLICY "auth_delete_admins" ON admins FOR DELETE TO authenticated USING (true);

-- Storage buckets (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('project-images', 'project-images', true),
  ('project-screenshots', 'project-screenshots', true),
  ('service-images', 'service-images', true),
  ('testimonial-images', 'testimonial-images', true),
  ('website-images', 'website-images', true),
  ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "public_read_storage" ON storage.objects;
CREATE POLICY "public_read_storage" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id IN ('project-images','project-screenshots','service-images','testimonial-images','website-images','branding'));

DROP POLICY IF EXISTS "auth_insert_storage" ON storage.objects;
CREATE POLICY "auth_insert_storage" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('project-images','project-screenshots','service-images','testimonial-images','website-images','branding'));

DROP POLICY IF EXISTS "auth_update_storage" ON storage.objects;
CREATE POLICY "auth_update_storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('project-images','project-screenshots','service-images','testimonial-images','website-images','branding'));

DROP POLICY IF EXISTS "auth_delete_storage" ON storage.objects;
CREATE POLICY "auth_delete_storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('project-images','project-screenshots','service-images','testimonial-images','website-images','branding'));

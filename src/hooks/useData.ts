import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type {
  Project, ProjectImage, Service, PricingPackage, Testimonial,
  Message, QuoteRequest, WebsiteContentEntry, WebsiteStatistic,
  ProcessStep, WhyChooseItem, Settings,
} from '@/types';

export const qk = {
  projects: ['projects'] as const,
  project: (id: string) => ['project', id] as const,
  projectSlug: (slug: string) => ['project-slug', slug] as const,
  projectImages: (pid: string) => ['project-images', pid] as const,
  services: ['services'] as const,
  pricing: ['pricing'] as const,
  testimonials: ['testimonials'] as const,
  messages: ['messages'] as const,
  quotes: ['quotes'] as const,
  content: ['content'] as const,
  contentKey: (key: string) => ['content', key] as const,
  statistics: ['statistics'] as const,
  process: ['process'] as const,
  whyChoose: ['why-choose'] as const,
  settings: ['settings'] as const,
  dashStats: ['dash-stats'] as const,
};

// ─── Projects ───
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: qk.projects,
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('display_order').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: qk.project(id),
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Project not found');
      return data;
    },
    enabled: !!id,
  });
}

export function useProjectBySlug(slug: string | undefined) {
  return useQuery<Project & { images: ProjectImage[] }>({
    queryKey: qk.projectSlug(slug ?? ''),
    queryFn: async () => {
      const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
      if (error) throw error;
      if (!project) throw new Error('Project not found');
      const { data: images } = await supabase.from('project_images').select('*').eq('project_id', project.id).order('display_order');
      return { ...project, images: images ?? [] };
    },
    enabled: !!slug,
  });
}

export function useProjectImages(projectId: string) {
  return useQuery<ProjectImage[]>({
    queryKey: qk.projectImages(projectId),
    queryFn: async () => {
      const { data, error } = await supabase.from('project_images').select('*').eq('project_id', projectId).order('display_order');
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
  });
}

export function useSaveProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Partial<Project> & { id?: string }) => {
      if (p.id) {
        const { data, error } = await supabase.from('projects').update({ ...p, updated_at: new Date().toISOString() }).eq('id', p.id).select().single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase.from('projects').insert(p).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.projects }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('projects').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.projects }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

export function useSaveProjectImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (img: Partial<ProjectImage> & { project_id: string }) => {
      const { data, error } = await supabase.from('project_images').insert(img).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => qc.invalidateQueries({ queryKey: qk.projectImages(data.project_id) }),
  });
}

export function useDeleteProjectImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (img: ProjectImage) => { const { error } = await supabase.from('project_images').delete().eq('id', img.id); if (error) throw error; return img; },
    onSuccess: (img) => qc.invalidateQueries({ queryKey: qk.projectImages(img.project_id) }),
  });
}

// ─── Services ───
export function useServices() {
  return useQuery<Service[]>({
    queryKey: qk.services,
    queryFn: async () => { const { data, error } = await supabase.from('services').select('*').order('display_order'); if (error) throw error; return data ?? []; },
  });
}

export function useSaveService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Partial<Service> & { id?: string }) => {
      if (s.id) { const { data, error } = await supabase.from('services').update({ ...s, updated_at: new Date().toISOString() }).eq('id', s.id).select().single(); if (error) throw error; return data; }
      const { data, error } = await supabase.from('services').insert(s).select().single(); if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.services }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('services').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.services }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

// ─── Pricing ───
export function usePricing() {
  return useQuery<PricingPackage[]>({
    queryKey: qk.pricing,
    queryFn: async () => { const { data, error } = await supabase.from('pricing_packages').select('*').order('display_order'); if (error) throw error; return data ?? []; },
  });
}

export function useSavePricing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Partial<PricingPackage> & { id?: string }) => {
      if (p.id) { const { data, error } = await supabase.from('pricing_packages').update({ ...p, updated_at: new Date().toISOString() }).eq('id', p.id).select().single(); if (error) throw error; return data; }
      const { data, error } = await supabase.from('pricing_packages').insert(p).select().single(); if (error) throw error; return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.pricing }),
  });
}

export function useDeletePricing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('pricing_packages').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.pricing }),
  });
}

// ─── Testimonials ───
export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: qk.testimonials,
    queryFn: async () => { const { data, error } = await supabase.from('testimonials').select('*').order('display_order'); if (error) throw error; return data ?? []; },
  });
}

export function useSaveTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: Partial<Testimonial> & { id?: string }) => {
      if (t.id) { const { data, error } = await supabase.from('testimonials').update({ ...t, updated_at: new Date().toISOString() }).eq('id', t.id).select().single(); if (error) throw error; return data; }
      const { data, error } = await supabase.from('testimonials').insert(t).select().single(); if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.testimonials }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('testimonials').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.testimonials }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

// ─── Messages ───
export function useMessages() {
  return useQuery<Message[]>({
    queryKey: qk.messages,
    queryFn: async () => { const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false }); if (error) throw error; return data ?? []; },
  });
}

export function useUpdateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Message> & { id: string }) => {
      const { data, error } = await supabase.from('messages').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.messages }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('messages').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.messages }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

export function useCreateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: Partial<Message>) => { const { data, error } = await supabase.from('messages').insert(m).select().single(); if (error) throw error; return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.messages }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

// ─── Quotes ───
export function useQuotes() {
  return useQuery<QuoteRequest[]>({
    queryKey: qk.quotes,
    queryFn: async () => { const { data, error } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false }); if (error) throw error; return data ?? []; },
  });
}

export function useUpdateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<QuoteRequest> & { id: string }) => {
      const { data, error } = await supabase.from('quote_requests').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.quotes }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

export function useDeleteQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('quote_requests').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.quotes }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

export function useCreateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: Partial<QuoteRequest>) => { const { data, error } = await supabase.from('quote_requests').insert(q).select().single(); if (error) throw error; return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.quotes }); qc.invalidateQueries({ queryKey: qk.dashStats }); },
  });
}

// ─── Website Content ───
export function useContent() {
  return useQuery<WebsiteContentEntry[]>({
    queryKey: qk.content,
    queryFn: async () => { const { data, error } = await supabase.from('website_content').select('*'); if (error) throw error; return data ?? []; },
  });
}

export function useContentKey(key: string) {
  return useQuery<Record<string, any>>({
    queryKey: qk.contentKey(key),
    queryFn: async () => { const { data, error } = await supabase.from('website_content').select('content').eq('key', key).maybeSingle(); if (error) throw error; return data?.content ?? {}; },
    enabled: !!key,
  });
}

export function useSaveContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, content }: { key: string; content: Record<string, any> }) => {
      const { data, error } = await supabase.from('website_content').upsert({ key, content, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.content }),
  });
}

// ─── Statistics ───
export function useStatistics() {
  return useQuery<WebsiteStatistic[]>({
    queryKey: qk.statistics,
    queryFn: async () => { const { data, error } = await supabase.from('website_statistics').select('*').order('display_order'); if (error) throw error; return data ?? []; },
  });
}

export function useSaveStatistic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Partial<WebsiteStatistic> & { id?: string }) => {
      if (s.id) { const { data, error } = await supabase.from('website_statistics').update({ ...s, updated_at: new Date().toISOString() }).eq('id', s.id).select().single(); if (error) throw error; return data; }
      const { data, error } = await supabase.from('website_statistics').insert(s).select().single(); if (error) throw error; return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.statistics }),
  });
}

export function useDeleteStatistic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('website_statistics').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.statistics }),
  });
}

// ─── Process Steps ───
export function useProcessSteps() {
  return useQuery<ProcessStep[]>({
    queryKey: qk.process,
    queryFn: async () => { const { data, error } = await supabase.from('process_steps').select('*').order('display_order'); if (error) throw error; return data ?? []; },
  });
}

export function useSaveProcessStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Partial<ProcessStep> & { id?: string }) => {
      if (s.id) { const { data, error } = await supabase.from('process_steps').update({ ...s, updated_at: new Date().toISOString() }).eq('id', s.id).select().single(); if (error) throw error; return data; }
      const { data, error } = await supabase.from('process_steps').insert(s).select().single(); if (error) throw error; return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.process }),
  });
}

export function useDeleteProcessStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('process_steps').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.process }),
  });
}

// ─── Why Choose Us ───
export function useWhyChoose() {
  return useQuery<WhyChooseItem[]>({
    queryKey: qk.whyChoose,
    queryFn: async () => { const { data, error } = await supabase.from('why_choose_us').select('*').order('display_order'); if (error) throw error; return data ?? []; },
  });
}

export function useSaveWhyChoose() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (w: Partial<WhyChooseItem> & { id?: string }) => {
      if (w.id) { const { data, error } = await supabase.from('why_choose_us').update({ ...w, updated_at: new Date().toISOString() }).eq('id', w.id).select().single(); if (error) throw error; return data; }
      const { data, error } = await supabase.from('why_choose_us').insert(w).select().single(); if (error) throw error; return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.whyChoose }),
  });
}

export function useDeleteWhyChoose() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('why_choose_us').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.whyChoose }),
  });
}

// ─── Settings ───
export function useSettings() {
  return useQuery<Settings>({
    queryKey: qk.settings,
    queryFn: async () => { const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle(); if (error) throw error; return data as Settings; },
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Partial<Settings>) => {
      const { data, error } = await supabase.from('settings').update({ ...s, updated_at: new Date().toISOString() }).eq('is_single_row', true).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.settings }),
  });
}

// ─── Dashboard Stats ───
export function useDashboardStats() {
  return useQuery({
    queryKey: qk.dashStats,
    queryFn: async () => {
      const [projects, services, messages, quotes, testimonials] = await Promise.all([
        supabase.from('projects').select('id, status'),
        supabase.from('services').select('id, active'),
        supabase.from('messages').select('id, status'),
        supabase.from('quote_requests').select('id, status'),
        supabase.from('testimonials').select('id, published'),
      ]);
      return {
        totalProjects: projects.data?.length ?? 0,
        activeProjects: projects.data?.filter((p) => p.status === 'In Development' || p.status === 'Maintenance').length ?? 0,
        completedProjects: projects.data?.filter((p) => p.status === 'Completed').length ?? 0,
        totalServices: services.data?.length ?? 0,
        totalMessages: messages.data?.length ?? 0,
        unreadMessages: messages.data?.filter((m) => m.status === 'Unread').length ?? 0,
        quoteRequests: quotes.data?.length ?? 0,
        newQuotes: quotes.data?.filter((q) => q.status === 'New').length ?? 0,
        totalTestimonials: testimonials.data?.length ?? 0,
      };
    },
  });
}

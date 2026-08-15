import { supabase } from './supabase';

const BUCKETS = [
  'project-images', 'project-screenshots', 'service-images',
  'testimonial-images', 'website-images', 'branding',
] as const;

type Bucket = (typeof BUCKETS)[number];

function getExtension(name: string) {
  const parts = name.split('.');
  return parts[parts.length - 1] || 'jpg';
}

export async function uploadImage(
  bucket: Bucket,
  file: File,
  pathPrefix: string = ''
): Promise<{ url: string; error: string | null }> {
  const ext = getExtension(file.name);
  const fileName = `${pathPrefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) return { url: '', error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

export async function deleteImage(bucket: Bucket, url: string): Promise<{ error: string | null }> {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/');
    const filePath = parts.slice(parts.indexOf(bucket) + 1).join('/');
    if (!filePath) return { error: 'Invalid URL' };
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    return { error: error?.message ?? null };
  } catch {
    return { error: 'Failed to delete image' };
  }
}

export function validateImageFile(file: File): string | null {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowed.includes(file.type)) return 'Only JPG, PNG, WebP, GIF, and SVG files are allowed.';
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) return 'Image must be smaller than 5MB.';
  return null;
}

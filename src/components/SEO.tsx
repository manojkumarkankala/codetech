import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const BASE_TITLE = 'CodeTech — We Build Digital Experiences That Grow Businesses';
const BASE_DESC = 'CodeTech creates modern websites, e-commerce platforms, real-estate portals, custom web applications and AI-powered solutions that help businesses grow online.';

export function SEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | CodeTech` : BASE_TITLE;
    const desc = description || BASE_DESC;
    document.title = fullTitle;
    setMeta('description', desc);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', desc, true);
    setMeta('og:type', 'website', true);
    if (image) setMeta('og:image', image, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    if (image) setMeta('twitter:image', image);
    if (url) { setMeta('og:url', url, true); setLink('canonical', url); }
  }, [title, description, image, url]);
  return null;
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

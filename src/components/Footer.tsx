import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Linkedin, Github, Youtube, Facebook, Twitter, ArrowUpRight } from 'lucide-react';
import { useSettings, useContentKey } from '@/hooks/useData';

export function Footer() {
  const { data: settings } = useSettings();
  const { data: footerContent } = useContentKey('footer');

  const socials = [
    { key: 'instagram', Icon: Instagram, url: settings?.instagram },
    { key: 'linkedin', Icon: Linkedin, url: settings?.linkedin },
    { key: 'github', Icon: Github, url: settings?.github },
    { key: 'youtube', Icon: Youtube, url: settings?.youtube },
    { key: 'facebook', Icon: Facebook, url: settings?.facebook },
    { key: 'twitter', Icon: Twitter, url: settings?.twitter },
  ].filter((s) => s.url);

  const companyName = settings?.company_name || 'CodeTech';
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50/80">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white"><span className="text-sm font-bold">C</span></div>
              <span className="text-lg font-bold text-navy-900">{companyName}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">{footerContent?.description || 'We build modern digital experiences for businesses, startups and professionals.'}</p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map(({ key, Icon, url }) => (
                  <a key={key} href={url as string} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-primary-300 hover:text-primary-600 hover:shadow-sm" aria-label={key}>
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-navy-900">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: 'Projects', to: '/projects' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-slate-500 transition-colors hover:text-primary-600">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-navy-900">Services</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {['Websites', 'E-Commerce', 'Real Estate', 'Web Applications', 'AI Solutions'].map((s) => (
                <li key={s}><Link to="/services" className="text-slate-500 transition-colors hover:text-primary-600">{s}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-navy-900">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {settings?.email && <li><a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-slate-500 transition-colors hover:text-primary-600"><Mail className="h-4 w-4 flex-shrink-0" /> {settings.email}</a></li>}
              {settings?.phone && <li><a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-slate-500 transition-colors hover:text-primary-600"><Phone className="h-4 w-4 flex-shrink-0" /> {settings.phone}</a></li>}
              {settings?.address && <li className="flex items-start gap-2 text-slate-500"><MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" /> {settings.address}</li>}
            </ul>
            <Link to="/quote" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">Get Free Quote <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© {year} {companyName}. All Rights Reserved.</p>
          <Link to="/admin/login" className="text-xs text-slate-400 transition-colors hover:text-slate-600">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useSettings } from '@/hooks/useData';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { data: settings } = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const companyName = settings?.company_name || 'CodeTech';

  return (
    <header className={cn('sticky top-0 z-50 w-full transition-all duration-300', scrolled ? 'glass border-b border-slate-200/70 shadow-sm' : 'bg-white/95 border-b border-transparent')}>
      <nav className="container-page flex h-16 items-center justify-between lg:h-18">
        <Link to="/" className="flex items-center gap-2.5">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={companyName} className="h-8 w-auto" />
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-sm">
                <span className="text-sm font-bold">C</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-navy-900">{companyName}</span>
            </>
          )}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
            return (
              <Link key={link.to} to={link.to} className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors', active ? 'text-primary-700 bg-primary-50' : 'text-navy-600 hover:text-primary-700 hover:bg-slate-50')}>
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Link to="/quote" className="btn-primary">Get Free Quote <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <button className="rounded-lg p-2 text-navy-700 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-slate-100 bg-white lg:hidden">
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
                return <Link key={link.to} to={link.to} className={cn('rounded-lg px-4 py-3 text-sm font-medium', active ? 'bg-primary-50 text-primary-700' : 'text-navy-700 hover:bg-slate-50')}>{link.label}</Link>;
              })}
              <Link to="/quote" className="btn-primary mt-2 w-full">Get Free Quote <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

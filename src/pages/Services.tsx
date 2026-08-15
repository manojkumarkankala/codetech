import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ServiceCard } from '@/components/ServiceCard';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { useServices } from '@/hooks/useData';

export default function Services() {
  const { data: services, isLoading, isError, refetch } = useServices();
  const active = (services || []).filter((s) => s.active);
  return (
    <>
      <SEO title="Services" description="CodeTech offers business websites, e-commerce, real estate portals, web applications, AI solutions, and more." />
      <section className="gradient-hero border-b border-slate-100">
        <div className="container-page py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-primary-50 text-primary-700">Our Services</span>
            <h1 className="mt-4 text-4xl font-bold text-navy-900 md:text-5xl">Digital Solutions for Every Business</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">We provide a comprehensive range of web development and digital services to help your business grow online.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-page">
          {isLoading ? <LoadingState message="Loading services..." /> : isError ? <ErrorState message="Unable to load services." onRetry={() => refetch()} /> : active.length === 0 ? <div className="text-center py-20 text-slate-500">No services available yet.</div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{active.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}</div>}
        </div>
      </section>
      <section className="section-padding bg-slate-50/60">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-navy-900">Not Sure Which Service You Need?</h2>
            <p className="mt-4 text-slate-600">Get a free consultation. Tell us about your project and we'll recommend the best approach.</p>
            <Link to="/quote" className="btn-primary mt-6">Get Free Quote <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

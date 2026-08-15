import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { PricingCard } from '@/components/PricingCard';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { usePricing } from '@/hooks/useData';

export default function Pricing() {
  const { data: pricing, isLoading, isError, refetch } = usePricing();
  const active = (pricing || []).filter((p) => p.active);
  return (
    <>
      <SEO title="Pricing" description="Transparent pricing for websites, e-commerce, web apps, and AI solutions. Choose the package that fits your business." />
      <section className="gradient-hero border-b border-slate-100">
        <div className="container-page py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-primary-50 text-primary-700">Pricing</span>
            <h1 className="mt-4 text-4xl font-bold text-navy-900 md:text-5xl">Simple, Transparent Pricing</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">Choose the package that's right for your business. All prices are one-time, with no hidden fees.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-page">
          {isLoading ? <LoadingState message="Loading pricing packages..." /> : isError ? <ErrorState message="Unable to load pricing." onRetry={() => refetch()} /> : active.length === 0 ? <div className="text-center py-20 text-slate-500">No pricing packages available yet.</div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{active.map((p, i) => <PricingCard key={p.id} pkg={p} index={i} />)}</div>}
        </div>
      </section>
      <section className="section-padding bg-slate-50/60">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-bold text-navy-900">Need a Custom Solution?</h2><p className="mt-4 text-slate-600">Every business is unique. Tell us about your project and we'll create a tailored quote for you.</p><Link to="/quote" className="btn-primary mt-6">Get Custom Quote <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </>
  );
}

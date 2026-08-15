import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { TestimonialCard } from '@/components/TestimonialCard';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { useTestimonials } from '@/hooks/useData';

export default function Testimonials() {
  const { data: testimonials, isLoading, isError, refetch } = useTestimonials();
  const published = (testimonials || []).filter((t) => t.published);
  return (
    <>
      <SEO title="Testimonials" description="Read what our clients say about working with CodeTech." />
      <section className="gradient-hero border-b border-slate-100">
        <div className="container-page py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-amber-50 text-amber-700">Testimonials</span>
            <h1 className="mt-4 text-4xl font-bold text-navy-900 md:text-5xl">What Our Clients Say</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">We've helped 180+ clients achieve their digital goals. Here's what some of them have to say.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-page">
          {isLoading ? <LoadingState message="Loading testimonials..." /> : isError ? <ErrorState message="Unable to load testimonials." onRetry={() => refetch()} /> : published.length === 0 ? <div className="text-center py-20 text-slate-500">No testimonials available yet.</div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{published.map((t, i) => <TestimonialCard key={t.id} testimonial={t} index={i} />)}</div>}
        </div>
      </section>
    </>
  );
}

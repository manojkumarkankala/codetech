import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { ProjectCard } from '@/components/ProjectCard';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useProjects } from '@/hooks/useData';
import { PROJECT_CATEGORIES } from '@/types';

export default function Projects() {
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const [filter, setFilter] = useState('All');
  const published = useMemo(() => (projects || []).filter((p) => p.published), [projects]);
  const categories = useMemo(() => { const cats = new Set(published.map((p) => p.category)); return ['All', ...PROJECT_CATEGORIES.filter((c) => cats.has(c))]; }, [published]);
  const filtered = filter === 'All' ? published : published.filter((p) => p.category === filter);

  return (
    <>
      <SEO title="Projects" description="Explore CodeTech's portfolio of web development, e-commerce, AI, and real estate projects." />
      <section className="gradient-hero border-b border-slate-100">
        <div className="container-page py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-primary-50 text-primary-700">Portfolio</span>
            <h1 className="mt-4 text-4xl font-bold text-navy-900 md:text-5xl">Our Recent Work</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">Browse our portfolio of successful projects delivered for clients across industries.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => <button key={cat} onClick={() => setFilter(cat)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filter === cat ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-navy-600 border border-slate-200 hover:border-primary-300 hover:text-primary-700'}`}>{cat}</button>)}
          </div>
          {isLoading ? <LoadingState message="Loading projects..." /> : isError ? <ErrorState message="Unable to load projects." onRetry={() => refetch()} /> : filtered.length === 0 ? <EmptyState title="No Projects Available" description="Projects will appear here once they are added." /> : <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}</motion.div>}
        </div>
      </section>
    </>
  );
}

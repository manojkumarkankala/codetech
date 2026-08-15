import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, User, Tag, CheckCircle, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { useProjectBySlug } from '@/hooks/useData';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useProjectBySlug(slug);

  if (isLoading) return <><SEO title="Project" /><LoadingState message="Loading project..." /></>;
  if (isError || !project) return <><SEO title="Project Not Found" /><div className="container-page py-20"><ErrorState message="Project not found." /></div></>;

  const features = project.features ? project.features.split('\n').filter(Boolean) : [];

  return (
    <>
      <SEO title={project.title} description={project.short_description || project.description || ''} image={project.cover_image || undefined} />
      <section className="gradient-hero border-b border-slate-100">
        <div className="container-page py-12 md:py-16">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600"><ArrowLeft className="h-4 w-4" /> Back to Projects</Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="badge bg-primary-50 text-primary-700">{project.category}</span>
              <h1 className="mt-4 text-3xl font-bold text-navy-900 md:text-4xl">{project.title}</h1>
              <p className="mt-4 text-lg text-slate-600">{project.short_description}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary">Visit Website <ExternalLink className="h-4 w-4" /></a>}
                {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary"><Github className="h-4 w-4" /> View Code</a>}
                {project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">Live Demo <ExternalLink className="h-4 w-4" /></a>}
              </div>
            </div>
            <div className="card p-6 space-y-4">
              {project.show_price && project.price && <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span className="text-sm text-slate-500">Project Value</span><span className="text-lg font-bold text-primary-700">{formatCurrency(project.price, project.currency)}</span></div>}
              {project.client_name && <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-slate-400" /><span className="text-slate-500">Client:</span><span className="font-medium text-navy-900">{project.client_name}</span></div>}
              <div className="flex items-center gap-2 text-sm"><Tag className="h-4 w-4 text-slate-400" /><span className="text-slate-500">Status:</span><span className="badge bg-emerald-50 text-emerald-700">{project.status}</span></div>
              {project.completion_date && <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-slate-400" /><span className="text-slate-500">Completed:</span><span className="font-medium text-navy-900">{formatDate(project.completion_date)}</span></div>}
            </div>
          </div>
        </div>
      </section>

      {project.cover_image && (
        <section className="container-page -mt-8 relative z-10">
          <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} src={project.cover_image} alt={project.title} className="w-full rounded-2xl border border-slate-200 shadow-soft" />
        </section>
      )}

      <section className="section-padding">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {project.description && <div><h2 className="text-2xl font-bold text-navy-900">Overview</h2><p className="mt-4 leading-relaxed text-slate-600 whitespace-pre-line">{project.description}</p></div>}
            {project.problem && <div className="card p-6"><h3 className="text-lg font-bold text-navy-900">The Problem</h3><p className="mt-3 leading-relaxed text-slate-600 whitespace-pre-line">{project.problem}</p></div>}
            {project.solution && <div className="card p-6"><h3 className="text-lg font-bold text-navy-900">The Solution</h3><p className="mt-3 leading-relaxed text-slate-600 whitespace-pre-line">{project.solution}</p></div>}
            {features.length > 0 && <div><h3 className="text-lg font-bold text-navy-900">Key Features</h3><ul className="mt-4 grid gap-3 sm:grid-cols-2">{features.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" /> {f}</li>)}</ul></div>}
            {project.results && <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 p-6"><h3 className="text-lg font-bold text-navy-900">Results</h3><p className="mt-3 leading-relaxed text-slate-600 whitespace-pre-line">{project.results}</p></div>}
            {project.challenges && <div><h3 className="text-lg font-bold text-navy-900">Challenges</h3><p className="mt-3 leading-relaxed text-slate-600 whitespace-pre-line">{project.challenges}</p></div>}
            {project.images && project.images.length > 0 && <div><h3 className="text-lg font-bold text-navy-900">Screenshots</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{project.images.map((img) => <motion.img key={img.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} src={img.image_url} alt={img.caption || project.title} className="w-full rounded-xl border border-slate-200 shadow-sm" loading="lazy" />)}</div></div>}
          </div>
          <div className="space-y-6">
            {project.technologies.length > 0 && <div className="card p-6"><h3 className="font-bold text-navy-900">Technologies</h3><div className="mt-4 flex flex-wrap gap-2">{project.technologies.map((tech) => <span key={tech} className="badge bg-primary-50 text-primary-700">{tech}</span>)}</div></div>}
            <div className="card p-6"><h3 className="font-bold text-navy-900">Interested in a Similar Project?</h3><p className="mt-2 text-sm text-slate-500">Get a free quote tailored to your needs.</p><Link to="/quote" className="btn-primary mt-4 w-full">Get Free Quote <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>
    </>
  );
}

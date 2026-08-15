import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, CheckCircle, FolderKanban } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import type { Project } from '@/types';
import { formatCurrency, truncate } from '@/lib/utils';

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: index * 0.05 }} className="card card-hover group flex flex-col overflow-hidden">
      <Link to={`/projects/${project.slug}`} className="relative block h-52 overflow-hidden bg-slate-100">
        {project.cover_image ? (
          <img src={project.cover_image} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50"><FolderKanban className="h-12 w-12 text-primary-300" /></div>
        )}
        <div className="absolute left-3 top-3"><span className="badge bg-white/90 text-primary-700 backdrop-blur-sm">{project.category}</span></div>
        {project.featured && <div className="absolute right-3 top-3"><span className="badge bg-amber-100 text-amber-700">Featured</span></div>}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-primary-700">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{truncate(project.short_description || project.description || '', 100)}</p>

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => <span key={tech} className="badge bg-slate-100 text-slate-600">{tech}</span>)}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            {project.show_price && project.price ? (
              <span className="text-sm font-bold text-primary-700">{formatCurrency(project.price, project.currency)}</span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle className="h-3.5 w-3.5" /> {project.status}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-colors hover:text-primary-600" aria-label="Live demo"><ExternalLink className="h-4 w-4" /></a>}
            <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

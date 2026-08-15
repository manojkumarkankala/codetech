import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles, Code, Zap, ShieldCheck } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ProjectCard } from '@/components/ProjectCard';
import { ServiceCard } from '@/components/ServiceCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { LoadingState } from '@/components/ui/States';
import { useProjects, useServices, useTestimonials, useStatistics, useContentKey, useWhyChoose, useProcessSteps } from '@/hooks/useData';
import { getIcon } from '@/lib/icons';

export default function Home() {
  const { data: heroContent } = useContentKey('hero');
  const { data: ctaContent } = useContentKey('cta');
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: testimonials } = useTestimonials();
  const { data: stats } = useStatistics();
  const { data: whyChoose } = useWhyChoose();
  const { data: processSteps } = useProcessSteps();

  const publishedProjects = (projects || []).filter((p) => p.published).slice(0, 6);
  const activeServices = (services || []).filter((s) => s.active).slice(0, 8);
  const publishedTestimonials = (testimonials || []).filter((t) => t.published).slice(0, 3);
  const activeStats = (stats || []).filter((s) => s.active);
  const activeWhy = (whyChoose || []).filter((w) => w.active).slice(0, 6);
  const activeSteps = (processSteps || []).filter((s) => s.active);

  const hero = {
    badge: heroContent?.badge || 'Premium Web Development Agency',
    heading: heroContent?.heading || 'Build Your Digital Future With CodeTech',
    description: heroContent?.description || 'CodeTech creates modern websites, e-commerce platforms, real-estate portals, custom web applications and AI-powered solutions that help businesses grow online.',
    primaryText: heroContent?.primary_button_text || 'Get Free Quote',
    primaryLink: heroContent?.primary_button_link || '/quote',
    secondaryText: heroContent?.secondary_button_text || 'View Our Projects',
    secondaryLink: heroContent?.secondary_button_link || '/projects',
  };

  return (
    <>
      <SEO />
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container-page py-20 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="badge bg-primary-50 text-primary-700"><Sparkles className="h-3.5 w-3.5" /> {hero.badge}</span>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-balance text-navy-900 md:text-5xl lg:text-6xl">{hero.heading}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{hero.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to={hero.primaryLink} className="btn-primary text-base">{hero.primaryText} <ArrowRight className="h-5 w-5" /></Link>
                <Link to={hero.secondaryLink} className="btn-secondary text-base">{hero.secondaryText}</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle className="h-5 w-5 text-emerald-500" /> 250+ Projects Delivered</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Zap className="h-5 w-5 text-amber-500" /> Fast Delivery</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><ShieldCheck className="h-5 w-5 text-primary-500" /> Secure & Reliable</div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              {heroContent?.image_url ? (
                <img src={heroContent.image_url} alt="CodeTech" className="rounded-3xl shadow-soft" />
              ) : (
                <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-br from-primary-50 via-white to-accent-50 p-8 shadow-soft">
                  <div className="grid grid-cols-2 gap-4">
                    {[{ icon: Code, label: 'Web Development', color: 'from-primary-500 to-primary-600' }, { icon: Zap, label: 'Fast Performance', color: 'from-amber-400 to-orange-500' }, { icon: ShieldCheck, label: 'Secure Code', color: 'from-emerald-400 to-teal-500' }, { icon: Sparkles, label: 'Modern Design', color: 'from-accent-400 to-cyan-500' }].map((item, i) => (
                      <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 shadow-card">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white`}><item.icon className="h-5 w-5" /></div>
                        <span className="text-xs font-semibold text-navy-700">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl bg-navy-900 p-4 text-white">
                    <div className="flex items-center gap-2"><div className="flex gap-1.5"><div className="h-2 w-2 rounded-full bg-red-400" /><div className="h-2 w-2 rounded-full bg-amber-400" /><div className="h-2 w-2 rounded-full bg-emerald-400" /></div><span className="ml-2 text-xs text-slate-400">codetech.dev</span></div>
                    <div className="mt-3 space-y-1.5"><div className="h-2 w-3/4 rounded bg-slate-700" /><div className="h-2 w-1/2 rounded bg-slate-700" /><div className="h-2 w-2/3 rounded bg-primary-500" /></div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      {activeStats.length > 0 && (
        <section className="border-y border-slate-100 bg-slate-50/60">
          <div className="container-page py-12">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {activeStats.map((stat, i) => {
                const Icon = getIcon(stat.icon);
                return (
                  <motion.div key={stat.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-6 w-6" /></div>
                    <p className="mt-3 text-3xl font-bold text-navy-900">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-primary-50 text-primary-700">Our Services</span>
            <h2 className="mt-4 text-3xl font-bold text-navy-900 md:text-4xl">Everything You Need to Succeed Online</h2>
            <p className="mt-4 text-slate-600">From business websites to AI-powered applications, we deliver solutions that drive real results.</p>
          </div>
          {servicesLoading ? <LoadingState message="Loading services..." /> : <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{activeServices.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}</div>}
          <div className="mt-10 text-center"><Link to="/services" className="btn-secondary">View All Services <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      {/* Why Choose Us */}
      {activeWhy.length > 0 && (
        <section className="section-padding bg-slate-50/60">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center"><span className="badge bg-accent-50 text-accent-700">Why CodeTech</span><h2 className="mt-4 text-3xl font-bold text-navy-900 md:text-4xl">Why Businesses Choose Us</h2><p className="mt-4 text-slate-600">We combine technical expertise with creative excellence to deliver outstanding results.</p></div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeWhy.map((item, i) => {
                const Icon = getIcon(item.icon);
                return <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card flex gap-4 p-6"><div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white"><Icon className="h-5 w-5" /></div><div><h3 className="font-bold text-navy-900">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.description}</p></div></motion.div>;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="section-padding">
        <div className="container-page">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl"><span className="badge bg-primary-50 text-primary-700">Our Work</span><h2 className="mt-4 text-3xl font-bold text-navy-900 md:text-4xl">Featured Projects</h2><p className="mt-4 text-slate-600">Explore some of our recent work and see how we help businesses grow.</p></div>
            <Link to="/projects" className="btn-secondary flex-shrink-0">View All <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {projectsLoading ? <LoadingState message="Loading projects..." /> : <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{publishedProjects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}</div>}
        </div>
      </section>

      {/* Process */}
      {activeSteps.length > 0 && (
        <section className="section-padding bg-slate-50/60">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center"><span className="badge bg-primary-50 text-primary-700">Our Process</span><h2 className="mt-4 text-3xl font-bold text-navy-900 md:text-4xl">How We Work</h2><p className="mt-4 text-slate-600">A proven process that delivers exceptional results, every time.</p></div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {activeSteps.map((step, i) => {
                const Icon = getIcon(step.icon);
                return <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card relative p-6"><span className="absolute right-5 top-4 text-5xl font-bold text-primary-100">{i + 1}</span><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-6 w-6" /></div><h3 className="mt-4 font-bold text-navy-900">{step.title}</h3><p className="mt-2 text-sm text-slate-500">{step.description}</p></motion.div>;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {publishedTestimonials.length > 0 && (
        <section className="section-padding">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center"><span className="badge bg-amber-50 text-amber-700">Testimonials</span><h2 className="mt-4 text-3xl font-bold text-navy-900 md:text-4xl">What Our Clients Say</h2><p className="mt-4 text-slate-600">Don't just take our word for it. Here's what our clients have to say.</p></div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">{publishedTestimonials.map((t, i) => <TestimonialCard key={t.id} testimonial={t} index={i} />)}</div>
          </div>
        </section>
      )}

      {/* CTA */}
      {ctaContent && (
        <section className="section-padding">
          <div className="container-page">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 p-10 text-center md:p-16">
              <div className="absolute inset-0 opacity-10"><div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white blur-3xl" /><div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-white blur-3xl" /></div>
              <div className="relative">
                <h2 className="text-3xl font-bold text-white md:text-4xl">{ctaContent.heading || 'Ready to Build Something Amazing?'}</h2>
                <p className="mx-auto mt-4 max-w-xl text-primary-50">{ctaContent.description}</p>
                <Link to={ctaContent.button_link || '/quote'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:bg-primary-50 hover:shadow-xl">{ctaContent.button_text || 'Get Free Quote'} <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Lightbulb, Heart, Award } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useContentKey, useStatistics, useWhyChoose } from '@/hooks/useData';
import { getIcon } from '@/lib/icons';

export default function About() {
  const { data: about } = useContentKey('about');
  const { data: stats } = useStatistics();
  const { data: whyChoose } = useWhyChoose();
  const activeStats = (stats || []).filter((s) => s.active);
  const activeWhy = (whyChoose || []).filter((w) => w.active);
  const values = [
    { icon: Target, title: 'Our Mission', text: about?.mission || 'To empower businesses with cutting-edge digital experiences that drive measurable growth.' },
    { icon: Lightbulb, title: 'Our Vision', text: about?.vision || 'To be the most trusted partner for businesses seeking to transform their digital presence.' },
    { icon: Heart, title: 'Our Values', text: about?.values || 'Quality, Innovation, Reliability, and Client Success in everything we do.' },
  ];

  return (
    <>
      <SEO title="About" description="Learn about CodeTech — our mission, vision, and values. We build digital experiences that grow businesses." />
      <section className="gradient-hero border-b border-slate-100">
        <div className="container-page py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="badge bg-primary-50 text-primary-700">About Us</span>
              <h1 className="mt-4 text-4xl font-bold text-navy-900 md:text-5xl">{about?.company_name || 'CodeTech'}</h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">{about?.description || 'CodeTech is a professional freelance web-development and digital solutions company dedicated to building modern, high-performance websites and applications that help businesses grow online.'}</p>
              <Link to="/quote" className="btn-primary mt-8">Start Your Project <ArrowRight className="h-4 w-4" /></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              {about?.image_url ? <img src={about.image_url} alt="CodeTech" className="rounded-3xl shadow-soft" /> : <div className="flex items-center justify-center rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 p-12"><Award className="h-32 w-32 text-primary-300" /></div>}
            </motion.div>
          </div>
        </div>
      </section>

      {activeStats.length > 0 && (
        <section className="border-b border-slate-100 bg-slate-50/60">
          <div className="container-page py-12">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {activeStats.map((stat, i) => { const Icon = getIcon(stat.icon); return <motion.div key={stat.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-6 w-6" /></div><p className="mt-3 text-3xl font-bold text-navy-900">{stat.value}</p><p className="mt-1 text-sm text-slate-500">{stat.label}</p></motion.div>; })}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center"><span className="badge bg-primary-50 text-primary-700">Our Principles</span><h2 className="mt-4 text-3xl font-bold text-navy-900 md:text-4xl">What Drives Us Forward</h2></div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((v, i) => <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white"><v.icon className="h-7 w-7" /></div><h3 className="mt-5 text-lg font-bold text-navy-900">{v.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-500">{v.text}</p></motion.div>)}
          </div>
        </div>
      </section>

      {activeWhy.length > 0 && (
        <section className="section-padding bg-slate-50/60">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center"><span className="badge bg-accent-50 text-accent-700">Why Choose Us</span><h2 className="mt-4 text-3xl font-bold text-navy-900 md:text-4xl">The CodeTech Advantage</h2></div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activeWhy.map((item, i) => { const Icon = getIcon(item.icon); return <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-bold text-navy-900">{item.title}</h3><p className="mt-2 text-sm text-slate-500">{item.description}</p></motion.div>; })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

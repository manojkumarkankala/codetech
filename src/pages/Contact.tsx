import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ContactForm } from '@/components/ContactForm';
import { useSettings, useContentKey } from '@/hooks/useData';
import { getWhatsAppLink } from '@/lib/utils';

export default function Contact() {
  const { data: settings } = useSettings();
  const { data: contactContent } = useContentKey('contact');
  const cards = [
    { icon: Mail, label: 'Email', value: settings?.email, href: settings?.email ? `mailto:${settings.email}` : undefined },
    { icon: Phone, label: 'Phone', value: settings?.phone, href: settings?.phone ? `tel:${settings.phone}` : undefined },
    { icon: MessageCircle, label: 'WhatsApp', value: settings?.whatsapp, href: settings?.whatsapp ? getWhatsAppLink(settings.whatsapp, 'Hello CodeTech, I have a project inquiry.') : undefined },
    { icon: MapPin, label: 'Address', value: settings?.address, href: undefined },
  ].filter((c) => c.value);

  return (
    <>
      <SEO title="Contact" description="Get in touch with CodeTech for your web development project. We respond within 24 hours." />
      <section className="gradient-hero border-b border-slate-100">
        <div className="container-page py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-primary-50 text-primary-700">Contact Us</span>
            <h1 className="mt-4 text-4xl font-bold text-navy-900 md:text-5xl">{contactContent?.heading || "Let's Start a Conversation"}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">{contactContent?.description || 'Tell us about your project and we will get back to you within 24 hours.'}</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="space-y-4">
            {cards.map((c) => <div key={c.label} className="card flex items-center gap-4 p-5"><div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><c.icon className="h-5 w-5" /></div><div><p className="text-xs font-medium text-slate-400">{c.label}</p>{c.href ? <a href={c.href} className="text-sm font-semibold text-navy-900 hover:text-primary-600">{c.value}</a> : <p className="text-sm font-semibold text-navy-900">{c.value}</p>}</div></div>)}
          </div>
          <div className="lg:col-span-2"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}

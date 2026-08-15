import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types';

export function TestimonialCard({ testimonial, index = 0 }: { testimonial: Testimonial; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: index * 0.05 }} className="card card-hover flex flex-col p-6">
      <Quote className="h-8 w-8 text-primary-200" />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">"{testimonial.review}"</p>
      <div className="mt-5 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        {testimonial.profile_image ? (
          <img src={testimonial.profile_image} alt={testimonial.client_name} className="h-11 w-11 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white">{testimonial.client_name.charAt(0)}</div>
        )}
        <div>
          <p className="text-sm font-semibold text-navy-900">{testimonial.client_name}</p>
          {(testimonial.role || testimonial.company) && <p className="text-xs text-slate-500">{[testimonial.role, testimonial.company].filter(Boolean).join(', ')}</p>}
        </div>
      </div>
    </motion.div>
  );
}

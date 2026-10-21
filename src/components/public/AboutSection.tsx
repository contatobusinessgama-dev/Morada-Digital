import React from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, ShieldCheck, Smile, Sparkles, Award, MapPin, Phone, Users } from 'lucide-react';
import { SHALOM_BRAND } from '../../data/mockDatabase';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Paz',
      desc: 'Tranquilidade e segurança em cada negociação, do primeiro contato à entrega das chaves na mão. Sem estresse e com serenidade.',
      icon: HeartHandshake,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    },
    {
      num: '02',
      title: 'Integridade',
      desc: 'Honestidade e transparência em todos os processos. Due diligence rigorosa, sem surpresas e sem letras miúdas.',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      num: '03',
      title: 'Bem-estar',
      desc: 'Wellness Real Estate: imóveis com iluminação natural, biofilia, silêncio e espaço para sua família viver momentos inesquecíveis.',
      icon: Smile,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      num: '04',
      title: 'Harmonia',
      desc: 'Construímos relações duradouras baseadas em respeito mútuo e propósito ético, transformando clientes em amigos.',
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    }
  ];

  return (
    <section id="sobre" className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Ambient background aura */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-teal-400" /> Lançamento Oficial • Inovação e Propósito
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white leading-tight">
              Mais que imóveis, conectamos famílias aos seus <span className="teal-gradient-text">lares em paz.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              A <strong>Morada Digital</strong> é uma plataforma moderna concebida para transformar e desburocratizar a experiência de comprar, vender e alugar imóveis. Nascemos com tecnologia ágil aliada a um atendimento ético e humanizado, garantindo segurança jurídica plena, integridade, bem-estar e harmonia em cada etapa.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <MapPin className="w-4 h-4 text-teal-400" /> {SHALOM_BRAND.address}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Phone className="w-4 h-4 text-teal-400" /> {SHALOM_BRAND.phone}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Ambiente harmonioso Morada Digital"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white">
                <span className="text-xs font-serif font-bold text-teal-300 block mb-0.5">
                  "Onde a tranquilidade encontra o seu novo endereço."
                </span>
                <span className="text-[11px] text-slate-400">
                  Assessoria imobiliária humanizada e jurídica integral.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-slate-950/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-teal-500/50 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-600 group-hover:text-teal-400 transition-colors">
                      {pillar.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-white mb-2 group-hover:text-teal-300 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-bold text-teal-400 opacity-80 group-hover:opacity-100">
                  <span>Pilar Morada Digital</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

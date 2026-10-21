import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Phone } from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyType } from '../../types';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'anuncie' | 'especialista';
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, mode = 'anuncie' }) => {
  const { addLead } = useRealEstate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartamento');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addLead({
      name,
      email,
      phone,
      interestType: 'venda',
      preferredNeighborhoods: neighborhood ? [neighborhood] : ['Jardins'],
      preferredPropertyTypes: [propertyType],
      budgetMax: Number(estimatedValue) || 3000000,
      stage: 'novo',
      origin: 'site_direto',
      notes: mode === 'anuncie' 
        ? `Proprietário deseja anunciar imóvel: Tipo ${propertyType}, Bairro ${neighborhood}, Valor estimado R$ ${estimatedValue}. Obs: ${notes}`
        : `Interessado em consultoria personalizada de investimentos: Bairro ${neighborhood}, Faixa R$ ${estimatedValue}. Obs: ${notes}`
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {mode === 'anuncie' ? 'Anuncie com a Morada Digital' : 'Consultoria Exclusiva'}
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {mode === 'anuncie' ? 'Venda ou Alugue seu Imóvel com Alta Liquidez' : 'Encontre o Imóvel dos Seus Sonhos'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'anuncie' 
                ? 'Fotografia profissional, divulgação nos maiores portais do Brasil e assessoria jurídica integral.'
                : 'Nossos corretores especialistas selecionam as melhores opções fora do radar.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Solicitação Recebida com Sucesso!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Sua mensagem já foi registrada em nosso CRM. Um dos nossos especialistas entrará em contato via WhatsApp nos próximos minutos.
            </p>
            <button
              onClick={onClose}
              className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Seu Nome Completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Carlos Drummond"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Imóvel</label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="apartamento">Apartamento</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="casa">Casa de Bairro</option>
                  <option value="casa_condominio">Casa em Condomínio</option>
                  <option value="studio">Studio</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro / Região</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  placeholder="Ex: Jardins, Itaim Bibi"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mode === 'anuncie' ? 'Preço Estimado de Venda ou Aluguel (R$)' : 'Orçamento Disponível (R$)'}
              </label>
              <input
                type="number"
                value={estimatedValue}
                onChange={e => setEstimatedValue(e.target.value)}
                placeholder="Ex: 3500000"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detalhes Adicionais</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Metragem, condomínio, número de suítes, urgência de venda..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>{mode === 'anuncie' ? 'Cadastrar Imóvel para Avaliação' : 'Solicitar Atendimento VIP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  UploadCloud, 
  Phone, 
  Mail, 
  User, 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Image as ImageIcon,
  Check,
  ShieldCheck,
  Home
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyType, PropertyGoal } from '../../types';

interface PropertyListingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyListingWizard: React.FC<PropertyListingWizardProps> = ({ isOpen, onClose }) => {
  const { addProperty, addLead, showToast } = useRealEstate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Dados Básicos
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartamento');
  const [goal, setGoal] = useState<PropertyGoal>('venda');
  const [price, setPrice] = useState('1850000');
  const [rentalPrice, setRentalPrice] = useState('8500');
  const [condoFee, setCondoFee] = useState('1200');
  const [iptu, setIptu] = useState('4500');
  const [description, setDescription] = useState('');

  // Step 2: Localização & Medidas
  const [cep, setCep] = useState('01310-100');
  const [address, setAddress] = useState('Av. Paulista, 1000');
  const [neighborhood, setNeighborhood] = useState('Bela Vista / Jardins');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [bedrooms, setBedrooms] = useState('3');
  const [suites, setSuites] = useState('2');
  const [parking, setParking] = useState('2');
  const [usableArea, setUsableArea] = useState('140');

  // Step 3: Fotos & Comodidades
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Varanda Gourmet',
    'Portaria 24h',
    'Pet Friendly',
    'Piscina'
  ]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Step 4: Contato do Proprietário
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('(31) 98427-9865');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const addPhoto = () => {
    if (newPhotoUrl.trim()) {
      setUploadedPhotos(prev => [...prev, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleCepLookup = () => {
    if (cep.replace(/\D/g, '').length >= 8) {
      showToast('Endereço autocompletado via CEP.', 'Localização Encontrada', 'info');
      setAddress('Av. Paulista, 1000');
      setNeighborhood('Bela Vista / Cerqueira César');
      setCity('São Paulo');
      setState('SP');
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone) return;

    setIsSubmitting(true);

    // 1. Add property to public catalog
    const newProp = addProperty({
      title: title || `Apartamento de Alto Padrão em ${neighborhood}`,
      description: description || 'Imóvel cadastrado pelo proprietário na plataforma Morada Digital com curadoria e transparência.',
      type: propertyType,
      goal,
      status: 'disponivel',
      price: Number(price) || 1500000,
      rentalPrice: Number(rentalPrice) || 0,
      condoFee: Number(condoFee) || 0,
      iptuAnnual: Number(iptu) || 0,
      bedrooms: Number(bedrooms) || 2,
      suites: Number(suites) || 1,
      bathrooms: Number(suites) + 1,
      parkingSpots: Number(parking) || 1,
      totalArea: Number(usableArea) * 1.2,
      usableArea: Number(usableArea) || 100,
      neighborhood,
      city,
      state,
      address,
      coordinates: { lat: -23.565, lng: -46.652 },
      features: selectedFeatures,
      images: uploadedPhotos.length > 0 ? uploadedPhotos : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      brokerId: 'usr-1',
      brokerName: 'Rodrigo Mendonça',
      brokerPhone: '(31) 98427-9865',
      brokerCreci: 'CRECI 189.442-F',
      brokerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      exclusive: true,
      featured: true,
      portalsSynced: { zap: true, vivaReal: true, olx: true }
    });

    // 2. Add lead into CRM Kanban automatically (Persona: Proprietário Sr. Ricardo)
    addLead({
      name: ownerName,
      email: ownerEmail,
      phone: ownerPhone,
      budgetMax: Number(price) || 1850000,
      interestType: goal,
      preferredNeighborhoods: [neighborhood],
      preferredPropertyTypes: [propertyType],
      propertyOfInterestId: newProp.id,
      propertyOfInterestTitle: newProp.title,
      propertyOfInterestCode: newProp.code,
      stage: 'novo',
      origin: 'site_direto',
      notes: `Proprietário cadastrou imóvel pelo Wizard Self-Service. Valor R$ ${price}, Bairro ${neighborhood}. Fotos: ${uploadedPhotos.length}.`
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    showToast('Imóvel cadastrado com sucesso e sincronizado!', 'Morada Digital', 'success');
  };

  const steps = [
    { num: 1, title: 'Dados Básicos' },
    { num: 2, title: 'Localização' },
    { num: 3, title: 'Fotos & Lazer' },
    { num: 4, title: 'Contato' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
      >
        
        {/* Wizard Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Anúncio Self-Service Grátis
              </span>
              <span className="text-xs text-slate-500 font-medium">Passo {currentStep} de 4</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              Anuncie seu Imóvel na Morada Digital
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-4 pb-2 bg-white">
          <div className="grid grid-cols-4 gap-2">
            {steps.map(s => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;

              return (
                <div key={s.num} className="space-y-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${
                    isPast || isActive ? 'bg-teal-600' : 'bg-slate-200'
                  }`} />
                  <span className={`text-[10px] font-bold block truncate ${
                    isActive ? 'text-teal-700 font-extrabold' : 'text-slate-400'
                  }`}>
                    {s.num}. {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 flex-1">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold font-serif text-slate-900">
                Imóvel Cadastrado com Sucesso!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Seu imóvel já está visível no catálogo e vinculado ao painel administrativo. Nosso especialista <strong>Rodrigo Mendonça</strong> entrará em contato via WhatsApp no número <strong>{ownerPhone}</strong> para formalizar a publicação nos portais ZAP, VivaReal e OLX.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Ver no Catálogo
                </button>
              </div>
            </motion.div>
          ) : (
            <div>
              {/* STEP 1: DADOS BÁSICOS */}
              {currentStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Título do Anúncio *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Ex: Apartamento com Ampla Varanda e Iluminação Natural nos Jardins"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Propriedade</label>
                      <select
                        value={propertyType}
                        onChange={e => setPropertyType(e.target.value as any)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      >
                        <option value="apartamento">Apartamento Padrão</option>
                        <option value="cobertura">Cobertura Duplex/Triplex</option>
                        <option value="casa">Casa de Bairro</option>
                        <option value="casa_condominio">Casa em Condomínio</option>
                        <option value="studio">Studio / Compacto</option>
                        <option value="comercial">Sala Comercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Finalidade</label>
                      <select
                        value={goal}
                        onChange={e => setGoal(e.target.value as any)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      >
                        <option value="venda">Venda</option>
                        <option value="locacao">Aluguel</option>
                        <option value="lancamento">Lançamento</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Venda (R$)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Condomínio / Mês</label>
                      <input
                        type="number"
                        value={condoFee}
                        onChange={e => setCondoFee(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">IPTU Anual</label>
                      <input
                        type="number"
                        value={iptu}
                        onChange={e => setIptu(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição Detalhada</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Descreva a iluminação, posição solar, acabamentos, reforma recente e o condomínio..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: LOCALIZAÇÃO & MEDIDAS */}
              {currentStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CEP</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={cep}
                          onChange={e => setCep(e.target.value)}
                          placeholder="01310-100"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCepLookup}
                          className="bg-slate-100 hover:bg-slate-200 px-2.5 rounded-xl text-xs font-bold text-slate-700"
                        >
                          Buscar
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço Completo</label>
                      <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Rua, número, complemento"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={e => setNeighborhood(e.target.value)}
                        placeholder="Ex: Jardins, Itaim Bibi"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade / Estado</label>
                      <input
                        type="text"
                        value={`${city} - ${state}`}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Área Útil (m²)</label>
                      <input
                        type="number"
                        value={usableArea}
                        onChange={e => setUsableArea(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Quartos</label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={e => setBedrooms(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Suítes</label>
                      <input
                        type="number"
                        value={suites}
                        onChange={e => setSuites(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Vagas</label>
                      <input
                        type="number"
                        value={parking}
                        onChange={e => setParking(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: FOTOS & COMODIDADES */}
              {currentStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Fotos do Imóvel (Simulador Drag & Drop com compressão automática)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                      <UploadCloud className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-800">
                        Arraste suas fotos aqui ou insira a URL
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Formatos WebP, JPG, PNG até 15MB cada com compressão client-side.
                      </p>
                    </div>

                    {/* Add by URL */}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="url"
                        placeholder="Cole o link da foto (Unsplash, Drive ou S3)..."
                        value={newPhotoUrl}
                        onChange={e => setNewPhotoUrl(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={addPhoto}
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Adicionar
                      </button>
                    </div>

                    {/* Photos Preview Grid */}
                    <div className="flex gap-2 overflow-x-auto pt-3">
                      {uploadedPhotos.map((img, i) => (
                        <div key={i} className="w-20 h-16 rounded-xl overflow-hidden relative border border-slate-200 flex-shrink-0">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setUploadedPhotos(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 text-white text-[10px] flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Comodidades e Diferenciais
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Varanda Gourmet', 'Piscina', 'Portaria 24h', 'Academia', 
                        'Pet Friendly', 'Ar Condicionado', 'Mobiliado', 'Automação', 'Sauna', 'Espaço Zen'
                      ].map(feat => {
                        const isSelected = selectedFeatures.includes(feat);
                        return (
                          <button
                            key={feat}
                            type="button"
                            onClick={() => toggleFeature(feat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {feat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: CONTATO DO PROPRIETÁRIO */}
              {currentStep === 4 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-xs text-teal-800 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-700" />
                      Garantia de Privacidade & LGPD
                    </p>
                    <p className="text-[11px] text-teal-700">
                      Seus dados de contato não serão exibidos publicamente. Eles são utilizados exclusivamente pela equipe da Morada Digital para prestar contas dos interessados.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Seu Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      placeholder="Ex: Sr. Ricardo Menezes"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp de Contato *</label>
                      <input
                        type="text"
                        required
                        value={ownerPhone}
                        onChange={e => setOwnerPhone(e.target.value)}
                        placeholder="(31) 98427-9865"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={e => setOwnerEmail(e.target.value)}
                        placeholder="ricardo@invest.com.br"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <span className="font-bold text-slate-800">Resumo do Anúncio:</span>
                    <p className="text-slate-600">{title || 'Apartamento'} em {neighborhood}, {city}</p>
                    <p className="font-extrabold text-teal-700">R$ {Number(price).toLocaleString('pt-BR')} • {usableArea}m² • {bedrooms} dormitórios</p>
                  </div>
                </motion.div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => (prev - 1) as any)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>
                ) : <div />}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => (prev + 1) as any)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <span>Cadastrar Imóvel no Sistema</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};

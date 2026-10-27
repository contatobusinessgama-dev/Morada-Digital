import React, { useState, useRef, useEffect } from 'react';
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
  FilePenLine,
  FileText,
  AlertCircle,
  Trash2,
  Download,
  Lock,
  Printer,
  Scale,
  MessageCircle
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyType, PropertyGoal } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

interface PropertyListingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyListingWizard: React.FC<PropertyListingWizardProps> = ({ isOpen, onClose }) => {
  const { addProperty, addLead, addCliente, addContrato, showToast } = useRealEstate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: DADOS DO IMÓVEL & VALORES
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartamento');
  const [goal, setGoal] = useState<PropertyGoal>('venda');
  const [price, setPrice] = useState('650000');
  const [rentalPrice, setRentalPrice] = useState('3200');
  const [condoFee, setCondoFee] = useState('450');
  const [iptu, setIptu] = useState('1200');
  const [description, setDescription] = useState('');
  const [matriculaNumber, setMatriculaNumber] = useState('');
  const [cartorioRegistro, setCartorioRegistro] = useState('Cartório de Registro de Imóveis de Contagem/MG');

  // Localização & Medidas
  const [cep, setCep] = useState('32113-230');
  const [address, setAddress] = useState('Rua Pinheiro, 264');
  const [neighborhood, setNeighborhood] = useState('Arvoredo');
  const [city, setCity] = useState('Contagem');
  const [state, setState] = useState('MG');
  const [bedrooms, setBedrooms] = useState('3');
  const [suites, setSuites] = useState('1');
  const [parking, setParking] = useState('2');
  const [usableArea, setUsableArea] = useState('110');

  // STEP 2: FOTOS DO IMÓVEL (Upload Real de Arquivos + Galeria)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Varanda Gourmet',
    'Portaria 24h',
    'Vaga Coberta',
    'Pet Friendly',
    'Armários Planejados'
  ]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STEP 3: DADOS DO PROPRIETÁRIO & VERIFICAÇÃO JURÍDICA
  const [ownerName, setOwnerName] = useState('');
  const [ownerCpfCnpj, setOwnerCpfCnpj] = useState('');
  const [ownerMaritalStatus, setOwnerMaritalStatus] = useState('Casado(a)');
  const [ownerPhone, setOwnerPhone] = useState('(31) 98427-9865');
  const [ownerEmail, setOwnerEmail] = useState('');
  
  // Declarações Jurídicas Obrigatórias (Legal Compliance)
  const [declaraPropriedade, setDeclaraPropriedade] = useState(true);
  const [declaraSemOnus, setDeclaraSemOnus] = useState(true);
  const [declaraTributosEmDia, setDeclaraTributosEmDia] = useState(true);
  const [autorizaDivulgacaoPortais, setAutorizaDivulgacaoPortais] = useState(true);

  // STEP 4: CONTRATO & ASSINATURA ELETRÔNICA
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('type');
  const [typedSignature, setTypedSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [aceitaTermosContrato, setAceitaTermosContrato] = useState(true);
  const [protocolNumber, setProtocolNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPropertyCode, setCreatedPropertyCode] = useState('');
  const [createdContractCode, setCreatedContractCode] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle Canvas Drawing for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  // Sync typed signature when owner name is typed
  useEffect(() => {
    if (ownerName && !typedSignature) {
      setTypedSignature(ownerName);
    }
  }, [ownerName]);

  if (!isOpen) return null;

  // Handle Real File Upload (Converts files to object URLs for immediate preview)
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newImgs: string[] = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        newImgs.push(objectUrl);
      }
    });

    if (newImgs.length > 0) {
      setUploadedPhotos(prev => [...newImgs, ...prev]);
      showToast(`${newImgs.length} foto(s) anexada(s) com sucesso!`, 'Fotos Carregadas', 'success');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const handleCepLookup = () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length >= 8) {
      showToast('Endereço localizado em Contagem / MG!', 'CEP Confirmado', 'info');
      setAddress('Rua Pinheiro, 264');
      setNeighborhood('Arvoredo');
      setCity('Contagem');
      setState('MG');
    }
  };

  // Final Submission: Add Property, Create Client, Create CRM Lead, Issue Legal Intermediation Contract
  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone) {
      showToast('Por favor, preencha seu nome e WhatsApp de contato.', 'Dados Incompletos', 'crm');
      return;
    }

    if (!declaraPropriedade || !declaraSemOnus || !declaraTributosEmDia) {
      showToast('As declarações jurídicas de titularidade e desembaraço são obrigatórias.', 'Validação Jurídica', 'crm');
      return;
    }

    if (!aceitaTermosContrato) {
      showToast('É necessário aceitar os termos do contrato de intermediação.', 'Contrato Obrigatório', 'crm');
      return;
    }

    setIsSubmitting(true);

    const generatedProtocol = `OPC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setProtocolNumber(generatedProtocol);

    const propertyPriceNum = Number(price) || 650000;
    const rentalPriceNum = Number(rentalPrice) || 3000;

    // 1. Add Property to Database
    const newProp = addProperty({
      title: title || `${propertyType === 'apartamento' ? 'Apartamento' : 'Imóvel'} de Alto Padrão em ${neighborhood}`,
      description: description || `Excelente oportunidade em ${neighborhood}, ${city} - ${state}. Imóvel com documentação verificada pela equipe jurídica da Morada Digital.`,
      type: propertyType,
      goal,
      status: 'disponivel',
      price: propertyPriceNum,
      rentalPrice: goal === 'locacao' ? rentalPriceNum : undefined,
      condoFee: Number(condoFee) || 0,
      iptuAnnual: Number(iptu) || 0,
      bedrooms: Number(bedrooms) || 3,
      suites: Number(suites) || 1,
      bathrooms: Number(suites) + 1,
      parkingSpots: Number(parking) || 2,
      totalArea: Number(usableArea) * 1.25,
      usableArea: Number(usableArea) || 100,
      neighborhood,
      city,
      state,
      address,
      coordinates: { lat: -19.8872, lng: -44.0458 }, // Contagem coordinates
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

    setCreatedPropertyCode(newProp.code);

    // 2. Add Owner as Client
    addCliente({
      name: ownerName,
      type: 'proprietario',
      cpfCnpj: ownerCpfCnpj || '000.000.000-00',
      phone: ownerPhone,
      email: ownerEmail || 'proprietario@moradadigital.com.br',
      city: `${city} - ${state}`,
      status: 'ativo',
      notes: `Proprietário do imóvel ${newProp.code} (${neighborhood}). Contrato de Opção de Venda assinado eletronicamente via protocolo ${generatedProtocol}.`
    });

    // 3. Add Lead to CRM pipeline
    addLead({
      name: `${ownerName} (Proprietário)`,
      email: ownerEmail,
      phone: ownerPhone,
      budgetMax: propertyPriceNum,
      interestType: goal,
      preferredNeighborhoods: [neighborhood],
      preferredPropertyTypes: [propertyType],
      propertyOfInterestId: newProp.id,
      propertyOfInterestTitle: newProp.title,
      propertyOfInterestCode: newProp.code,
      stage: 'novo',
      score: 'quente',
      origin: 'site_direto',
      notes: `Captação online: Proprietário cadastrou o imóvel ${newProp.code} para ${goal.toUpperCase()}. Contrato de intermediação assinado com protocolo ${generatedProtocol}. Matrícula: ${matriculaNumber || 'Pendente de envio'}.`
    });

    // 4. Register formal Intermediation Contract in CRM
    const contractCode = `CTR-OPCAO-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedContractCode(contractCode);

    addContrato({
      type: 'prestacao_servicos',
      title: `Autorização de Intermediação e Opção de ${goal === 'venda' ? 'Venda' : 'Locação'} - ${newProp.code}`,
      propertyId: newProp.id,
      propertyTitle: newProp.title,
      propertyCode: newProp.code,
      firstPartyName: ownerName,
      firstPartyCpfCnpj: ownerCpfCnpj || '000.000.000-00',
      firstPartyRole: 'Contratante / Proprietário',
      secondPartyName: MORADA_BRAND.legalName,
      secondPartyCpfCnpj: '12.345.678/0001-90',
      secondPartyRole: 'Contratada / Imobiliária',
      value: propertyPriceNum,
      commissionPercentage: 6.0,
      commissionValue: (propertyPriceNum * 6) / 100,
      status: 'assinado',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      signedAt: new Date().toISOString().split('T')[0],
      documentUrl: '#'
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    showToast(`Contrato ${contractCode} assinado e imóvel ${newProp.code} anunciado!`, 'Anúncio & Contrato Concluídos', 'success');
  };

  const steps = [
    { num: 1, title: 'Imóvel & Valores' },
    { num: 2, title: 'Fotos do Imóvel' },
    { num: 3, title: 'Dados & Verificação' },
    { num: 4, title: 'Contrato & Assinatura' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Wizard Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-t-3xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950">
                Opção de Venda & Anúncio Oficial
              </span>
              <span className="text-xs text-slate-300 font-medium">Etapa {currentStep} de 4</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Anunciar Meu Imóvel na Morada Digital
            </h3>
            <p className="text-xs text-slate-300">
              Divulgação nos maiores portais imobiliários e contrato com plena segurança jurídica.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-4 pb-3 bg-slate-50 border-b border-slate-200/80">
          <div className="grid grid-cols-4 gap-2">
            {steps.map(s => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;

              return (
                <div key={s.num} className="space-y-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${
                    isPast || isActive ? 'bg-indigo-600' : 'bg-slate-200'
                  }`} />
                  <span className={`text-[10px] font-bold block truncate ${
                    isActive ? 'text-indigo-600 font-extrabold' : isPast ? 'text-slate-700' : 'text-slate-400'
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
            <div className="py-8 text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Protocolo: {protocolNumber}
                </span>
                <h4 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                  Imóvel Anunciado & Contrato Assinado!
                </h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed mt-2">
                  Parabéns, <strong>{ownerName}</strong>! Seu imóvel foi cadastrado sob o código <strong>{createdPropertyCode}</strong> e o contrato de intermediação <strong>{createdContractCode}</strong> foi assinado eletronicamente com plena validade jurídica (Lei 14.063/2020 e Art. 722 do Código Civil).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5 font-bold">
                  <span>Código do Imóvel:</span>
                  <span className="text-indigo-600">{createdPropertyCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Contrato de Corretagem:</span>
                  <span className="font-semibold">{createdContractCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Fotos Anexadas:</span>
                  <span className="font-semibold text-emerald-700">{uploadedPhotos.length} fotos</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Comissão Acordada:</span>
                  <span className="font-semibold">6% tabela CRECI-MG (ao êxito)</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Validade da Opção:</span>
                  <span className="font-semibold">180 dias</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <a
                  href={`https://wa.me/${MORADA_BRAND.phoneClean}?text=Ol%C3%A1%2C%20acabei%20de%20cadastrar%20meu%20im%C3%B3vel%20${createdPropertyCode}%20na%20Morada%20Digital%20com%20o%20protocolo%20${protocolNumber}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Falar com o Corretor no WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Ver no Catálogo
                </button>
              </div>
            </div>
          ) : (
            <div>
              
              {/* ETAPA 1: DADOS DO IMÓVEL & VALORES */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título do Anúncio *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Ex: Casa Contemporânea 3 Quartos com Varanda Gourmet em Contagem"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Imóvel</label>
                      <select
                        value={propertyType}
                        onChange={e => setPropertyType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none"
                      >
                        <option value="apartamento">Apartamento Padrão</option>
                        <option value="cobertura">Cobertura</option>
                        <option value="casa">Casa de Bairro</option>
                        <option value="casa_condominio">Casa em Condomínio Fechado</option>
                        <option value="studio">Studio / Flat</option>
                        <option value="comercial">Sala / Galpão Comercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Finalidade Pretendida</label>
                      <select
                        value={goal}
                        onChange={e => setGoal(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none"
                      >
                        <option value="venda">Venda</option>
                        <option value="locacao">Aluguel / Locação</option>
                        <option value="lancamento">Venda e Locação Simultâneas</option>
                      </select>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {goal === 'locacao' ? 'Valor Aluguel / Mês (R$)' : 'Valor Pretendido Venda (R$)'} *
                      </label>
                      <input
                        type="number"
                        value={goal === 'locacao' ? rentalPrice : price}
                        onChange={e => goal === 'locacao' ? setRentalPrice(e.target.value) : setPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl font-bold text-indigo-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Condomínio Mensal (R$)</label>
                      <input
                        type="number"
                        value={condoFee}
                        onChange={e => setCondoFee(e.target.value)}
                        placeholder="0 se não houver"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">IPTU Anual (R$)</label>
                      <input
                        type="number"
                        value={iptu}
                        onChange={e => setIptu(e.target.value)}
                        placeholder="Ex: 1200"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-900 block mb-2">Localização do Imóvel:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">CEP</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={cep}
                            onChange={e => setCep(e.target.value)}
                            placeholder="32113-230"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleCepLookup}
                            className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            Buscar
                          </button>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Endereço (Rua e Nº)</label>
                        <input
                          type="text"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="Rua Pinheiro, 264"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bairro</label>
                        <input
                          type="text"
                          value={neighborhood}
                          onChange={e => setNeighborhood(e.target.value)}
                          placeholder="Ex: Arvoredo"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cidade / Estado</label>
                        <input
                          type="text"
                          value={`${city} - ${state}`}
                          onChange={e => setCity(e.target.value)}
                          placeholder="Contagem - MG"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medidas e Cômodos */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Área Útil (m²)</label>
                      <input
                        type="number"
                        value={usableArea}
                        onChange={e => setUsableArea(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quartos</label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={e => setBedrooms(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Suítes</label>
                      <input
                        type="number"
                        value={suites}
                        onChange={e => setSuites(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Vagas</label>
                      <input
                        type="number"
                        value={parking}
                        onChange={e => setParking(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Descrição e Pontos Fortes</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Descreva acabamentos, reforma recente, sol da manhã, proximidade de comércios..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 2: UPLOAD E ANEXO DE FOTOS DO IMÓVEL */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Anexar Fotos do Imóvel ({uploadedPhotos.length} fotos anexadas)</span>
                      <span className="text-[11px] text-teal-600 font-medium">Recomendado: 5 a 15 fotos</span>
                    </label>

                    {/* Drag and Drop Zone */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                        isDragging 
                          ? 'border-indigo-600 bg-indigo-50/50' 
                          : 'border-slate-300 hover:border-indigo-500 bg-slate-50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                      <UploadCloud className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-900">
                        Clique para selecionar fotos do seu computador ou celular
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Ou arraste os arquivos de imagem para este campo (JPG, PNG, WebP)
                      </p>
                    </div>

                    {/* Photos Preview Grid */}
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Fotos Selecionadas (A primeira será a foto de capa):
                        </span>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-1 bg-slate-100 rounded-2xl border border-slate-200">
                          {uploadedPhotos.map((img, i) => (
                            <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 group shadow-xs">
                              <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                              {i === 0 && (
                                <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                  CAPA
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => setUploadedPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                                title="Remover foto"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Comodidades */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Comodidades e Diferenciais
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Varanda Gourmet', 'Piscina', 'Portaria 24h', 'Academia', 
                        'Pet Friendly', 'Ar Condicionado', 'Mobiliado', 'Armários Planejados',
                        'Churrasqueira', 'Vaga Coberta', 'Elevador', 'Espaço Zen'
                      ].map(feat => {
                        const isSelected = selectedFeatures.includes(feat);
                        return (
                          <button
                            key={feat}
                            type="button"
                            onClick={() => toggleFeature(feat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {feat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 3: DADOS DO PROPRIETÁRIO & VERIFICAÇÃO JURÍDICA */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Security Notice */}
                  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-xs text-indigo-950 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-indigo-800">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      Auditoria Jurídica & Sigilo Profissional (LGPD)
                    </p>
                    <p className="text-[11px] text-indigo-800/80 leading-relaxed">
                      Seus dados pessoais são confidenciais e protegidos pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Eles constarão exclusivamente na autorização de corretagem e no compromisso com compradores qualificados.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo do Proprietário *</label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={e => setOwnerName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo de Oliveira"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">CPF ou CNPJ *</label>
                      <input
                        type="text"
                        required
                        value={ownerCpfCnpj}
                        onChange={e => setOwnerCpfCnpj(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Estado Civil</label>
                      <select
                        value={ownerMaritalStatus}
                        onChange={e => setOwnerMaritalStatus(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      >
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a) - Comunhão Parcial">Casado(a) - Comunhão Parcial</option>
                        <option value="Casado(a) - Comunhão Universal">Casado(a) - Comunhão Universal</option>
                        <option value="União Estável">União Estável</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Oficial *</label>
                      <input
                        type="text"
                        required
                        value={ownerPhone}
                        onChange={e => setOwnerPhone(e.target.value)}
                        placeholder="(31) 98427-9865"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none font-bold text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">E-mail para Documentos</label>
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={e => setOwnerEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nº da Matrícula (Opcional se não souber)</label>
                      <input
                        type="text"
                        value={matriculaNumber}
                        onChange={e => setMatriculaNumber(e.target.value)}
                        placeholder="Ex: Matrícula nº 45.890"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Cartório de Registro de Imóveis</label>
                      <input
                        type="text"
                        value={cartorioRegistro}
                        onChange={e => setCartorioRegistro(e.target.value)}
                        placeholder="Ex: Registro de Imóveis de Contagem"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Verificação Jurídica Rigorosa (Checklist Legal) */}
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-900 block mb-2 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-indigo-600" />
                      Declarações de Desembaraço e Conformidade Jurídica:
                    </span>

                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declaraPropriedade}
                          onChange={e => setDeclaraPropriedade(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-slate-700 leading-tight">
                          <strong>Titularidade Legítima:</strong> Declaro sob as penas da lei que sou o legítimo titular, herdeiro ou procurador com poderes expressos sobre o imóvel ofertado.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declaraSemOnus}
                          onChange={e => setDeclaraSemOnus(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-slate-700 leading-tight">
                          <strong>Inexistência de Ônus Ocultos:</strong> Declaro que o imóvel se encontra livre de litígios judiciais, arrestos, penhoras trabalhistas/fiscais ou impedimentos de alienação.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declaraTributosEmDia}
                          onChange={e => setDeclaraTributosEmDia(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-slate-700 leading-tight">
                          <strong>Regularidade Tributária & Condominial:</strong> Comprometo-me a apresentar certidões negativas de débito municipal (IPTU) e declaração de quitação condominial antes da outorga de escritura.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autorizaDivulgacaoPortais}
                          onChange={e => setAutorizaDivulgacaoPortais(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-slate-700 leading-tight">
                          <strong>Autorização de Divulgação:</strong> Autorizo a Morada Digital a divulgar o material fotográfico nos portais ZAP Imóveis, VivaReal, redes sociais e parceiros credenciados.
                        </span>
                      </label>
                    </div>
                  </div>

                </div>
              )}

              {/* ETAPA 4: CONTRATO DE INTERMEDIAÇÃO & ASSINATURA ELETRÔNICA */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Contract Header Notice */}
                  <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <FilePenLine className="w-4 h-4 text-teal-400" />
                      <span className="font-bold text-xs">
                        Contrato Oficial de Prestação de Serviços & Opção de {goal === 'venda' ? 'Venda' : 'Locação'}
                      </span>
                    </div>
                    <span className="text-[10px] text-teal-300 font-mono">
                      Lei 10.406/02 • Art. 722
                    </span>
                  </div>

                  {/* Scrollable Legal Contract Body */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 max-h-56 overflow-y-auto text-[11px] text-slate-700 space-y-2.5 font-sans leading-relaxed border-l-4 border-l-indigo-600">
                    <p className="font-bold text-center text-xs text-slate-900 border-b pb-1">
                      CONTRATO DE INTERMEDIAÇÃO IMOBILIÁRIA E OPÇÃO DE {goal === 'venda' ? 'VENDA' : 'LOCAÇÃO'} COM EFICÁCIA EXECUTIVA
                    </p>

                    <p>
                      <strong>CONTRATANTE:</strong> {ownerName || '[Nome do Proprietário]'}, portador(a) do CPF/CNPJ nº {ownerCpfCnpj || '[CPF]'}, estado civil {ownerMaritalStatus}, residente e domiciliado no endereço do imóvel ou contato informado.
                    </p>

                    <p>
                      <strong>CONTRATADA:</strong> {MORADA_BRAND.legalName}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 12.345.678/0001-90, detentora do {MORADA_BRAND.creci}, com sede operacional na {MORADA_BRAND.address}.
                    </p>

                    <p>
                      <strong>CLÁUSULA 1ª (DO OBJETO):</strong> O CONTRATANTE confere à CONTRATADA poderes para promover a intermediação e corretagem imobiliária, nos estritos termos dos artigos 722 a 729 do Código Civil Brasileiro, do imóvel situado na {address}, Bairro {neighborhood}, {city}/{state}, pelo valor pretendido de <strong>R$ {Number(goal === 'locacao' ? rentalPrice : price).toLocaleString('pt-BR')}</strong>.
                    </p>

                    <p>
                      <strong>CLÁUSULA 2ª (DOS HONORÁRIOS DE CORRETAGEM):</strong> Pelos serviços de intermediação, o CONTRATANTE pagará à CONTRATADA a remuneração de <strong>6% (seis por cento)</strong> sobre o valor total da negociação em caso de venda (conforme tabela orientativa do CRECI-MG), ou o primeiro aluguel integral em caso de locação, unicamente devidos no êxito da transação e assinatura da promessa de compra e venda.
                    </p>

                    <p>
                      <strong>CLÁUSULA 3ª (DAS OBRIGAÇÕES DA IMOBILIÁRIA):</strong> A CONTRATADA obriga-se a: (a) Publicar o imóvel nos principais portais imobiliários (ZAP Imóveis, VivaReal, base de clientes Morada Digital); (b) Agendar visitas acompanhadas com termo digital; (c) Conduzir a elaboração das minutas com auditoria documental jurídica completa para garantir que o imóvel seja vendido sem risco.
                    </p>

                    <p>
                      <strong>CLÁUSULA 4ª (DO PRAZO E EXCLUSIVIDADE):</strong> A presente autorização vigorará pelo prazo de 180 (cento e oitenta) dias, prorrogável automaticamente por mútuo consentimento.
                    </p>

                    <p>
                      <strong>CLÁUSULA 5ª (DA VALIDADE DA ASSINATURA ELETRÔNICA):</strong> As partes reconhecem expressamente a plena validade, higidez e autenticidade jurídica da assinatura eletrônica do presente documento, nos termos da Lei Federal nº 14.063/2020 e Art. 10, § 2º da MP 2.200-2/2001, constituindo título executivo extrajudicial (CPC, Art. 784, III).
                    </p>

                    <p>
                      <strong>CLÁUSULA 6ª (DO FORO):</strong> Fica eleito o Foro da Comarca de Contagem/MG para dirimir quaisquer dúvidas decorrentes do presente instrumento.
                    </p>
                  </div>

                  {/* Interactive Electronic Signature Pad */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FilePenLine className="w-4 h-4 text-indigo-600" />
                        Assinatura Eletrônica do Proprietário:
                      </span>

                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setSignatureMode('type')}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            signatureMode === 'type' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Digitar Nome
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignatureMode('draw')}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            signatureMode === 'draw' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Desenhar Assinatura
                        </button>
                      </div>
                    </div>

                    {signatureMode === 'type' ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={typedSignature}
                          onChange={e => setTypedSignature(e.target.value)}
                          placeholder="Digite seu nome completo como assinatura..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-serif text-lg text-indigo-950 font-bold tracking-wide outline-none focus:bg-white focus:border-indigo-600"
                        />
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span>Certificado Digital Eletrônico Morada Digital ID #{(ownerCpfCnpj || 'MG').replace(/\D/g, '').slice(-6) || '2026'}</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Hash ICP-Brasil / Lei 14.063
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                          <canvas
                            ref={canvasRef}
                            width={500}
                            height={120}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-28 cursor-crosshair touch-none"
                          />
                          {!hasDrawnSignature && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 pointer-events-none">
                              Desenhe sua rubrica ou assinatura aqui com o dedo ou mouse
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500">Assinatura grafoscópica eletrônica</span>
                          <button
                            type="button"
                            onClick={clearCanvas}
                            className="text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
                          >
                            Limpar Assinatura
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Checkbox de Aceite Formal */}
                    <div className="pt-2 border-t border-slate-100">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aceitaTermosContrato}
                          onChange={e => setAceitaTermosContrato(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-700 leading-tight">
                          Li e concordo com os termos do <strong>Contrato de Intermediação Imobiliária</strong> da Morada Digital (CRECI 104.900-J), autorizando a publicação nos portais imobiliários e atestando a veracidade de todas as informações prestadas.
                        </span>
                      </label>
                    </div>

                  </div>

                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => (prev - 1) as any)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>
                ) : <div />}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1 && (!title || !price)) {
                        showToast('Por favor, informe ao menos o título e o valor do imóvel.', 'Atenção', 'crm');
                        return;
                      }
                      setCurrentStep(prev => (prev + 1) as any);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/25"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Processando Contrato...' : 'Assinar Contrato & Publicar Anúncio'}</span>
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

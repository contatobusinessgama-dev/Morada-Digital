import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  Eye, 
  Edit3, 
  Share2, 
  MapPin, 
  Sparkles,
  BedDouble,
  Car,
  Maximize2,
  CheckCircle2,
  ExternalLink,
  Trash2,
  UploadCloud,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Star,
  AlertCircle,
  X
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Property, PropertyStatus, PropertyType, PropertyGoal } from '../../types';

export const PropertiesManager: React.FC = () => {
  const { 
    properties, 
    updatePropertyStatus, 
    addProperty, 
    updateProperty, 
    setSelectedProperty, 
    team,
    showToast 
  } = useRealEstate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [goalFilter, setGoalFilter] = useState<string>('todos');
  
  // Modals
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // New property form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PropertyType>('apartamento');
  const [goal, setGoal] = useState<PropertyGoal>('venda');
  const [price, setPrice] = useState('3200000');
  const [rentalPrice, setRentalPrice] = useState('4500');
  const [condoFee, setCondoFee] = useState('2400');
  const [iptu, setIptu] = useState('11000');
  const [bedrooms, setBedrooms] = useState('3');
  const [suites, setSuites] = useState('3');
  const [bathrooms, setBathrooms] = useState('4');
  const [parking, setParking] = useState('3');
  const [usableArea, setUsableArea] = useState('210');
  const [neighborhood, setNeighborhood] = useState('Arvoredo');
  const [city, setCity] = useState('Contagem');
  const [address, setAddress] = useState('Rua Pinheiro, 264');
  const [assignedBrokerId, setAssignedBrokerId] = useState('');
  
  // Images manager for New Property (up to 15)
  const [newImages, setNewImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [urlInputNew, setUrlInputNew] = useState('');

  // Editing Property State
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    type: PropertyType;
    goal: PropertyGoal;
    status: PropertyStatus;
    price: number;
    rentalPrice?: number;
    condoFee?: number;
    iptuAnnual?: number;
    bedrooms: number;
    suites: number;
    bathrooms: number;
    parkingSpots: number;
    usableArea: number;
    neighborhood: string;
    city: string;
    address: string;
    exclusive: boolean;
    featured: boolean;
    brokerId: string;
    images: string[];
  } | null>(null);
  const [urlInputEdit, setUrlInputEdit] = useState('');

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.code.toLowerCase().includes(search.toLowerCase()) ||
                          p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
                          p.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;
    const matchesGoal = goalFilter === 'todos' || p.goal === goalFilter;
    return matchesSearch && matchesStatus && matchesGoal;
  });

  // Open Edit Modal
  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setEditForm({
      title: prop.title,
      description: prop.description,
      type: prop.type,
      goal: prop.goal,
      status: prop.status,
      price: prop.price,
      rentalPrice: prop.rentalPrice || 0,
      condoFee: prop.condoFee || 0,
      iptuAnnual: prop.iptuAnnual || 0,
      bedrooms: prop.bedrooms,
      suites: prop.suites,
      bathrooms: prop.bathrooms,
      parkingSpots: prop.parkingSpots,
      usableArea: prop.usableArea,
      neighborhood: prop.neighborhood,
      city: prop.city,
      address: prop.address,
      exclusive: prop.exclusive,
      featured: prop.featured,
      brokerId: prop.brokerId,
      images: [...prop.images] // clone array
    });
    setUrlInputEdit('');
  };

  // Save Edited Property
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty || !editForm) return;

    if (editForm.images.length === 0) {
      showToast('O imóvel precisa ter ao menos 1 imagem.', 'Aviso', 'info');
      return;
    }

    if (editForm.images.length > 15) {
      showToast('O imóvel pode ter no máximo 15 imagens.', 'Limite Excedido', 'info');
      return;
    }

    const assignedBroker = team.find(b => b.id === editForm.brokerId) || {
      id: editingProperty.brokerId,
      name: editingProperty.brokerName,
      phone: editingProperty.brokerPhone,
      creci: editingProperty.brokerCreci,
      avatar: editingProperty.brokerAvatar
    };

    updateProperty(editingProperty.id, {
      title: editForm.title,
      description: editForm.description,
      type: editForm.type,
      goal: editForm.goal,
      status: editForm.status,
      price: Number(editForm.price),
      rentalPrice: Number(editForm.rentalPrice) || undefined,
      condoFee: Number(editForm.condoFee) || 0,
      iptuAnnual: Number(editForm.iptuAnnual) || 0,
      bedrooms: Number(editForm.bedrooms),
      suites: Number(editForm.suites),
      bathrooms: Number(editForm.bathrooms),
      parkingSpots: Number(editForm.parkingSpots),
      usableArea: Number(editForm.usableArea),
      totalArea: Math.round(Number(editForm.usableArea) * 1.25),
      neighborhood: editForm.neighborhood,
      city: editForm.city,
      address: editForm.address,
      exclusive: editForm.exclusive,
      featured: editForm.featured,
      brokerId: assignedBroker.id,
      brokerName: assignedBroker.name,
      brokerPhone: assignedBroker.phone,
      brokerCreci: assignedBroker.creci || editingProperty.brokerCreci,
      brokerAvatar: assignedBroker.avatar || editingProperty.brokerAvatar,
      images: editForm.images
    });

    setEditingProperty(null);
    setEditForm(null);
  };

  // Handle Create Property
  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (newImages.length === 0) {
      showToast('Adicione ao menos 1 imagem para o anúncio.', 'Aviso', 'info');
      return;
    }

    if (newImages.length > 15) {
      showToast('Limite máximo de 15 fotos por imóvel!', 'Aviso', 'info');
      return;
    }

    const broker = team.find(b => b.id === assignedBrokerId) || team.find(b => b.role === 'corretor') || team[1] || team[0];

    addProperty({
      title,
      description: description || 'Excelente imóvel em localização privilegiada.',
      type,
      goal,
      status: 'disponivel',
      price: Number(price) || 2000000,
      rentalPrice: goal === 'locacao' ? Number(rentalPrice) || 3500 : undefined,
      condoFee: Number(condoFee) || 0,
      iptuAnnual: Number(iptu) || 0,
      bedrooms: Number(bedrooms) || 2,
      suites: Number(suites) || 1,
      bathrooms: Number(bathrooms) || 2,
      parkingSpots: Number(parking) || 2,
      totalArea: Math.round(Number(usableArea) * 1.25),
      usableArea: Number(usableArea) || 150,
      neighborhood,
      city,
      state: 'MG',
      address,
      coordinates: { lat: -19.9208, lng: -44.0538 },
      features: ['Varanda Gourmet', 'Piscina', 'Portaria 24h', 'Academia', 'Pet Friendly'],
      images: newImages,
      brokerId: broker.id,
      brokerName: broker.name,
      brokerPhone: broker.phone,
      brokerCreci: broker.creci || 'CRECI 189.442-F/MG',
      brokerAvatar: broker.avatar,
      exclusive: true,
      featured: true,
      portalsSynced: { zap: true, vivaReal: true, olx: true }
    });

    setIsNewPropertyOpen(false);
    setTitle('');
    setDescription('');
    setNewImages(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']);
  };

  // Helper for File Uploads (up to 15 images)
  const processFiles = (files: FileList | null, currentList: string[], setter: (list: string[]) => void) => {
    if (!files || files.length === 0) return;

    const availableSlots = 15 - currentList.length;
    if (availableSlots <= 0) {
      showToast('Limite máximo de 15 fotos já atingido para este imóvel!', 'Limite de Fotos', 'info');
      return;
    }

    const filesToRead = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      showToast(`Adicionando apenas ${availableSlots} fotos para respeitar o limite de 15.`, 'Limite de Fotos', 'info');
    }

    filesToRead.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setter([...currentList, event.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Gallery manipulation helpers
  const handleSetCover = (index: number, isEdit: boolean) => {
    if (index === 0) return;
    if (isEdit && editForm) {
      const updated = [...editForm.images];
      const [cover] = updated.splice(index, 1);
      updated.unshift(cover);
      setEditForm({ ...editForm, images: updated });
      showToast('Foto definida como Capa principal!', 'Capa Atualizada', 'crm');
    } else {
      const updated = [...newImages];
      const [cover] = updated.splice(index, 1);
      updated.unshift(cover);
      setNewImages(updated);
      showToast('Foto definida como Capa principal!', 'Capa Atualizada', 'crm');
    }
  };

  const handleRemoveImage = (index: number, isEdit: boolean) => {
    if (isEdit && editForm) {
      if (editForm.images.length <= 1) {
        showToast('O imóvel precisa ter ao menos 1 foto.', 'Aviso', 'info');
        return;
      }
      const updated = editForm.images.filter((_, i) => i !== index);
      setEditForm({ ...editForm, images: updated });
    } else {
      if (newImages.length <= 1) {
        showToast('O anúncio precisa ter ao menos 1 foto.', 'Aviso', 'info');
        return;
      }
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right', isEdit: boolean) => {
    const list = isEdit && editForm ? [...editForm.images] : [...newImages];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    if (isEdit && editForm) {
      setEditForm({ ...editForm, images: list });
    } else {
      setNewImages(list);
    }
  };

  const handleAddUrl = (isEdit: boolean) => {
    const url = isEdit ? urlInputEdit.trim() : urlInputNew.trim();
    if (!url) return;

    const list = isEdit && editForm ? editForm.images : newImages;
    if (list.length >= 15) {
      showToast('Limite máximo de 15 imagens atingido!', 'Limite', 'info');
      return;
    }

    if (isEdit && editForm) {
      setEditForm({ ...editForm, images: [...editForm.images, url] });
      setUrlInputEdit('');
    } else {
      setNewImages([...newImages, url]);
      setUrlInputNew('');
    }
    showToast('Imagem adicionada com sucesso!', 'Galeria', 'crm');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por código, título, bairro, cidade..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
          >
            <option value="todos">Todos os Status</option>
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="alugado">Alugado</option>
            <option value="inativo">Inativo</option>
          </select>

          <select
            value={goalFilter}
            onChange={e => setGoalFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
          >
            <option value="todos">Venda & Locação</option>
            <option value="venda">Apenas Venda</option>
            <option value="locacao">Apenas Locação</option>
            <option value="lancamento">Lançamentos</option>
          </select>
        </div>

        <button
          onClick={() => {
            setIsNewPropertyOpen(true);
            setAssignedBrokerId(team.find(b => b.role === 'corretor')?.id || team[0]?.id || '');
          }}
          className="bg-[#0B2545] hover:bg-[#0f2e59] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Imóvel (Até 15 Fotos)</span>
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Imóvel & Fotos</th>
                <th className="py-3 px-4">Bairro / Cidade</th>
                <th className="py-3 px-4">Valor Pedido</th>
                <th className="py-3 px-4">Configuração</th>
                <th className="py-3 px-4">Corretor Responsável</th>
                <th className="py-3 px-4">Portais</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map(prop => (
                <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}
                          alt=""
                          className="w-14 h-11 object-cover rounded-lg border border-slate-200 shadow-xs"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-slate-900/90 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-md shadow">
                          {prop.images.length}/15
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            {prop.code}
                          </span>
                          {prop.exclusive && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                              Exclusivo
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 max-w-[220px] truncate" title={prop.title}>
                          {prop.title}
                        </h4>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-medium">
                    <div>{prop.neighborhood}</div>
                    <div className="text-[10px] text-slate-400">{prop.city} - {prop.state || 'MG'}</div>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div>{formatCurrency(prop.price)}</div>
                    {prop.goal === 'locacao' && prop.rentalPrice && (
                      <div className="text-[10px] text-teal-700 font-semibold">
                        Locação: {formatCurrency(prop.rentalPrice)}/mês
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <div>{prop.usableArea}m² úteis</div>
                    <div className="text-[10px] text-slate-400">{prop.bedrooms} dorms ({prop.suites} suítes) • {prop.parkingSpots} vagas</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={prop.brokerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800 truncate max-w-[120px]">{prop.brokerName}</div>
                        <div className="text-[9px] font-mono text-slate-400">{prop.brokerCreci}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-800" title="ZAP Imóveis">
                        ZAP
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800" title="VivaReal">
                        VIVA
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800" title="OLX">
                        OLX
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={prop.status}
                      onChange={e => updatePropertyStatus(prop.id, e.target.value as PropertyStatus)}
                      className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer ${
                        prop.status === 'disponivel'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : prop.status === 'reservado'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : prop.status === 'vendido'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                      <option value="alugado">Alugado</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit Button with 15 Images option */}
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-indigo-200"
                        title="Editar Imóvel & Fotos (até 15 fotos)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* View Button */}
                      <button
                        onClick={() => setSelectedProperty(prop)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                        title="Ver Ficha Completa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: EDITAR IMÓVEL COM GESTÃO DE ATÉ 15 IMAGENS            */}
      {/* ============================================================== */}
      {editingProperty && editForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {editingProperty.code}
                  </span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                    Editor de Imóvel & Mídias
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display mt-1">
                  Editar Anúncio e Fotos
                </h3>
              </div>
              <button 
                onClick={() => { setEditingProperty(null); setEditForm(null); }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              
              {/* SECTION: FOTOS DO IMÓVEL (ATÉ 15 IMAGENS) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#0B2545]" />
                      <span>Galeria de Fotos do Imóvel</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        editForm.images.length === 15 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {editForm.images.length} / 15 Fotos
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Adicione fotos de alta resolução (máximo de 15 imagens). A primeira foto é a <strong>Capa Principal</strong> do anúncio.
                    </p>
                  </div>

                  {/* Upload button via file picker */}
                  <label className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    editForm.images.length >= 15
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#0B2545] hover:bg-[#0f2e59] text-white'
                  }`}>
                    <UploadCloud className="w-4 h-4" />
                    <span>Carregar Fotos (Computador)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={editForm.images.length >= 15}
                      onChange={e => processFiles(e.target.files, editForm.images, (imgs) => setEditForm({ ...editForm, images: imgs }))}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Add by URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInputEdit}
                    onChange={e => setUrlInputEdit(e.target.value)}
                    placeholder="Ou cole o link direto de uma imagem na web (https://...)"
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2545] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddUrl(true)}
                    disabled={editForm.images.length >= 15 || !urlInputEdit.trim()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Adicionar URL
                  </button>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {editForm.images.map((img, index) => {
                    const isCover = index === 0;
                    return (
                      <div 
                        key={index} 
                        className={`relative group bg-white rounded-xl overflow-hidden border-2 shadow-xs transition-all ${
                          isCover ? 'border-[#C59B27] ring-2 ring-[#C59B27]/30' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                          <img
                            src={img}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                          {isCover ? (
                            <span className="bg-[#C59B27] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" /> Capa
                            </span>
                          ) : (
                            <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                              #{index + 1}
                            </span>
                          )}
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index, true)}
                          className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-md shadow transition-colors cursor-pointer"
                          title="Remover Foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        {/* Action Toolbar on bottom */}
                        <div className="p-1.5 bg-white border-t border-slate-100 flex items-center justify-between gap-1 text-[10px]">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(index, true)}
                              className="text-[#0B2545] hover:text-amber-600 font-bold hover:underline cursor-pointer"
                              title="Tornar esta a Capa Principal"
                            >
                              Definir Capa
                            </button>
                          )}
                          {isCover && <span className="text-[10px] text-slate-400 font-semibold">Principal</span>}

                          <div className="flex items-center gap-0.5 ml-auto">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveImage(index, 'left', true)}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                              title="Mover para trás"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={index === editForm.images.length - 1}
                              onClick={() => handleMoveImage(index, 'right', true)}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                              title="Mover para frente"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {editForm.images.length === 15 && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Limite máximo de 15 imagens atingido para este imóvel. Para adicionar outras, remova alguma das fotos existentes.</span>
                  </div>
                )}
              </div>

              {/* SECTION: DADOS BÁSICOS DO IMÓVEL */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Informações Cadastrais
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Anúncio *</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2545] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Finalidade</label>
                    <select
                      value={editForm.goal}
                      onChange={e => setEditForm({ ...editForm, goal: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                    >
                      <option value="venda">Venda</option>
                      <option value="locacao">Locação</option>
                      <option value="lancamento">Lançamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Imóvel</label>
                    <select
                      value={editForm.type}
                      onChange={e => setEditForm({ ...editForm, type: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                    >
                      <option value="apartamento">Apartamento</option>
                      <option value="cobertura">Cobertura</option>
                      <option value="casa">Casa</option>
                      <option value="casa_condominio">Casa em Condomínio</option>
                      <option value="studio">Studio</option>
                      <option value="comercial">Comercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status Comercial</label>
                    <select
                      value={editForm.status}
                      onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                      <option value="alugado">Alugado</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                {/* Values */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preço Venda (R$)</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Aluguel (R$/mês)</label>
                    <input
                      type="number"
                      value={editForm.rentalPrice || ''}
                      onChange={e => setEditForm({ ...editForm, rentalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      placeholder="Ex: 3500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Condomínio (R$)</label>
                    <input
                      type="number"
                      value={editForm.condoFee || ''}
                      onChange={e => setEditForm({ ...editForm, condoFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">IPTU Anual (R$)</label>
                    <input
                      type="number"
                      value={editForm.iptuAnnual || ''}
                      onChange={e => setEditForm({ ...editForm, iptuAnnual: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Internal Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Área Útil (m²)</label>
                    <input
                      type="number"
                      value={editForm.usableArea}
                      onChange={e => setEditForm({ ...editForm, usableArea: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Quartos</label>
                    <input
                      type="number"
                      value={editForm.bedrooms}
                      onChange={e => setEditForm({ ...editForm, bedrooms: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Suítes</label>
                    <input
                      type="number"
                      value={editForm.suites}
                      onChange={e => setEditForm({ ...editForm, suites: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Banheiros</label>
                    <input
                      type="number"
                      value={editForm.bathrooms}
                      onChange={e => setEditForm({ ...editForm, bathrooms: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Vagas</label>
                    <input
                      type="number"
                      value={editForm.parkingSpots}
                      onChange={e => setEditForm({ ...editForm, parkingSpots: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={editForm.neighborhood}
                      onChange={e => setEditForm({ ...editForm, neighborhood: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço Completo</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Broker Assignment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Corretor Responsável</label>
                  <select
                    value={editForm.brokerId}
                    onChange={e => setEditForm({ ...editForm, brokerId: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    {team.map(broker => (
                      <option key={broker.id} value={broker.id}>
                        {broker.name} — {broker.creci || 'CRECI'} ({broker.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição Detalhada do Imóvel</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2545] focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Total de <strong>{editForm.images.length} fotos</strong> selecionadas (Capa: Foto #1)
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setEditingProperty(null); setEditForm(null); }}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0B2545] hover:bg-[#0f2e59] text-white px-6 py-2 text-xs font-bold rounded-xl shadow cursor-pointer transition-all"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: CADASTRAR NOVO IMÓVEL COM ATÉ 15 IMAGENS              */}
      {/* ============================================================== */}
      {isNewPropertyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Cadastrar Novo Imóvel</h3>
                <p className="text-xs text-slate-500">Cadastre fotos, metragens, valores e comissões no sistema</p>
              </div>
              <button onClick={() => setIsNewPropertyOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-5">
              
              {/* Fotos Upload Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0B2545]" />
                      <span>Fotos do Imóvel</span>
                      <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                        {newImages.length} / 15 Fotos
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Você pode colocar até 15 fotos por imóvel no sistema.
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-[#0f2e59] text-white cursor-pointer shadow-xs">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload de Fotos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={newImages.length >= 15}
                      onChange={e => processFiles(e.target.files, newImages, setNewImages)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInputNew}
                    onChange={e => setUrlInputNew(e.target.value)}
                    placeholder="Adicionar foto por URL (https://...)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddUrl(false)}
                    disabled={newImages.length >= 15 || !urlInputNew.trim()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Previews */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {newImages.map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-[#C59B27] text-white text-[8px] font-bold px-1 rounded">
                          Capa
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i, false)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded opacity-80 hover:opacity-100"
                        title="Remover"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Anúncio *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Casa com 4 Suítes no Bairro Arvoredo, Contagem"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2545] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Finalidade</label>
                  <select
                    value={goal}
                    onChange={e => setGoal(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    <option value="venda">Venda</option>
                    <option value="locacao">Locação</option>
                    <option value="lancamento">Lançamento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Imóvel</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    <option value="apartamento">Apartamento</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="casa">Casa</option>
                    <option value="casa_condominio">Casa em Condomínio</option>
                    <option value="studio">Studio</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preço Venda (R$)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Condomínio Mensal</label>
                  <input
                    type="number"
                    value={condoFee}
                    onChange={e => setCondoFee(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">IPTU Anual</label>
                  <input
                    type="number"
                    value={iptu}
                    onChange={e => setIptu(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Corretor Responsável</label>
                <select
                  value={assignedBrokerId}
                  onChange={e => setAssignedBrokerId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                >
                  {team.map(broker => (
                    <option key={broker.id} value={broker.id}>
                      {broker.name} ({broker.creci || 'CRECI'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewPropertyOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#0B2545] hover:bg-[#0f2e59] text-white px-5 py-2 text-xs font-bold rounded-xl shadow cursor-pointer transition-all"
                >
                  Salvar e Publicar Imóvel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

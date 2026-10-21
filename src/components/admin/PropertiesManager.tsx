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
  ExternalLink
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Property, PropertyStatus, PropertyType, PropertyGoal } from '../../types';

export const PropertiesManager: React.FC = () => {
  const { properties, updatePropertyStatus, addProperty, setSelectedProperty, team } = useRealEstate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [goalFilter, setGoalFilter] = useState<string>('todos');
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);

  // New property form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PropertyType>('apartamento');
  const [goal, setGoal] = useState<PropertyGoal>('venda');
  const [price, setPrice] = useState('3200000');
  const [condoFee, setCondoFee] = useState('2400');
  const [iptu, setIptu] = useState('11000');
  const [bedrooms, setBedrooms] = useState('3');
  const [suites, setSuites] = useState('3');
  const [bathrooms, setBathrooms] = useState('4');
  const [parking, setParking] = useState('3');
  const [usableArea, setUsableArea] = useState('210');
  const [neighborhood, setNeighborhood] = useState('Jardins');
  const [city, setCity] = useState('São Paulo');
  const [address, setAddress] = useState('Rua Oscar Freire, 1100');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.code.toLowerCase().includes(search.toLowerCase()) ||
                          p.neighborhood.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;
    const matchesGoal = goalFilter === 'todos' || p.goal === goalFilter;
    return matchesSearch && matchesStatus && matchesGoal;
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const broker = team.find(b => b.role === 'corretor') || team[1];

    addProperty({
      title,
      description: description || 'Excelente imóvel em localização privilegiada.',
      type,
      goal,
      status: 'disponivel',
      price: Number(price) || 2000000,
      condoFee: Number(condoFee) || 0,
      iptuAnnual: Number(iptu) || 0,
      bedrooms: Number(bedrooms) || 2,
      suites: Number(suites) || 1,
      bathrooms: Number(bathrooms) || 2,
      parkingSpots: Number(parking) || 2,
      totalArea: Number(usableArea) * 1.25,
      usableArea: Number(usableArea) || 150,
      neighborhood,
      city,
      state: 'SP',
      address,
      coordinates: { lat: -23.567, lng: -46.666 },
      features: ['Varanda Gourmet', 'Piscina', 'Portaria 24h', 'Academia', 'Pet Friendly'],
      images: [imageUrl],
      brokerId: broker.id,
      brokerName: broker.name,
      brokerPhone: broker.phone,
      brokerCreci: broker.creci || 'CRECI 189.442-F',
      brokerAvatar: broker.avatar,
      exclusive: true,
      featured: true,
      portalsSynced: { zap: true, vivaReal: true, olx: true }
    });

    setIsNewPropertyOpen(false);
    setTitle('');
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
              placeholder="Buscar por código, título, bairro..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
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
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="todos">Venda & Locação</option>
            <option value="venda">Apenas Venda</option>
            <option value="locacao">Apenas Locação</option>
            <option value="lancamento">Lançamentos</option>
          </select>
        </div>

        <button
          onClick={() => setIsNewPropertyOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Imóvel</span>
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Imóvel</th>
                <th className="py-3 px-4">Bairro / Cidade</th>
                <th className="py-3 px-4">Valor Pedido</th>
                <th className="py-3 px-4">Configuração</th>
                <th className="py-3 px-4">Portais Sincronizados</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map(prop => (
                <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.images[0]}
                        alt=""
                        className="w-12 h-10 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-500 block">
                          {prop.code}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 max-w-[220px] truncate">
                          {prop.title}
                        </h4>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {prop.neighborhood}, {prop.city}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatCurrency(prop.price)}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {prop.usableArea}m² • {prop.bedrooms} dorms • {prop.parkingSpots} vagas
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800" title="ZAP Imóveis">
                        ZAP
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800" title="VivaReal">
                        VIVA
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800" title="OLX">
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
                    <button
                      onClick={() => setSelectedProperty(prop)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      title="Ver Detalhes do Anúncio"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cadastrar Imóvel Modal */}
      {isNewPropertyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 font-display">Cadastrar Novo Imóvel</h3>
              <button onClick={() => setIsNewPropertyOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Anúncio *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Apartamento Reformado com Varanda Gourmet nos Jardins"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
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

              <div className="grid grid-cols-2 gap-3">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Imagem de Destaque</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                />
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
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Salvar e Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

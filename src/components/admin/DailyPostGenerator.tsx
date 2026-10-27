import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Share2, 
  MessageCircle, 
  Calendar, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Edit3, 
  Eye, 
  Layers, 
  Instagram, 
  ExternalLink,
  ChevronRight,
  Sliders,
  Send
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  DailySocialPost, 
  generateDailySocialPost, 
  DAILY_MARKETING_THEMES 
} from '../../services/aiMarketingService';
import { MORADA_BRAND } from '../../data/mockDatabase';
import { MoradaLogo } from '../common/MoradaLogo';

export const DailyPostGenerator: React.FC = () => {
  const { properties, showToast } = useRealEstate();

  const todayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState<number>(todayIndex);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || 'institucional');
  const [selectedNetwork, setSelectedNetwork] = useState<'instagram' | 'whatsapp' | 'stories'>('instagram');
  const [selectedTone, setSelectedTone] = useState<'alto_padrao' | 'comercial' | 'educativo' | 'urgencia'>('alto_padrao');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Active Post State
  const [currentPost, setCurrentPost] = useState<DailySocialPost | null>(null);

  // Canvas ref for direct PNG generation
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initial load
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async (targetDay = selectedDay, targetPropId = selectedPropertyId) => {
    setIsGenerating(true);
    const prop = targetPropId === 'institucional' ? undefined : properties.find(p => p.id === targetPropId);
    
    try {
      const post = await generateDailySocialPost({
        dayIndex: targetDay,
        property: prop,
        network: selectedNetwork,
        tone: selectedTone
      });
      setCurrentPost(post);
      showToast(`Post diário de ${DAILY_MARKETING_THEMES[targetDay].day} gerado com sucesso!`, 'Marketing IA', 'crm');
    } catch (err) {
      showToast('Erro ao gerar post com IA. Tente novamente.', 'Erro', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = () => {
    if (!currentPost) return;
    navigator.clipboard.writeText(currentPost.caption);
    setCopiedCaption(true);
    showToast('Legenda completa com telefones e hashtags copiada!', 'Legenda', 'crm');
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    if (!currentPost) return;
    const text = encodeURIComponent(currentPost.caption);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Render high-res PNG image on canvas
  const renderCardToCanvas = async (post: DailySocialPost): Promise<HTMLCanvasElement> => {
    const isStory = post.format === 'story_vertical';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Não foi possível obter contexto do canvas');

    // 1. Draw Background Image or Fallback Gradient
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = post.imageUrl;
      });

      // Cover crop image
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
    } catch {
      // Elegant architectural gradient fallback
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a101f');
      bgGrad.addColorStop(0.5, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Dark Overlay Gradient for contrast
    const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
    overlayGrad.addColorStop(0, 'rgba(10, 16, 31, 0.85)');
    overlayGrad.addColorStop(0.3, 'rgba(10, 16, 31, 0.4)');
    overlayGrad.addColorStop(0.7, 'rgba(10, 16, 31, 0.75)');
    overlayGrad.addColorStop(1, 'rgba(10, 16, 31, 0.98)');
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Top Header: Morada Digital Logo & Badge
    // Logo pill background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    roundRect(ctx, 60, 60, 480, 100, 24);
    ctx.fill();

    // Brand mark circle
    ctx.fillStyle = '#6366f1'; // Indigo accent
    roundRect(ctx, 80, 80, 60, 60, 16);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('M', 96, 122);

    // Brand name text
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('MORADA DIGITAL', 160, 114);
    ctx.fillStyle = '#34d399'; // Emerald accent
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('100% DIGITAL • LANÇAMENTO 2026', 160, 138);

    // Day & Theme Badge (top right)
    ctx.fillStyle = '#4f46e5';
    roundRect(ctx, width - 420, 60, 360, 60, 18);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${post.dayOfWeek.toUpperCase()}`, width - 240, 98);
    ctx.textAlign = 'left';

    // 4. Center Content (Headline, Subtitle, Bullets)
    const contentStartY = isStory ? 700 : 420;

    // Eyebrow Tag
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`★  ${post.themeTitle.toUpperCase()}`, 60, contentStartY);

    // Main Headline (wrap if long)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px sans-serif';
    wrapText(ctx, post.headline, 60, contentStartY + 65, width - 120, 68);

    // Subheadline
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '30px sans-serif';
    ctx.fillText(post.subheadline, 60, contentStartY + 180);

    // Bullet points box
    const bulletBoxY = contentStartY + 230;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    roundRect(ctx, 60, bulletBoxY, width - 120, 180, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '26px sans-serif';
    post.bullets.forEach((bullet, idx) => {
      ctx.fillText(bullet, 90, bulletBoxY + 50 + idx * 45);
    });

    // 5. FOOTER BANNER: LOGO, TELEFONE FIXO, WHATSAPP & CRECI
    const footerY = height - 200;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, footerY, width, 200);

    // Top border of footer
    const gradLine = ctx.createLinearGradient(0, 0, width, 0);
    gradLine.addColorStop(0, '#4f46e5');
    gradLine.addColorStop(0.5, '#10b981');
    gradLine.addColorStop(1, '#06b6d4');
    ctx.fillStyle = gradLine;
    ctx.fillRect(0, footerY, width, 5);

    // Phone 1: Telefone Fixo (31) 3357-3030
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('📞 Fixo: (31) 3357-3030', 60, footerY + 65);

    // Phone 2: WhatsApp (31) 98427-9865
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('💬 WhatsApp: (31) 98427-9865', 560, footerY + 65);

    // Address & CRECI line
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText(`📍 ${post.address}`, 60, footerY + 120);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`🛡️ ${post.creci} • Direção: ${post.directorName} (${post.directorCreci})`, 60, footerY + 155);

    return canvas;
  };

  const handleDownloadCard = async () => {
    if (!currentPost) return;
    setIsDownloading(true);

    try {
      const canvas = await renderCardToCanvas(currentPost);
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = `morada-digital-post-${currentPost.dayOfWeek.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      showToast('Card em alta resolução baixado com sucesso!', 'Download Concluído', 'crm');
    } catch (err) {
      showToast('Erro ao exportar card em imagem.', 'Erro', 'info');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCardImage = async () => {
    if (!currentPost) return;
    try {
      const canvas = await renderCardToCanvas(currentPost);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedImage(true);
          showToast('Imagem do card copiada para a área de transferência!', 'Card Copiado', 'crm');
          setTimeout(() => setCopiedImage(false), 3000);
        } catch {
          // If clipboard.write image is blocked by browser permissions, trigger download
          handleDownloadCard();
        }
      });
    } catch {
      handleDownloadCard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gerador de Post Diário com IA • Morada Digital</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Post Diário para Redes Sociais com Logo & Telefones
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Gere criativos e legendas irresistíveis com 1 clique para o Instagram, Stories e WhatsApp.
              Todos os posts incluem automaticamente o <strong>Telefone Fixo (31) 3357-3030</strong>, <strong>WhatsApp (31) 98427-9865</strong>, a logo e o CRECI homologado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gerando com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Gerar Post de Hoje</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Days of week selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-6 pt-6 border-t border-slate-800/80">
          {[1, 2, 3, 4, 5, 6, 0].map(dayIdx => {
            const item = DAILY_MARKETING_THEMES[dayIdx];
            const isToday = dayIdx === todayIndex;
            const isSelected = dayIdx === selectedDay;

            return (
              <button
                key={dayIdx}
                type="button"
                onClick={() => {
                  setSelectedDay(dayIdx);
                  handleGenerate(dayIdx);
                }}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-[1.02]'
                    : isToday
                    ? 'bg-indigo-950/60 text-slate-200 border-indigo-500/40 hover:bg-indigo-900/50'
                    : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{item.day.split('-')[0]}</span>
                  {isToday && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                      Hoje
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-semibold mt-1 truncate" title={item.theme}>
                  {item.theme}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Card Preview Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            
            {/* Top Toolbar of Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Visual do Card:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNetwork('instagram');
                      if (currentPost) setCurrentPost({ ...currentPost, format: 'feed_quadrado', targetNetwork: 'instagram' });
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      selectedNetwork === 'instagram' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Feed 1:1 (Quadrado)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNetwork('stories');
                      if (currentPost) setCurrentPost({ ...currentPost, format: 'story_vertical', targetNetwork: 'stories' });
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      selectedNetwork === 'stories' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Stories 9:16 (Vertical)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isCustomizing ? 'Fechar Ajustes' : 'Personalizar Card'}</span>
                </button>
              </div>
            </div>

            {/* Quick Customization Drawer (if toggled) */}
            {isCustomizing && currentPost && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs animate-in fade-in">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Personalizar Textos do Card</span>
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Título / Headline do Card</label>
                  <input
                    type="text"
                    value={currentPost.headline}
                    onChange={(e) => setCurrentPost({ ...currentPost, headline: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={currentPost.subheadline}
                    onChange={(e) => setCurrentPost({ ...currentPost, subheadline: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentPost.bullets.map((bullet, idx) => (
                    <div key={idx}>
                      <label className="block text-[10px] text-slate-500 font-medium">Tópico {idx + 1}</label>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const newBullets = [...currentPost.bullets];
                          newBullets[idx] = e.target.value;
                          setCurrentPost({ ...currentPost, bullets: newBullets });
                        }}
                        className="w-full bg-white border border-slate-300 px-2.5 py-1 rounded-lg text-slate-800 text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISUAL SOCIAL CARD CANVAS SIMULATOR */}
            {currentPost ? (
              <div className="flex justify-center bg-slate-900/5 p-4 rounded-2xl border border-slate-200/80">
                <div 
                  className={`w-full max-w-lg bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border-2 border-slate-800 transition-all ${
                    currentPost.format === 'story_vertical' ? 'aspect-[9/16]' : 'aspect-square'
                  }`}
                  style={{
                    backgroundImage: `url(${currentPost.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Dark gradient overlay for extreme readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-slate-950/95 pointer-events-none" />

                  {/* Header Strip with Morada Logo */}
                  <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 bg-slate-950/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-xs">
                        M
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-wider text-white">MORADA DIGITAL</div>
                        <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                          100% Digital • Lançamento 2026
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-indigo-400/30 shadow-md">
                      {currentPost.dayOfWeek}
                    </div>
                  </div>

                  {/* Center Content: Headline & Bullets */}
                  <div className="relative z-10 p-5 sm:p-6 space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{currentPost.themeTitle}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                      {currentPost.headline}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      {currentPost.subheadline}
                    </p>

                    {/* Highlights bullets box */}
                    <div className="bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 space-y-1.5 shadow-lg">
                      {currentPost.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-100 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FOOTER BAR: ALWAYS WITH TELEFONE FIXO, WHATSAPP & CRECI */}
                  <div className="relative z-10 bg-slate-950 border-t-2 border-indigo-500 p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <Phone className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Fixo: {currentPost.landlinePhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp: {currentPost.whatsappPhone}</span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-[10px] text-slate-400 gap-1">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{currentPost.address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300 font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{currentPost.creci}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : null}

            {/* Action Buttons for Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isDownloading || !currentPost}
                  onClick={handleDownloadCard}
                  className="px-4 py-2.5 bg-[#0B2545] hover:bg-[#12335c] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Gerando Imagem...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Card em Alta Resolução (PNG)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={!currentPost}
                  onClick={handleCopyCardImage}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copiar imagem para colar no WhatsApp Web ou Canva"
                >
                  {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedImage ? 'Imagem Copiada!' : 'Copiar Imagem'}</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                Logo + Fixo + WhatsApp 100% integrados
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: AI Caption & WhatsApp Publishing (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Controls Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Configurações do Post com IA</span>
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Imóvel em Destaque</label>
              <select
                value={selectedPropertyId}
                onChange={(e) => {
                  setSelectedPropertyId(e.target.value);
                  handleGenerate(selectedDay, e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl text-slate-800 font-medium"
              >
                <option value="institucional">Post Institucional Morada Digital (Contagem & Arvoredo)</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.code}] {p.title.slice(0, 45)}... (R$ {(p.price / 1000).toLocaleString('pt-BR')}k)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tom da Comunicação</label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl text-slate-800"
                >
                  <option value="alto_padrao">Alto Padrão / Sofisticado</option>
                  <option value="comercial">Direto & Comercial</option>
                  <option value="educativo">Educativo & Dica</option>
                  <option value="urgencia">Oportunidade & Urgência</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rede Principal</label>
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl text-slate-800"
                >
                  <option value="instagram">Instagram Feed</option>
                  <option value="stories">Instagram Stories</option>
                  <option value="whatsapp">WhatsApp Status</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Regerar Legenda e Criativo com IA</span>
            </button>
          </div>

          {/* Formatted Caption Preview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Legenda Formatada para Redes Sociais</span>
              </h3>

              <button
                type="button"
                onClick={handleCopyCaption}
                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Copiado!' : 'Copiar Legenda'}</span>
              </button>
            </div>

            {currentPost ? (
              <div className="space-y-3">
                <textarea
                  rows={13}
                  value={currentPost.caption}
                  onChange={(e) => setCurrentPost({ ...currentPost, caption: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-slate-800 font-mono text-[11.5px] leading-relaxed outline-none focus:border-indigo-500 focus:bg-white resize-y"
                />

                {/* Direct Action Bar */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copiar Texto</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Postar no WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Institutional Guarantee Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Assinatura Automática em Todas as Postagens</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Conforme as diretrizes da Morada Digital, todos os criativos e legendas incluem obrigatoriamente o <strong>Telefone Fixo (31) 3357-3030</strong>, o <strong>WhatsApp (31) 98427-9865</strong>, a logo oficial e o CRECI nº 104.900-J/MG da agência.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

// Canvas drawing helpers
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

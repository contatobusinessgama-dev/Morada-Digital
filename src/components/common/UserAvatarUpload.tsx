import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Link as LinkIcon, 
  Trash2, 
  Check, 
  Sparkles, 
  AlertCircle,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { processAvatarFile, PROFESSIONAL_AVATAR_PRESETS } from '../../utils/imageUtils';

interface UserAvatarUploadProps {
  currentAvatar: string;
  userName?: string;
  userRole?: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  size?: 'md' | 'lg';
}

export const UserAvatarUpload: React.FC<UserAvatarUploadProps> = ({
  currentAvatar,
  userName = 'Usuário',
  userRole,
  onAvatarChange,
  size = 'md'
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setSuccessInfo(null);
    setIsProcessing(true);

    try {
      const result = await processAvatarFile(file, 320, 0.85);
      onAvatarChange(result.dataUrl);
      setSuccessInfo(`Foto real carregada! Otimizada de ${result.originalSizeKb} KB para ${result.compressedSizeKb} KB.`);
      setTimeout(() => setSuccessInfo(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao processar a foto enviada.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset file input so user can pick the same file again if desired
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlValue.trim()) return;
    onAvatarChange(urlValue.trim());
    setShowUrlInput(false);
    setUrlValue('');
    setSuccessInfo('Link da foto atualizado com sucesso!');
    setTimeout(() => setSuccessInfo(null), 4000);
  };

  const handleSelectPreset = (url: string) => {
    onAvatarChange(url);
    setShowGallery(false);
    setSuccessInfo('Foto de modelo profissional selecionada!');
    setTimeout(() => setSuccessInfo(null), 4000);
  };

  const handleRemovePhoto = () => {
    // Generate initials fallback avatar placeholder
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0B2545&color=fff&size=256&bold=true`;
    onAvatarChange(fallback);
    setSuccessInfo('Foto removida. Utilizando avatar padrão com iniciais.');
    setTimeout(() => setSuccessInfo(null), 4000);
  };

  const avatarSizeClasses = size === 'lg' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-20 h-20';

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-all">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={onFileInputChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Avatar Preview with Camera Overlay */}
        <div 
          className={`relative group shrink-0 ${avatarSizeClasses} rounded-2xl overflow-hidden cursor-pointer shadow-md border-2 ${
            isDragging ? 'border-indigo-500 scale-105' : 'border-white'
          } bg-slate-200 transition-all`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          title="Clique ou arraste uma foto para trocar"
        >
          {currentAvatar ? (
            <img 
              src={currentAvatar} 
              alt={userName} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                // If broken link, replace with initials
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0B2545&color=fff&size=256&bold=true`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-900 text-white font-bold text-xl">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Hover / Active Camera Badge */}
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold leading-tight">Trocar Foto Real</span>
              </>
            )}
          </div>

          {/* Bottom small camera tag always visible */}
          <div className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1 rounded-lg shadow-sm border border-white">
            <Camera className="w-3 h-3" />
          </div>
        </div>

        {/* Action Controls & Information */}
        <div className="flex-1 w-full space-y-2 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h4 className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                <span>Foto de Perfil Real</span>
                {userRole && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {userRole}
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-500">
                Envie uma foto do seu computador ou celular (JPG, PNG ou WEBP).
              </p>
            </div>
          </div>

          {/* Upload Button Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Carregar Foto Real</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowUrlInput(!showUrlInput);
                setShowGallery(false);
              }}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3 h-3 text-slate-500" />
              <span>Inserir URL</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowGallery(!showGallery);
                setShowUrlInput(false);
              }}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Modelos</span>
            </button>

            <button
              type="button"
              onClick={handleRemovePhoto}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Remover foto atual e usar avatar com iniciais"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-rose-600 text-[11px] bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successInfo && (
            <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>{successInfo}</span>
            </div>
          )}
        </div>
      </div>

      {/* URL Input Dropdown/Accordion */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
          <input
            type="url"
            placeholder="https://exemplo.com/minha-foto.jpg"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            className="flex-1 bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
          >
            ✕
          </button>
        </form>
      )}

      {/* Preset Gallery Picker */}
      {showGallery && (
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-[11px] text-slate-600 font-bold">
            <span>Selecione uma foto profissional modelo:</span>
            <button 
              type="button" 
              onClick={() => setShowGallery(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PROFESSIONAL_AVATAR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                className="group relative rounded-xl overflow-hidden aspect-square border-2 border-transparent hover:border-indigo-600 focus:outline-none transition-all cursor-pointer"
                title={preset.label}
              >
                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

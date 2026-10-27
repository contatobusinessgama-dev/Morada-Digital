/**
 * Image processing utilities for client-side avatar and photo uploads
 * Resizes and crops images to a square base64 JPEG (< 40KB) for fast, safe localStorage persistence
 */

export const processAvatarFile = (
  file: File,
  targetSize: number = 320,
  quality: number = 0.85
): Promise<{ dataUrl: string; originalSizeKb: number; compressedSizeKb: number }> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida. Escolha JPG, PNG ou WEBP.'));
      return;
    }

    const originalSizeKb = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Falha ao ler o arquivo selecionado.'));
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('Não foi possível carregar a imagem.'));
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Erro no contexto gráfico do navegador.'));
            return;
          }

          // Enable smooth scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Center crop logic (fill square without distortion)
          const srcWidth = img.naturalWidth || img.width;
          const srcHeight = img.naturalHeight || img.height;
          const minDim = Math.min(srcWidth, srcHeight);
          const startX = (srcWidth - minDim) / 2;
          const startY = (srcHeight - minDim) / 2;

          ctx.drawImage(
            img,
            startX,
            startY,
            minDim,
            minDim,
            0,
            0,
            targetSize,
            targetSize
          );

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          // Calculate approx size in KB
          const compressedSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

          resolve({
            dataUrl,
            originalSizeKb,
            compressedSizeKb
          });
        } catch (err: any) {
          reject(new Error(err.message || 'Erro ao processar imagem no navegador.'));
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Professional real avatar suggestions if user wants to pick a sample
 */
export const PROFESSIONAL_AVATAR_PRESETS = [
  {
    label: 'Diretor Executivo (Terno Escuro)',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Gestor Comercial (Blazer Azul)',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Corretora de Alto Padrão (Elegante)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Corretor Sênior (Camisa Social)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Especialista em Locações',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Avaliador Imobiliário',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  }
];

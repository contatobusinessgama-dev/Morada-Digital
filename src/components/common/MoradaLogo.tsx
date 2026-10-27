import React from 'react';

interface MoradaLogoProps {
  variant?: 'light' | 'dark' | 'color';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Official Morada Digital Logo
 * Faithful vector reproduction of the user's brand identity:
 * - Bespoke "MD" architectural emblem with gabled roof & golden arched 4-pane window
 * - Classic Roman serif wordmark "MORADA"
 * - Balanced teal flanked subtitle "—— DIGITAL ——"
 * - Tagline "SUA IMOBILIÁRIA INTELIGENTE"
 */
export const MoradaLogo: React.FC<MoradaLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  orientation = 'horizontal',
  className = ''
}) => {
  // Variant determines foreground colors based on background
  // 'dark' = for light backgrounds (slate-900 / navy text)
  // 'light' = for dark backgrounds (white / gold / teal on dark-blue)
  // 'color' = deep navy and gold on light backgrounds
  const isLightBackground = variant === 'dark' || variant === 'color';
  const navyColor = isLightBackground ? '#0B2545' : '#FFFFFF';
  const tealColor = isLightBackground ? '#16655E' : '#2DD4BF';
  const goldColor = '#C59B27';
  const taglineColor = isLightBackground ? '#0F2E59' : '#94A3B8';
  const ruleColor = isLightBackground ? '#16655E' : '#2DD4BF';

  const sizeStyles = {
    sm: {
      emblemW: 34,
      emblemH: 26,
      moradaSize: 'text-base font-bold tracking-[0.14em]',
      digitalSize: 'text-[9px] font-semibold tracking-[0.24em]',
      taglineSize: 'text-[7.5px] font-medium tracking-[0.18em]',
      gap: 'gap-2.5',
      lineW: 'w-4'
    },
    md: {
      emblemW: 44,
      emblemH: 34,
      moradaSize: 'text-xl sm:text-2xl font-bold tracking-[0.14em]',
      digitalSize: 'text-[11px] font-semibold tracking-[0.28em]',
      taglineSize: 'text-[8.5px] sm:text-[9.5px] font-medium tracking-[0.22em]',
      gap: 'gap-3.5',
      lineW: 'w-6'
    },
    lg: {
      emblemW: 60,
      emblemH: 46,
      moradaSize: 'text-2xl sm:text-3xl font-bold tracking-[0.15em]',
      digitalSize: 'text-xs sm:text-sm font-semibold tracking-[0.3em]',
      taglineSize: 'text-[10px] sm:text-xs font-medium tracking-[0.22em]',
      gap: 'gap-4',
      lineW: 'w-8'
    },
    xl: {
      emblemW: 84,
      emblemH: 64,
      moradaSize: 'text-4xl sm:text-5xl font-bold tracking-[0.16em]',
      digitalSize: 'text-sm sm:text-base font-semibold tracking-[0.32em]',
      taglineSize: 'text-xs sm:text-sm font-medium tracking-[0.24em]',
      gap: 'gap-5',
      lineW: 'w-12'
    }
  }[size];

  // SVG Architectural MD Monogram with Gable Roof & Golden Arched Window
  const EmblemSvg = (
    <svg
      width={sizeStyles.emblemW}
      height={sizeStyles.emblemH}
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="Morada Digital Emblema"
    >
      {/* 1. Gabled Architectural Roof Peak over the Monogram */}
      {/* Outer Gable Peak */}
      <path
        d="M 24 58 L 80 18 L 136 58 L 126 68 L 80 34 L 34 68 Z"
        fill={navyColor}
      />

      {/* 2. Letter "M" Monogram (Left side) */}
      {/* Left serif foot */}
      <path
        d="M 18 108 L 40 108 L 40 103 L 34 103 L 34 66 L 24 66 L 24 103 L 18 103 Z"
        fill={navyColor}
      />
      {/* Center diagonal slope of M */}
      <path
        d="M 34 66 L 62 100 L 72 88 L 48 58 Z"
        fill={navyColor}
      />

      {/* 3. Golden Arched Window (Center facade under the roof apex) */}
      {/* Arched Window Outer Frame */}
      <path
        d="M 68 76 C 68 68 73 62 80 62 C 87 62 92 68 92 76 L 92 104 L 68 104 Z"
        fill="none"
        stroke={goldColor}
        strokeWidth="3.2"
      />
      {/* Window Vertical Divider */}
      <line
        x1="80"
        y1="63"
        x2="80"
        y2="104"
        stroke={goldColor}
        strokeWidth="2.4"
      />
      {/* Window Horizontal Divider */}
      <line
        x1="69"
        y1="82"
        x2="91"
        y2="82"
        stroke={goldColor}
        strokeWidth="2.4"
      />
      {/* Golden Window Panes Fills (Subtle warmth) */}
      <path
        d="M 70 76 C 70 70 74 65 78.5 64 L 78.5 80.5 L 70 80.5 Z"
        fill={goldColor}
        fillOpacity="0.25"
      />
      <path
        d="M 90 76 C 90 70 86 65 81.5 64 L 81.5 80.5 L 90 80.5 Z"
        fill={goldColor}
        fillOpacity="0.25"
      />
      <rect
        x="70"
        y="83.5"
        width="8.5"
        height="19"
        fill={goldColor}
        fillOpacity="0.25"
      />
      <rect
        x="81.5"
        y="83.5"
        width="8.5"
        height="19"
        fill={goldColor}
        fillOpacity="0.25"
      />

      {/* 4. Letter "D" Monogram (Right side) */}
      <path
        d="M 112 56 L 112 108 L 126 108 C 142 108 152 98 152 82 C 152 66 142 56 126 56 Z M 122 66 C 134 66 140 73 140 82 C 140 91 134 98 122 98 L 122 66 Z"
        fill={navyColor}
      />
    </svg>
  );

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {EmblemSvg}
        <div className="mt-2.5">
          <h1
            className={`font-serif uppercase ${sizeStyles.moradaSize}`}
            style={{ color: navyColor, fontFamily: 'Cinzel, Georgia, "Times New Roman", serif' }}
          >
            MORADA
          </h1>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span className={`${sizeStyles.lineW} h-[1.5px]`} style={{ backgroundColor: ruleColor }} />
            <span
              className={`font-sans uppercase font-bold ${sizeStyles.digitalSize}`}
              style={{ color: tealColor }}
            >
              DIGITAL
            </span>
            <span className={`${sizeStyles.lineW} h-[1.5px]`} style={{ backgroundColor: ruleColor }} />
          </div>
          {showTagline && (
            <p
              className={`font-sans uppercase mt-1 ${sizeStyles.taglineSize}`}
              style={{ color: taglineColor }}
            >
              SUA IMOBILIÁRIA INTELIGENTE
            </p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal Layout (Standard for Header, Nav, and Footer)
  return (
    <div className={`flex items-center ${sizeStyles.gap} select-none ${className}`}>
      {EmblemSvg}
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif uppercase ${sizeStyles.moradaSize}`}
          style={{ color: navyColor, fontFamily: 'Cinzel, Georgia, "Times New Roman", serif' }}
        >
          MORADA
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className={`${sizeStyles.lineW} h-[1.5px]`} style={{ backgroundColor: ruleColor }} />
          <span
            className={`font-sans uppercase font-bold ${sizeStyles.digitalSize}`}
            style={{ color: tealColor }}
          >
            DIGITAL
          </span>
          <span className={`${sizeStyles.lineW} h-[1.5px]`} style={{ backgroundColor: ruleColor }} />
        </div>
        {showTagline && (
          <span
            className={`font-sans uppercase mt-1 ${sizeStyles.taglineSize}`}
            style={{ color: taglineColor }}
          >
            SUA IMOBILIÁRIA INTELIGENTE
          </span>
        )}
      </div>
    </div>
  );
};

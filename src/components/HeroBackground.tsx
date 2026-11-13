import React from 'react';

/**
 * Premium Hero Vector Background for DESIGNS SHOPEE
 * Recreates the visual atmosphere:
 * - Warm ivory / cream base (#FDFBF7)
 * - Large flowing orange (#FF5A1F) and golden-yellow (#FFC400) abstract curves
 * - Layered wave shapes with smooth gradients
 * - Thin curved accent lines echoing the waves
 * - Subtle geometric dotted matrices
 * - Soft luminous radial glows & zero horizontal overflow
 */
export const HeroBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#FDFBF7]"
      aria-hidden="true"
    >
      {/* 1. Ambient Warm Radial Glows */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#FF5A1F]/20 via-[#FFC400]/25 to-transparent blur-3xl transform -translate-x-1/4 -translate-y-1/4" 
      />
      <div 
        className="absolute top-1/4 -right-28 w-[32rem] h-[32rem] rounded-full bg-gradient-to-bl from-[#FFC400]/25 via-[#FF5A1F]/15 to-transparent blur-3xl" 
      />
      <div 
        className="absolute -bottom-24 left-1/3 w-[28rem] h-[28rem] rounded-full bg-gradient-to-t from-[#FF8A3D]/20 via-[#FFD54F]/15 to-transparent blur-3xl" 
      />

      {/* 2. Scalable High-Fidelity SVG Vector Composition */}
      <svg
        className="w-full h-full absolute inset-0 preserve-3d"
        viewBox="0 0 1440 820"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Vibrant Orange to Golden Yellow Primary Gradient */}
          <linearGradient id="heroGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5A1F" />
            <stop offset="45%" stopColor="#FF8A3D" />
            <stop offset="100%" stopColor="#FFC400" />
          </linearGradient>

          {/* Golden Yellow to Bright Orange Accent Gradient */}
          <linearGradient id="heroGradGold" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFC400" />
            <stop offset="100%" stopColor="#FF7A29" />
          </linearGradient>

          {/* Deep Orange-Red to Warm Coral Gradient */}
          <linearGradient id="heroGradWarmRed" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E64A19" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#FF5A1F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFA000" stopOpacity="0.75" />
          </linearGradient>

          {/* Soft Shadow Filter for Natural Depth */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#FF5A1F" floodOpacity="0.12" />
          </filter>

          <filter id="waveShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="4" dy="8" stdDeviation="12" floodColor="#101010" floodOpacity="0.06" />
          </filter>

          {/* Dotted Decorative Pattern */}
          <pattern id="dotPatternGold" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#FFB300" fillOpacity="0.4" />
          </pattern>

          <pattern id="dotPatternOrange" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.75" fill="#FF5A1F" fillOpacity="0.32" />
          </pattern>
        </defs>

        {/* --- TOP-LEFT: Flowing Abstract Waves & Curves --- */}
        <g filter="url(#softShadow)">
          {/* Base Layer Outer Curve */}
          <path
            d="M-80 -60 C140 -80, 360 40, 310 240 C270 380, 110 440, -40 460 Z"
            fill="url(#heroGradGold)"
            fillOpacity="0.75"
          />
          {/* Inner Overlapping Vibrant Curve */}
          <path
            d="M-60 -60 C100 -50, 260 20, 220 180 C180 300, 40 370, -60 380 Z"
            fill="url(#heroGradPrimary)"
            fillOpacity="0.9"
          />
        </g>

        {/* Top-Left Thin Decorative Echo Lines */}
        <path
          d="M-40 40 C160 40, 390 130, 340 310 C310 420, 160 480, -20 500"
          stroke="#FFA726"
          strokeWidth="1.75"
          strokeDasharray="6 8"
          strokeOpacity="0.6"
          fill="none"
        />
        <path
          d="M-40 90 C140 90, 340 170, 300 330 C270 430, 130 480, -20 490"
          stroke="#FF7043"
          strokeWidth="1"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Top-Left Dotted Accent Cluster */}
        <rect x="220" y="80" width="120" height="120" fill="url(#dotPatternOrange)" />

        {/* --- RIGHT SIDE: Flowing Sweeping Wave & Crests --- */}
        <g filter="url(#waveShadow)">
          {/* Secondary Golden Yellow Wave Layer */}
          <path
            d="M1520 60 C1320 80, 1180 240, 1220 440 C1260 620, 1420 740, 1520 780 Z"
            fill="url(#heroGradGold)"
            fillOpacity="0.8"
          />
          {/* Foreground Primary Orange Wave */}
          <path
            d="M1520 140 C1360 180, 1260 310, 1290 480 C1320 620, 1440 720, 1520 740 Z"
            fill="url(#heroGradPrimary)"
            fillOpacity="0.92"
          />
        </g>

        {/* Right Side Thin Tracer Accent Curves */}
        <path
          d="M1520 20 C1280 60, 1120 230, 1170 470 C1220 680, 1400 800, 1520 840"
          stroke="#FF9800"
          strokeWidth="2"
          strokeOpacity="0.5"
          fill="none"
        />
        <path
          d="M1520 80 C1320 120, 1190 270, 1230 480 C1270 660, 1420 780, 1520 810"
          stroke="#FFB300"
          strokeWidth="1.25"
          strokeDasharray="8 6"
          strokeOpacity="0.55"
          fill="none"
        />

        {/* Right Side Geometric Dotted Accent */}
        <rect x="1140" y="260" width="100" height="140" fill="url(#dotPatternGold)" />

        {/* --- BOTTOM-LEFT & BOTTOM-CENTER: Flowing Undercurrent Waves --- */}
        <g filter="url(#softShadow)">
          {/* Deep Orange-Red Base Undulation */}
          <path
            d="M-40 680 C180 660, 320 740, 520 730 C720 720, 860 790, 1020 850 L-40 850 Z"
            fill="url(#heroGradWarmRed)"
            fillOpacity="0.6"
          />

          {/* Layered Golden Orange Smooth Wave */}
          <path
            d="M-40 730 C160 710, 360 780, 580 750 C780 720, 940 820, 1100 850 L-40 850 Z"
            fill="url(#heroGradPrimary)"
            fillOpacity="0.75"
          />
        </g>

        {/* Bottom Curved Contour Tracer Line */}
        <path
          d="M-20 640 C200 630, 380 720, 600 700 C800 680, 980 780, 1160 850"
          stroke="#FFB300"
          strokeWidth="1.75"
          strokeDasharray="10 8"
          strokeOpacity="0.6"
          fill="none"
        />

        {/* Bottom Floating Dotted Matrix */}
        <rect x="420" y="680" width="160" height="80" fill="url(#dotPatternGold)" opacity="0.6" />

        {/* Subtle Organic Floating Rings */}
        <circle cx="280" cy="540" r="18" stroke="#FF9800" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
        <circle cx="305" cy="525" r="7" fill="#FFC400" fillOpacity="0.25" />
        <circle cx="1180" cy="180" r="14" stroke="#FF7A29" strokeWidth="1.5" strokeOpacity="0.35" fill="none" />
      </svg>
    </div>
  );
};


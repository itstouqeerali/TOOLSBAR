import React from 'react';

interface ToolsbarLogoProps {
  className?: string;
  size?: number | string;
  ariaLabel?: string;
}

/**
 * Official Toolsbar geometric brand mark
 * Precision vector geometry matching the official Toolsbar brand identity
 */
export const ToolsbarLogo: React.FC<ToolsbarLogoProps> = ({ 
  className = "w-6 h-6", 
  size, 
  ariaLabel = "Toolsbar" 
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
      role="img"
      aria-label={ariaLabel}
    >
      {/* 1. Top horizontal slanted bar */}
      <polygon points="28.5,24.5 52.0,24.5 45.8,34.5 34.3,34.5" />

      {/* 2. Top-Right diagonal facet bar */}
      <polygon points="54.2,24.5 63.8,24.5 78.5,50.0 70.8,50.0 59.2,34.5 54.2,24.5" />

      {/* 3. Mid-Left protruding horizontal wing */}
      <polygon points="21.0,36.5 41.5,36.5 47.3,46.5 26.8,46.5" />

      {/* 4. Central T / Arrowhead stem */}
      <polygon points="44.2,36.5 62.5,36.5 56.8,46.5 49.5,46.5 36.8,68.5 29.8,62.0 44.2,36.5" />

      {/* 5. Inner diagonal parallel stripe */}
      <polygon points="49.5,49.5 56.5,49.5 45.5,75.5 38.5,75.5" />

      {/* 6. Bottom-Right Hook & Base */}
      <polygon points="66.5,41.5 78.5,50.0 64.0,75.5 48.5,75.5 54.5,65.0 61.5,53.5 66.5,41.5" />
    </svg>
  );
};

export default ToolsbarLogo;

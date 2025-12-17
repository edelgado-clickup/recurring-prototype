/**
 * Supernova Assets Helper
 * Theme toggle icons for toast prototype
 */

export const SupernovaAssets = {
  'light-mode': '/assets/supernova/light-mode.svg',
  'dark-mode': '/assets/supernova/dark-mode.svg',
} as const;

export type AssetName = keyof typeof SupernovaAssets;



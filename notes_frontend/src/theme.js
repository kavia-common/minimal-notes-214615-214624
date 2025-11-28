export const theme = {
  name: 'Ocean Professional',
  colors: {
    primary: '#2563EB',
    secondary: '#F59E0B',
    success: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    overlay: 'rgba(0,0,0,0.05)',
  },
  effects: {
    radius: 12,
    radiusSm: 8,
    radiusLg: 16,
    shadow: { x: 0, y: 6, blur: 24, spread: 0, color: 'rgba(0,0,0,0.10)' },
    shadowSm: { x: 0, y: 3, blur: 12, spread: 0, color: 'rgba(0,0,0,0.10)' },
  },
  layout: {
    headerHeight: 96,
    sidebarWidth: 560,
    gap: 24,
    padding: 24,
  },
  transition: {
    fast: 150,
    normal: 250,
    slow: 400,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
}

export function shaderRadius(value) {
  // PUBLIC_INTERFACE
  /** Helper to build radius shader string */
  return ['$shader("radius", { radius: ' + Number(value || 0) + ' })']
}

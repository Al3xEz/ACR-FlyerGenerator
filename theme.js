// ═══════════════════════════════════════════════════════
// TEMA — colores e iconos SVG por tipo de torneo
// ═══════════════════════════════════════════════════════

const TIPOS = {
  blitz: {
    accent: '#EAB308',
    label: 'BLITZ',
    ritmoLabel: 'FORMATO',
    icon: 'blitz'
  },
  rapido: {
    accent: '#14C38E',
    label: 'RÁPIDO',
    ritmoLabel: 'RITMO',
    icon: 'hourglass'
  },
  clasico: {
    accent: '#5A94FF',
    label: 'CLÁSICO',
    ritmoLabel: 'MODALIDAD',
    icon: 'clock'
  }
}

// Usá SIZE y ACCENT como placeholders — se reemplazan al renderizar
const ICONS = {
  blitz: `<svg width="SIZE" height="SIZE" viewBox="0 0 512 512" fill="none"
    stroke="ACCENT" stroke-width="36" stroke-linecap="round" stroke-linejoin="round">
    <path d="M315.27 33L96 304h128l-31.51 173.23a2.36 2.36 0 002.33 2.77 2.36 2.36 0 001.89-.95L416 208H288l31.66-173.25a2.45 2.45 0 00-2.44-2.75 2.42 2.42 0 00-1.95 1z"/>
  </svg>`,

  hourglass: `<svg width="SIZE" height="SIZE" viewBox="0 0 512 512" fill="none"
    stroke="ACCENT" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M145.61 464h220.78c19.8 0 35.37-16.28 33.41-35.06C387.11 307 304 310 304 256s83.11-51 95.8-172.94c2-18.78-13.61-35.06-33.41-35.06H145.61c-19.8 0-35.37 16.28-33.41 35.06C124.89 205 208 201 208 256s-82.06 52-95.8 172.94c-2.14 18.77 13.61 35.06 33.41 35.06z"/>
    <path fill="ACCENT" stroke="none" d="M343.3 432H169.13c-15.6 0-20-18-9.06-29.16C186.55 376 240 356.78 240 326V224c0-19.85-38-35-61.51-67.2-3.88-5.31-3.49-12.8 6.37-12.8h142.73c8.41 0 10.23 7.43 6.4 12.75C310.82 189 272 204.05 272 224v102c0 30.53 55.71 47 80.4 76.87 9.95 12.04 6.47 29.13-9.1 29.13z"/>
  </svg>`,

  clock: `<svg width="SIZE" height="SIZE" viewBox="0 0 512 512" fill="none" stroke="ACCENT" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
          <path
            d='M416.07 272a160 160 0 10-160 160 160 160 0 00160-160zM142.12 91.21A46.67 46.67 0 00112 80l-2.79.08C83.66 81.62 64 104 64.07 131c0 13.21 4.66 19.37 10.88 27.23a4.55 4.55 0 003.24 1.77h.88a3.23 3.23 0 002.54-1.31L142.38 99a5.38 5.38 0 001.55-4 5.26 5.26 0 00-1.81-3.79zM369.88 91.21A46.67 46.67 0 01400 80l2.79.08C428.34 81.62 448 104 447.93 131c0 13.21-4.66 19.37-10.88 27.23a4.55 4.55 0 01-3.24 1.76h-.88a3.23 3.23 0 01-2.54-1.31L369.62 99a5.38 5.38 0 01-1.55-4 5.26 5.26 0 011.81-3.79z'
            fill='none'
            stroke='ACCENT'
            strokeMiterlimit='10'
            strokeWidth='32'
          />
          <path
            fill='none'
            stroke='ACCENT'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='32'
            d='M256.07 160v112h-80M416.07 432l-40-40M96.07 432l40-40'
          />
        </svg>`,

  people: `<svg width="SIZE" height="SIZE" viewBox="0 0 512 512" fill="none"
    stroke="ACCENT" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 23.22-72 66-72s69 30.46 66 72z"/>
    <path d="M336 304c-65.17 0-127.84 32.37-143.54 95.41-2.08 8.34 3.15 16.59 11.72 16.59h263.64c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304z"/>
    <path d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 113.34 128 147 128s57.39 24.77 53 57.94z"/>
    <path d="M147 304c-33.05 0-66.79 10.36-90.03 31.13C37.3 352.66 32 376.52 32 400a16 16 0 0016 16h144"/>
  </svg>`,

  trophy: `<svg width="SIZE" height="SIZE" viewBox="0 0 512 512" fill="none"
    stroke="ACCENT" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M176 464h160M256 464v-80M346 48H166a24 24 0 00-23.28 29.81l34.09 141.09A112 112 0 00288 304a112 112 0 00111.19-85.1l34.09-141.09A24 24 0 00409 48h-63z"/>
    <path d="M166 48s0 48-64 80M346 48s0 48 64 80"/>
  </svg>`,

  star: `<svg width="SIZE" height="SIZE" viewBox="0 0 512 512" fill="none"
    stroke="ACCENT" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"/>
  </svg>`,

  shield: `<svg width="SIZE" height="SIZE" viewBox="0 0 512 512" fill="none"
    stroke="ACCENT" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M256 464s-176-80-176-224V112l176-64 176 64v128c0 144-176 224-176 224z"/>
  </svg>`
}

function icon(name, size, accent) {
  const tpl = ICONS[name] || ICONS.star
  return tpl.replace(/SIZE/g, size).replace(/ACCENT/g, accent)
}

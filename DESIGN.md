# Diseño de CronoEstrato 2023

## Sistema de Diseño

### Paleta de Colores

La aplicación utiliza una paleta de colores que refleja la geología y la profundidad del tiempo:

#### Colores Principales
- **Fondo Primario**: `#0A0F1A` (negro profundo, como el vacío espacial)
- **Fondo Secundario**: `#151F30` (azul noche profundo)
- **Textos Primarios**: `#F0F4FF` (blanco puro)
- **Textos Secundarios**: `#A0AEC0` (gris neutro)

#### Colores de Énfasis
- **Cian (interacciones)**: `#06B6D4`
- **Azul (enlaces)**: `#3B82F6`
- **Esmeralda (éxitos)**: `#10B981`
- **Ámbar (alertas)**: `#F59E0B`
- **Rosa (errores)**: `#F43F5E`

#### Colores Geológicos (Tabla ICS 2023)
Los colores oficiales de la Tabla Cronoestratigráfica Internacional son usados en los juegos y visualizaciones:
- **Hádico**: `#7E2D9A`
- **Arcaico**: `#B846B4`
- **Proterozoico**: `#83C5BE`
- **Fanerozoico**: `#C4A484`

### Tipografía

- **Fuente Principal**: `'Plus Jakarta Sans'` - Fuente moderna y legible con excelente legibilidad en pantallas pequeñas
- **Fuente Monoespaciada**: `'JetBrains Mono'` - Para fechas y números (Ma, rango temporal)

### Componentes

#### Cards
- Fondo: `rgba(30, 40, 62, 0.85)` con glassmorphism
- Borde: `rgba(255, 255, 255, 0.06)`
- Radio: `16-24px`
- Sombra: `0 4px 15px rgba(0, 0, 0, 0.2)`

#### Botones Primarios
- Gradiente: `linear-gradient(135deg, #06B6D4, #3B82F6)`
- Texto: Blanco (`#fff`)
- Radius: `14px`
- Pad: `12px 16px`

#### Botones Secundarios
- Fondo: `var(--bg-secondary)`
- Borde: `1px solid var(--border-subtle)`
- Radius: `14px`

### Responsividad

- **Móvil (< 768px)**: 
  - Ancho máximo: 480px
  - Header con barra de notificación
  - Tab bar inferior estilo iOS
  - Grid de juegos: 1 columna
  - Scroll vertical

- **Desktop (≥ 768px)**:
  - Ancho máximo: 1080-1160px
  - Header horizontal con navegación
  - Sin tab bar inferior
  - Grid de juegos: 2-3 columnas

### Animaciones

- Transiciones estándar: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` - "emphasizing"
- Transiciones rápidas: `cubic-bezier(0.4, 0, 0.2, 1)` - "ease-in-out"
- Duración típica: 150-300ms

### Glassmorphism

Los cards y modales usan efecto de vidrio translúcido:
```css
backdrop-filter: blur(25px);
background: rgba(30, 40, 62, 0.85);
border: 1px solid rgba(255, 255, 255, 0.06);
```

### Z-index Management

- **Tab bar**: 60
- **Header**: 50
- **Modals**: 100
- **Cookies banner**: 200

## Componentes Clave

### Header (iOS-style)
```
┌─────────────────────────────────────────┐
│ [ Badge ] CronoEstrato    [🔊] [ℹ️]     │
│              [💡 Ayudar] [👤 Entrar]    │
└─────────────────────────────────────────┘
```

### Tab Bar (Bottom Navigation - Mobile)
```
┌───┬─────┬─────┬───────┐
│🗺️ │🎮 │💡 │🏆 │
│Exp│Game│Mem│Log│
└───┴─────┴─────┴───────┘
```

### Modal Sheet (Bottom to Top)
```
        ╭──────────────╮
        │    Drag ↕   │
        ├─────────────┤
        │   Content    │
        ╰──────────────╯
```

## Iconos y Emojis

Se utiliza emoji como iconografía principal:
- 🗺️ Explorar
- 🎮 Juegos
- 💡 Mnemotécnicas
- 🏆 Logros
- 👤 Perfil/Autenticación
- 💡 Ayudar/Sugerencias
- ℹ️ Información
- 🔊 🔇 Sonido
- ✅ Éxito
- ❌ Error

## Accesibilidad

- Texto con contraste suficiente (WCAG AA)
- Tamaño de fuente mínimo: 16px en inputs
- Estado de enfoque visible
- Animaciones preferibles deshabilitables
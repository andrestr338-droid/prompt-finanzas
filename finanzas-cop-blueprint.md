# FinanzasCOP — Blueprint

> Generado por The Architect el 2026-05-05
> Arquetipo: PWA Mobile (Internal Tool / Dashboard)

---

## 1. Visión del Proyecto

### Visión
FinanzasCOP es una Progressive Web App de finanzas personales diseñada para usuarios colombianos que hoy llevan sus cuentas en papel o el bloc de notas. Reemplaza ese flujo manual con una app instalable en iPhone, 100% offline, que da control total sobre ingresos, gastos, deudas y metas — sin necesidad de cuenta, backend ni internet. La experiencia debe sentirse como una app nativa de banca digital, no como una página web.

El usuario objetivo es una persona que anota gastos a mano, sabe cuánto debe pero no tiene claridad de cuándo termina de pagar, y quiere un plan concreto para sus deudas y metas de ahorro.

### Objetivos
- Reemplazar el bloc de notas con un registro rápido de transacciones
- Dar un plan de pago de deudas claro (bola de nieve o avalancha)
- Mostrar un reporte financiero mensual tipo estado financiero empresarial
- Ser instalable en iPhone desde Safari sin App Store
- Funcionar 100% offline con datos en localStorage
- Poder compartirse con amigos via URL cuando esté en Vercel

### Métricas de Éxito
- App instalable en iPhone Safari (Add to Home Screen) sin errores
- Datos persisten entre sesiones y cierres de app
- Todas las calculaciones de deuda y metas son correctas
- Build de producción < 500KB gzipped
- Lighthouse PWA score ≥ 90

---

## 2. Tech Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | React 18 + Vite 5 | Estándar moderno, hot reload, build optimizado para PWA |
| Lenguaje | JavaScript (JSX) | Sin overhead de TypeScript para app personal, más velocidad de desarrollo |
| Estilos | Tailwind CSS v3 (build PostCSS) | No CDN — tree-shaking, dark mode class, bundle pequeño |
| Gráficas | Recharts 2 | Pedido en el brief, componentes React nativos, buen soporte mobile |
| PWA | vite-plugin-pwa | Genera service worker y manifest automáticamente, zero-config |
| Persistencia | localStorage | Sin backend, funciona offline, suficiente para uso personal |
| Tipografías | Google Fonts (DM Serif Display + DM Sans) | Brief lo especifica, contraste elegante |
| Hosting | Vercel (free tier) | HTTPS obligatorio para PWA en iPhone, deploy instantáneo desde GitHub |
| Package Manager | pnpm | Más rápido que npm, lock file más confiable |

---

## 3. Estructura de Directorios

```
finanzas-cop/
├── public/
│   ├── icon-192.png              ← Ícono PWA 192x192 (fondo esmeralda, "$" blanco)
│   ├── icon-512.png              ← Ícono PWA 512x512
│   └── icon-apple-touch.png     ← 180x180 para iOS home screen
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx    ← Barra de navegación fija con safe area iOS
│   │   │   └── FAB.jsx          ← Botón flotante "+" con bottom sheet de opciones
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx    ← Página principal, orquesta los 4 sub-componentes
│   │   │   ├── HeroCard.jsx     ← Tarjeta principal con saldo animado (contador 0→valor)
│   │   │   ├── ResumenChips.jsx ← 3 chips: ingresos, gastos, % gastado
│   │   │   ├── MiniBarChart.jsx ← Bar chart Recharts últimos 6 meses
│   │   │   └── Alertas.jsx      ← Máx. 2 alertas inteligentes
│   │   ├── transacciones/
│   │   │   ├── Transacciones.jsx     ← Página con sub-tabs Gastos|Ingresos|Todo
│   │   │   ├── ListaTransacciones.jsx ← Lista agrupada por día con filtro mes/año
│   │   │   ├── TransaccionItem.jsx   ← Fila individual con botón eliminar
│   │   │   └── ModalTransaccion.jsx  ← Bottom sheet para agregar gasto/ingreso
│   │   ├── deudas/
│   │   │   ├── Deudas.jsx       ← Página deudas, tabs Lista|Plan
│   │   │   ├── DeudaItem.jsx    ← Tarjeta deuda con barra de progreso
│   │   │   ├── ModalDeuda.jsx   ← Bottom sheet para agregar/editar deuda
│   │   │   └── PlanDeudas.jsx   ← Selector estrategia + timeline visual
│   │   ├── metas/
│   │   │   ├── Metas.jsx        ← Página metas, tabs Metas|Mi Plan
│   │   │   ├── MetaItem.jsx     ← Tarjeta meta con progreso circular
│   │   │   ├── ModalMeta.jsx    ← Bottom sheet para crear/editar meta
│   │   │   └── PlanMetas.jsx    ← Plan de prioridades del dinero disponible
│   │   ├── reportes/
│   │   │   ├── Reportes.jsx          ← Página reportes con selector mes
│   │   │   ├── EstadoFinanciero.jsx  ← Estado tipo empresarial con botón copiar
│   │   │   └── GraficasReporte.jsx   ← Pie + Bar + Line charts
│   │   ├── onboarding/
│   │   │   └── Onboarding.jsx   ← 4 pasos primera vez (ingreso ref, deudas, metas, listo)
│   │   └── ui/
│   │       ├── BottomSheet.jsx  ← Componente genérico bottom sheet animado
│   │       ├── ProgressBar.jsx  ← Barra de progreso reutilizable
│   │       ├── EmptyState.jsx   ← Estado vacío con ilustración y texto motivador
│   │       └── ConfirmDialog.jsx ← Diálogo de confirmación antes de eliminar
│   ├── hooks/
│   │   ├── useTransacciones.js  ← CRUD transacciones + cálculos de mes
│   │   ├── useDeudas.js         ← CRUD deudas + plan de pago
│   │   ├── useMetas.js          ← CRUD metas + plan de prioridades
│   │   └── useConfig.js         ← estrategiaDeuda, nombreUsuario, ingresoRef
│   ├── store/
│   │   └── localStorage.js      ← get/set/remove helpers con JSON parse/stringify
│   ├── utils/
│   │   ├── formatters.js        ← formatCOP(), formatFecha(), getMesNombre()
│   │   ├── calculos.js          ← calcularPlanDeudas(), calcularPlanMetas(), calcularSaldo()
│   │   └── reportes.js          ← generarReporte() → objeto completo del reporte
│   ├── data/
│   │   └── semilla.js           ← Datos demo: 3 meses transacciones, 2 deudas, 2 metas
│   ├── App.jsx                  ← Estado global, routing por tab, onboarding gate
│   ├── main.jsx                 ← React DOM, registro del service worker
│   └── index.css                ← Tailwind base, fuentes Google, safe area variables
├── index.html                   ← Meta tags PWA iOS, viewport, Google Fonts link
├── vite.config.js               ← plugin-pwa config, path aliases
├── tailwind.config.js           ← Colores custom, font families, dark mode
├── postcss.config.js
└── package.json
```

---

## 4. Modelo de Datos

**Transacción**
| Campo | Tipo | Notas |
|-------|------|-------|
| id | string | `crypto.randomUUID()` |
| tipo | `'gasto' \| 'ingreso'` | |
| monto | number | Entero, sin decimales, COP |
| categoria | string | Enum de categorías (ver abajo) |
| descripcion | string | Opcional, puede ser vacío |
| fecha | string | ISO date `'YYYY-MM-DD'` |
| tipoIngreso | `'fijo' \| 'variable' \| null` | Solo para ingresos |
| fuente | `string \| null` | Solo para ingresos |

**Deuda**
| Campo | Tipo | Notas |
|-------|------|-------|
| id | string | `crypto.randomUUID()` |
| nombre | string | Ej: "Tarjeta Bancolombia" |
| tipo | string | `tarjeta \| bancario \| personal \| hipotecario \| vehiculo \| otro` |
| saldoTotal | number | Saldo original de la deuda |
| saldoActual | number | Saldo pendiente hoy |
| tasaInteres | number | % mensual |
| cuotaMensual | number | Cuota fija mensual |
| fechaInicio | string | ISO date |
| notas | string | Opcional |

**Meta**
| Campo | Tipo | Notas |
|-------|------|-------|
| id | string | `crypto.randomUUID()` |
| nombre | string | Ej: "Viaje a Cartagena" |
| emoji | string | Ej: "✈️" |
| montoObjetivo | number | |
| montoActual | number | Lo ahorrado hasta ahora |
| frecuenciaAhorro | `'mensual' \| 'quincenal' \| 'semanal'` | |
| fechaLimite | `string \| null` | ISO date opcional |
| prioridad | number | 1 = más alta |

**Config**
| Campo | Tipo | Notas |
|-------|------|-------|
| estrategiaDeuda | `'nieve' \| 'avalancha'` | Default: 'nieve' |
| nombreUsuario | string | Del onboarding |
| ingresoMensualRef | number | Referencia del onboarding |
| onboardingCompleto | boolean | Controla si mostrar onboarding |

### Claves localStorage
```javascript
'fc_transacciones'   // Transaccion[]
'fc_deudas'          // Deuda[]
'fc_metas'           // Meta[]
'fc_config'          // Config
```

### Categorías
```javascript
CATEGORIAS_GASTO = ['comida', 'transporte', 'vivienda', 'salud', 'entretenimiento', 'ropa', 'educacion', 'deuda', 'otros']
CATEGORIAS_INGRESO = ['salario', 'freelance', 'regalo', 'inversion', 'otro_ingreso']

EMOJIS_CATEGORIA = {
  comida: '🍔', transporte: '🚗', vivienda: '🏠', salud: '💊',
  entretenimiento: '🎮', ropa: '👕', educacion: '📚', deuda: '💳', otros: '📦',
  salario: '💼', freelance: '🔧', regalo: '🎁', inversion: '📈', otro_ingreso: '🏦'
}
```

---

## 5. API Design

No aplica — la app es 100% client-side con localStorage. No hay backend ni endpoints.

Las funciones que actúan como "API interna":

```javascript
// store/localStorage.js
getData(key)                    // → parsed JSON o default
setData(key, value)             // → JSON.stringify + set
clearAll()                      // → eliminar todas las claves fc_*

// utils/calculos.js
calcularSaldoMes(transacciones, mes, año)       // → { ingresos, gastos, saldo }
calcularPlanDeudas(deudas, estrategia, extraMensual)  // → orden, meses, ahorro intereses
calcularPlanMetas(metas, dineroDisponible)        // → distribución por meta
generarReporte(transacciones, deudas, metas, mes, año) // → objeto reporte completo
```

---

## 6. Arquitectura Frontend

### Navegación
La app es una SPA con routing por estado — sin React Router. El estado `tabActiva` en `App.jsx` determina qué sección se renderiza. Esto simplifica el bundle y el PWA (no hay rutas que gestionar en el service worker).

```javascript
// App.jsx
const [tabActiva, setTabActiva] = useState('dashboard') // 'dashboard'|'transacciones'|'deudas'|'metas'|'reportes'
```

### Jerarquía de Componentes — Vistas Clave

**App.jsx (raíz)**
```
App
├── Onboarding (si !config.onboardingCompleto)
└── Layout principal (si onboarding completo)
    ├── [tabActiva === 'dashboard']    → Dashboard
    ├── [tabActiva === 'transacciones'] → Transacciones
    ├── [tabActiva === 'deudas']       → Deudas
    ├── [tabActiva === 'metas']        → Metas
    └── [tabActiva === 'reportes']     → Reportes
    ├── FAB (visible excepto en reportes)
    └── BottomNav
```

**Dashboard**
```
Dashboard
├── HeroCard          ← saldo neto animado, color dinámico
├── ResumenChips      ← 3 chips: ingresos / gastos / % gastado
├── MiniBarChart      ← Recharts BarChart 6 meses
└── Alertas           ← máx. 2 tarjetas de alerta contextual
```

**Transacciones**
```
Transacciones
├── SubTabs           ← Gastos | Ingresos | Todo
├── FiltroMes         ← selector mes/año
└── ListaTransacciones
    └── [por cada día]
        ├── HeaderDia ← "Lunes 15 de abril — $XX.XXX"
        └── TransaccionItem (×n)
```

**Deudas**
```
Deudas
├── ResumenDeuda      ← total adeudado + cuota mensual total
├── SubTabs           ← Lista | Plan
├── [tab Lista]
│   └── DeudaItem (×n) ← barra de progreso % pagado
└── [tab Plan]
    └── PlanDeudas
        ├── SelectorEstrategia  ← Bola de nieve | Avalancha
        ├── OrdenPago           ← lista ordenada con meses estimados
        ├── TimelineDeudas      ← mes a mes cuándo se paga cada una
        └── ComparativaAhorro   ← tabla nieve vs avalancha
```

### Gestión de Estado

Todo el estado vive en hooks personalizados que leen/escriben localStorage directamente. No hay estado global (ni Context ni Zustand) — cada hook es autocontenido.

```javascript
// Patrón de cada hook
function useTransacciones() {
  const [transacciones, setTransacciones] = useState(() => getData('fc_transacciones') ?? [])
  
  const agregar = (t) => { /* actualiza state + localStorage */ }
  const eliminar = (id) => { /* actualiza state + localStorage */ }
  const delMes = (mes, año) => { /* filtra sin mutar */ }
  
  return { transacciones, agregar, eliminar, delMes }
}
```

---

## 7. Sistema de Diseño

### Colores (Dark Mode absoluto)

| Rol | Hex | Uso |
|-----|-----|-----|
| Background | `#0A0A0F` | Fondo de la app |
| Surface | `#141420` | Tarjetas, panels |
| Surface Elevated | `#1E1E2E` | Tarjetas sobre tarjetas, modales |
| Border | `#2A2A3E` | Separadores, bordes sutiles |
| Primary | `#10B981` | Verde esmeralda — saldo positivo, FAB, CTAs |
| Primary Dark | `#059669` | Hover/press del primary |
| Primary Glow | `rgba(16,185,129,0.15)` | Glassmorphism en hero card |
| Text Primary | `#F8F8FC` | Texto principal |
| Text Secondary | `#94A3B8` | Labels, texto muted |
| Text Disabled | `#4A5568` | Placeholders |
| Destructive | `#EF4444` | Saldo negativo, eliminar |
| Warning | `#F59E0B` | Alerta gastos > 80% |
| Info | `#3B82F6` | Alertas informativas |

### Tipografía

| Rol | Fuente | Tamaño | Peso |
|-----|--------|--------|------|
| Hero (saldo principal) | DM Serif Display | 48–56px | 400 |
| Títulos de sección | DM Sans | 20–24px | 600 |
| UI / Etiquetas | DM Sans | 14–16px | 400–500 |
| Monto en listas | DM Serif Display | 18–22px | 400 |
| Texto pequeño | DM Sans | 12px | 400 |

### Espaciado y Layout

- Base: 4px → escala: 4, 8, 12, 16, 20, 24, 32, 48
- Border radius: 12px tarjetas, 16px modales, 999px chips/badges, 24px hero card
- Ancho target: 390px (iPhone 14), sin layout desktop
- Touch targets: mínimo 44×44px en todos los botones/íconos interactivos
- Safe area: `padding-bottom: env(safe-area-inset-bottom)` en BottomNav y FAB
- Sombras: `0 4px 24px rgba(0,0,0,0.4)` para modales — sin sombras en tarjetas (dark mode)

### Glassmorphism Hero Card
```css
background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05));
border: 1px solid rgba(16,185,129,0.2);
backdrop-filter: blur(10px);
```

### Animaciones
- Contador hero: de 0 al valor real en 800ms, easing `ease-out`
- Bottom sheets: slide-up desde abajo en 280ms, `cubic-bezier(0.32, 0.72, 0, 1)`
- FAB: scale pulse al tocar (scale 0.95 → 1 en 150ms)
- ProgressBar: fill animado en 600ms al montar

---

## 8. Autenticación y Autorización

No aplica — la app es personal y sin cuentas. No hay auth, no hay roles, no hay rutas protegidas.

**Onboarding (primera vez):**
- Si `config.onboardingCompleto === false` → mostrar flujo de 4 pasos
- Paso 1: Bienvenida + nombre
- Paso 2: Ingreso mensual aproximado
- Paso 3: ¿Tienes deudas? → Si sí, ir a agregar primera deuda
- Paso 4: ¿Tienes meta de ahorro? → Si sí, ir a crear primera meta
- Al terminar: `config.onboardingCompleto = true` → Dashboard

**Ruta de escalabilidad futura (no implementar ahora):**
- Si la app crece: agregar Supabase para sync en la nube + Clerk para auth
- El hook layer (`useTransacciones`, `useDeudas`, etc.) aísla el storage — solo cambiar `store/localStorage.js` por llamadas API

---

## 9. Orden de Construcción

**Paso 1: Scaffolding del proyecto**
```bash
pnpm create vite@latest finanzas-cop -- --template react
cd finanzas-cop
pnpm install
pnpm add recharts
pnpm add -D tailwindcss postcss autoprefixer vite-plugin-pwa
npx tailwindcss init -p
```
Resultado: proyecto React + Vite corriendo en localhost:5173

---

**Paso 2: Configurar Tailwind y sistema de diseño**
- `tailwind.config.js`: agregar colores custom, font families DM Serif/DM Sans, dark mode `class`
- `index.css`: directivas `@tailwind`, import Google Fonts, variables CSS safe area, clase `dark` en `html`
- `index.html`: meta tags PWA iOS, viewport, preconnect a Google Fonts

Resultado: colores y tipografía del design system disponibles como clases Tailwind

---

**Paso 3: Configurar vite-plugin-pwa**
- `vite.config.js`: configurar VitePWA con `registerType: 'autoUpdate'`, manifest completo (name, short_name, icons, theme_color `#10B981`, background_color `#0A0A0F`, display `standalone`, start_url `/`)
- Crear `public/icon-192.png`, `public/icon-512.png`, `public/icon-apple-touch.png` (íconos SVG→PNG: fondo esmeralda, "₱" o "$" blanco centrado)

Resultado: app es instalable como PWA en iPhone

---

**Paso 4: Store localStorage y hooks base**

Crear `src/store/localStorage.js`:
```javascript
export const getData = (key) => { try { return JSON.parse(localStorage.getItem(key)) } catch { return null } }
export const setData = (key, value) => localStorage.setItem(key, JSON.stringify(value))
export const clearAll = () => ['fc_transacciones','fc_deudas','fc_metas','fc_config'].forEach(k => localStorage.removeItem(k))
```

Crear los 4 hooks: `useTransacciones.js`, `useDeudas.js`, `useMetas.js`, `useConfig.js`
Cada hook: estado inicializado desde localStorage, funciones CRUD que actualizan estado + localStorage en sync.

Resultado: capa de datos completa y testeada

---

**Paso 5: Funciones utilitarias**

`src/utils/formatters.js`:
```javascript
formatCOP(n)          // → "$ 1.250.000"
formatFecha(isoDate)  // → "Lun 15 abr"
getMesNombre(mes)     // → "Enero", "Febrero", ...
getHoy()              // → "YYYY-MM-DD"
```

`src/utils/calculos.js`:
```javascript
calcularSaldoMes(transacciones, mes, año)
// → { ingresos: number, gastos: number, saldo: number }

calcularPlanDeudas(deudas, estrategia, extraMensual)
// → { orden: Deuda[], mesesTotal: number, ahorroIntereses: number, timeline: [{mes, deudas}] }

calcularPlanMetas(metas, dineroDisponible)
// → { distribución: [{meta, aporte, mesesRestantes}], totalAportes: number }

calcularDineroDisponible(ingresos, gastos, cuotasDeuda)
// → number (dinero libre después de gastos + mínimos de deuda)
```

`src/utils/reportes.js`:
```javascript
generarReporte(transacciones, deudas, metas, mes, año)
// → objeto completo con todas las secciones del reporte
generarTextoReporte(reporteObj)
// → string formateado para copiar al portapapeles
```

Resultado: lógica de negocio completa, separada de la UI

---

**Paso 6: Datos de demo (semilla)**

`src/data/semilla.js`: exportar `TRANSACCIONES_DEMO`, `DEUDAS_DEMO`, `METAS_DEMO`
- 3 meses de transacciones (feb, mar, abr 2026) con variedad de categorías
- 2 deudas: tarjeta de crédito + crédito de libre inversión
- 2 metas: "Fondo de emergencia" + "Viaje a Cartagena"

Función `cargarSemilla()` que verifica si hay datos y solo carga si localStorage está vacío.

---

**Paso 7: Componentes UI base**

`src/components/ui/BottomSheet.jsx`:
- Props: `isOpen`, `onClose`, `children`, `title`
- Overlay oscuro + panel que sube desde abajo
- Animación con CSS transition (no framer-motion — bundle más pequeño)
- Cierra al tocar el overlay o hacer swipe-down

`src/components/ui/ProgressBar.jsx`:
- Props: `porcentaje`, `color`, `altura`
- Fill animado al montar (600ms)

`src/components/ui/EmptyState.jsx`:
- Props: `icono`, `titulo`, `descripcion`, `accion`
- Ilustración simple (emoji grande) + texto motivador

`src/components/ui/ConfirmDialog.jsx`:
- Props: `isOpen`, `onConfirm`, `onCancel`, `mensaje`
- Bottom sheet simple con botones Cancelar / Eliminar

---

**Paso 8: Layout shell (App + BottomNav + FAB)**

`src/components/layout/BottomNav.jsx`:
- 5 tabs con íconos y labels
- Tab activa: color primary, resto: text-secondary
- `padding-bottom: env(safe-area-inset-bottom)` para iPhone

`src/components/layout/FAB.jsx`:
- Botón "+" verde flotante, bottom-right
- Al tocar: abre BottomSheet con 3 opciones: Agregar gasto / Agregar ingreso / Abonar a meta
- Oculto en tab Reportes

`src/App.jsx`:
- Estado `tabActiva`
- Gate de onboarding: si `!config.onboardingCompleto` → render `<Onboarding />`
- Render condicional por tab activa
- BottomNav + FAB siempre visibles (excepto durante onboarding)

---

**Paso 9: Onboarding**

`src/components/onboarding/Onboarding.jsx`:
- 4 pasos con indicador de progreso
- Paso 1: Bienvenida, campo nombre
- Paso 2: "¿Cuánto ganas al mes aproximadamente?" — campo monto
- Paso 3: "¿Tienes deudas?" Sí/No — si Sí, abre ModalDeuda inline
- Paso 4: "¿Tienes una meta?" Sí/No — si Sí, abre ModalMeta inline
- Botón "¡Empezar!" → `config.onboardingCompleto = true`

---

**Paso 10: Módulo Transacciones**

`ModalTransaccion.jsx` (el más complejo):
- Toggle Gasto / Ingreso
- Campo monto con formato automático mientras escribe (escuchar `input` y formatear)
- Selector de categoría visual con íconos en grid 4×3
- Campo descripción (opcional)
- DatePicker nativo (input type="date"), default hoy
- Para ingresos: toggle Fijo/Variable + campo fuente
- Botón "Guardar"

`ListaTransacciones.jsx`:
- Agrupar por día (Object.groupBy o reduce)
- Header de día con total del día
- Filtro por mes/año en la parte superior

`TransaccionItem.jsx`:
- Emoji categoría + descripción + fecha + monto
- Botón eliminar (ícono basura) con ConfirmDialog

`Transacciones.jsx`:
- Sub-tabs Gastos | Ingresos | Todo
- Filtro mes/año
- Lista o EmptyState

---

**Paso 11: Módulo Dashboard**

`HeroCard.jsx`:
- Saldo neto del mes con animación contador (useEffect + requestAnimationFrame)
- Color: `text-emerald-400` si ≥ 0, `text-red-400` si < 0
- Glassmorphism background
- Mes actual en español

`ResumenChips.jsx`:
- 3 chips horizontales: Total ingresos / Total gastos / % gastado
- % gastado: verde si < 80%, amarillo si 80-99%, rojo si ≥ 100%

`MiniBarChart.jsx`:
- Recharts BarChart con datos de los últimos 6 meses
- Barra verde (ingresos) y barra roja (gastos) por mes
- Tooltip con formato COP
- ResponsiveContainer width="100%" height={120}

`Alertas.jsx`:
- Máximo 2 alertas priorizadas:
  1. Si gastos > 80% ingresos → alerta amarilla
  2. Si hay deudas activas → recordatorio de cuota
  3. Si hay meta próxima (< 3 meses) → motivación
- Tarjetas pequeñas con ícono + texto corto

---

**Paso 12: Módulo Deudas**

`DeudaItem.jsx`:
- Nombre + tipo + cuota mensual
- Barra de progreso: `(1 - saldoActual/saldoTotal) * 100`%
- Tasa de interés visible
- Botón eliminar

`ModalDeuda.jsx`:
- Todos los campos del schema Deuda
- Selector tipo de deuda visual con íconos
- Campos numéricos con formato COP

`PlanDeudas.jsx`:
- Selector visual Bola de Nieve ❄️ / Avalancha 🏔️
- Campo "¿Cuánto extra puedes pagar al mes?"
- Resultado: lista ordenada de deudas con meses estimados para liquidar cada una
- Timeline visual mes a mes
- Comparativa: tabla mostrando cuánto se ahorra en intereses con avalancha vs nieve

---

**Paso 13: Módulo Metas**

`MetaItem.jsx`:
- Emoji grande + nombre + barra de progreso
- "Te faltan $X — ahorrando $Y cada Z llegas en N meses"
- Botón "Abonar" que abre un BottomSheet simple con campo monto

`PlanMetas.jsx` (sección "Mi Plan"):
- Calcula dinero disponible del mes
- Muestra distribución del dinero: gastos esenciales → mínimos deuda → extra deuda → fondo emergencia → metas
- Distribución visual tipo barra apilada

---

**Paso 14: Módulo Reportes**

`EstadoFinanciero.jsx`:
- Selector mes/año
- Estado financiero formateado tipo empresarial (monospace font, separadores)
- Secciones: INGRESOS, GASTOS OPERATIVOS, SERVICIO DE DEUDA, RESULTADO, ESTADO DEUDAS, METAS
- Botón "Copiar" → `navigator.clipboard.writeText(texto)`

`GraficasReporte.jsx`:
- Pie chart: distribución gastos por categoría (Recharts PieChart)
- Bar chart: ingresos vs gastos 6 meses (Recharts BarChart)
- Line chart: saldo neto mes a mes (Recharts LineChart)

---

**Paso 15: Banner de instalación iOS**

En `App.jsx` o componente `BannerInstalacion.jsx`:
```javascript
// Detectar: iOS + Safari + no instalada
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isStandalone = window.matchMedia('(display-mode: standalone)').matches
const mostrarBanner = isIOS && !isStandalone && !localStorage.getItem('fc_banner_dismissed')
```
- Banner discreto en la parte inferior (sobre la BottomNav)
- Texto: "Instala esta app: toca Compartir → Añadir a pantalla de inicio"
- Botón X para cerrar y no volver a mostrar

---

**Paso 16: Deploy en Vercel**
```bash
# En el directorio del proyecto
git init
git add .
git commit -m "feat: FinanzasCOP PWA v1.0"

# Crear repo en GitHub (github.com/new)
git remote add origin https://github.com/TU_USUARIO/finanzas-cop.git
git push -u origin main
```
1. Ir a vercel.com → "Add New Project" → importar el repo de GitHub
2. Framework: Vite (auto-detectado)
3. Build command: `pnpm build`
4. Output dir: `dist`
5. Deploy → obtener URL pública (ej: `finanzas-cop.vercel.app`)
6. Compartir esa URL — cualquier persona puede instalarla en su iPhone desde Safari

---

## 10. Setup del Entorno

### Prerequisitos
- Node.js 18+ (`node --version`)
- pnpm (`npm install -g pnpm`)
- Git
- Cuenta GitHub (para deploy)
- Cuenta Vercel gratuita (vercel.com)

### Variables de Entorno
No hay variables de entorno — la app es 100% client-side.

### Comandos de inicio
```bash
pnpm create vite@latest finanzas-cop -- --template react
cd finanzas-cop
pnpm install
pnpm add recharts
pnpm add -D tailwindcss postcss autoprefixer vite-plugin-pwa
npx tailwindcss init -p
pnpm dev
```

---

## 11. Dependencias

### Core
| Paquete | Propósito |
|---------|-----------|
| react | Framework UI |
| react-dom | Renderizado DOM |
| recharts | Gráficas de barras, pie, línea |

### Dev
| Paquete | Propósito |
|---------|-----------|
| vite | Build tool, dev server, HMR |
| @vitejs/plugin-react | Soporte JSX + Fast Refresh |
| tailwindcss | Framework de estilos utility-first |
| postcss | Procesador CSS (requerido por Tailwind) |
| autoprefixer | Prefijos vendor automáticos |
| vite-plugin-pwa | Service worker + manifest PWA |

### Sin instalar (nativo)
- `localStorage` — nativo del browser
- `Date` — nativo JS
- `crypto.randomUUID()` — nativo en browsers modernos
- `navigator.clipboard` — nativo para exportar reporte

---

## 12. Estrategia de Deploy

### Hosting
**Vercel Free Tier** — la opción correcta porque:
- HTTPS automático (obligatorio para service workers en iPhone)
- CDN global (bajo latency en Colombia)
- Deploy automático en cada push a `main`
- URL pública para compartir con amigos
- Sin costo hasta límites muy generosos

### CI/CD
- Conectar repo GitHub a Vercel
- Cada `git push origin main` → Vercel hace build y deploy automáticamente
- Preview deploys en cada PR/branch (útil para testear antes de publicar)

### Dominios
- Por defecto: `finanzas-cop.vercel.app` (gratis)
- Dominio custom opcional: comprar en Namecheap/Cloudflare y conectar en Vercel settings → ~$10/año

### Entornos
- **Dev**: `pnpm dev` → localhost:5173 con HMR
- **Preview**: cada push a rama que no sea `main` → URL preview de Vercel
- **Producción**: push a `main` → auto-deploy a la URL pública

---

## 13. Testing

### Funciones utilitarias (unit tests con Vitest)
Instalar: `pnpm add -D vitest`

Tests críticos en `src/utils/`:
- `formatCOP(1250000)` → `"$ 1.250.000"`
- `calcularPlanDeudas()` — verificar que avalancha ordena por mayor tasa
- `calcularPlanDeudas()` — verificar que nieve ordena por menor saldo
- `calcularSaldoMes()` — suma correcta de ingresos y gastos
- `generarReporte()` — objeto con todas las propiedades esperadas

### Testing manual en iPhone (obligatorio antes de compartir)
Checklist:
- [ ] App instalable desde Safari (Add to Home Screen)
- [ ] App abre en modo standalone (sin barra de Safari)
- [ ] Datos persisten después de cerrar y reabrir
- [ ] App funciona sin internet (service worker activo)
- [ ] Todos los touch targets son fáciles de tocar
- [ ] Modales se abren y cierran correctamente
- [ ] Gráficas se ven bien en pantalla de 390px

### Sin E2E por ahora
Para una app personal, el testing manual en iPhone es suficiente. Si se escala, agregar Playwright.

---

## 14. Skills a Usar Durante la Construcción

| Skill | Cuándo Usar | Por Qué |
|-------|-------------|---------|
| `/frontend-design` | Pasos 7, 10, 11, 12, 13 (componentes UI) | Produce interfaces fintech de calidad producción, maneja el glassmorphism, animaciones y mobile-first |
| `/playwright-cli` | Paso 16 (antes de deploy) | Automatizar prueba del flujo completo: agregar transacción → verificar dashboard → generar reporte |

---

## 15. CLAUDE.md para el Proyecto Target

```markdown
# FinanzasCOP

PWA de finanzas personales para iPhone. Dark mode, moneda COP, 100% offline con localStorage. Sin backend, sin auth.

## Comandos

- `pnpm dev` — Servidor de desarrollo (localhost:5173)
- `pnpm build` — Build de producción (output en /dist)
- `pnpm preview` — Preview del build de producción
- `pnpm test` — Unit tests con Vitest

## Tech Stack

React 18 + Vite 5 + JavaScript (JSX) + Tailwind CSS v3 + Recharts + vite-plugin-pwa + localStorage + Vercel

## Arquitectura

### Estructura de Carpetas
- `src/components/` — Componentes organizados por sección (dashboard, transacciones, deudas, metas, reportes, layout, ui)
- `src/hooks/` — useTransacciones, useDeudas, useMetas, useConfig — cada uno lee/escribe localStorage
- `src/store/localStorage.js` — Helpers getData/setData/clearAll — ÚNICO punto de contacto con localStorage
- `src/utils/` — formatters.js, calculos.js, reportes.js — lógica de negocio pura, sin side effects
- `src/data/semilla.js` — Datos demo precargados

### Flujo de Datos
UI → Hook personalizado → store/localStorage.js → localStorage del browser

Los hooks son la única forma de modificar datos. Los componentes nunca acceden a localStorage directamente.

### Navegación
SPA sin React Router. Estado `tabActiva` en App.jsx controla qué sección se renderiza. Valores posibles: `'dashboard' | 'transacciones' | 'deudas' | 'metas' | 'reportes'`

### Patrones Clave
- Dark mode absoluto — la clase `dark` está en `<html>`, siempre presente
- Todos los modales son BottomSheets (componente genérico `src/components/ui/BottomSheet.jsx`)
- Montos siempre como enteros (sin decimales). formatCOP() solo para display
- Fechas almacenadas como string ISO `'YYYY-MM-DD'`, parseadas con Date nativo cuando se necesita

## Design System

### Colores
- Background: `#0A0A0F`
- Surface: `#141420`
- Surface Elevated: `#1E1E2E`
- Border: `#2A2A3E`
- Primary: `#10B981` (esmeralda)
- Text Primary: `#F8F8FC`
- Text Secondary: `#94A3B8`
- Destructive: `#EF4444`
- Warning: `#F59E0B`

### Tipografía
- Números hero / montos destacados: DM Serif Display
- Todo lo demás: DM Sans
- Hero card saldo: 48–56px DM Serif Display
- UI body: 14–16px DM Sans

### Style
- Border radius: 12px tarjetas, 16px modales, 999px chips
- Mobile-first absoluto: 390px de ancho objetivo
- Touch targets: mínimo 44×44px siempre
- Safe area: `padding-bottom: env(safe-area-inset-bottom)` en BottomNav y FAB
- Sin sombras en dark mode — usar border sutil `border border-[#2A2A3E]`
- Glassmorphism solo en HeroCard: `bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm`

## Reglas No Negociables

1. Un componente por archivo. Máximo 250 líneas. Si supera, extraer sub-componentes.
2. Nunca acceder a localStorage directamente en un componente — siempre via hooks o store/localStorage.js.
3. Nunca usar decimales en montos — todos los cálculos con Math.round().
4. Los modales son siempre BottomSheets — no dialogs centrados, no overlays estilo desktop.
5. Dark mode absoluto — no agregar variantes `dark:` sin la clase `dark` en html, no hay modo claro.
6. PWA primero — cualquier feature debe funcionar offline. Si necesita red, mostrar estado de carga apropiado.
7. Moneda COP — formatCOP() para todo monto visible al usuario. Nunca mostrar decimales ni símbolo $.
```

---

## 16. Reglas No Negociables

1. **Un componente por archivo, máximo 250 líneas.** Si un componente supera este límite, extraer sub-componentes. PlanDeudas y ModalTransaccion serán los más complejos — mantenerlos bajo control.

2. **Nunca localStorage directamente en componentes.** Todo acceso a datos va via `hooks/` o `store/localStorage.js`. Esto garantiza que la migración futura a Supabase solo requiera cambiar el store layer.

3. **Montos siempre enteros.** `Math.round()` en todos los cálculos. `formatCOP()` solo para display. Nunca `toFixed()`, nunca `parseFloat()` con decimales en el storage.

4. **Dark mode absoluto.** Agregar la clase `dark` al `<html>` en el primer render y nunca quitarla. No implementar toggle de tema — no está en el brief y complica el CSS.

5. **BottomSheets, no dialogs.** Todos los modales, confirmaciones y formularios deben ser bottom sheets que suben desde abajo. Es el patrón iOS — un dialog centrado rompe la experiencia nativa.

6. **PWA funcional antes de UI polish.** El service worker, manifest e íconos deben estar listos desde el Paso 3. No dejar la configuración PWA para el final o puede haber problemas de caché difíciles de debuggear.

7. **Datos de demo siempre presentes.** La función `cargarSemilla()` debe ejecutarse automáticamente si localStorage está vacío (excluyendo durante el onboarding activo). Una app sin datos se ve vacía y poco impresionante al compartir.

8. **Recharts con ResponsiveContainer.** Todas las gráficas deben usar `<ResponsiveContainer width="100%">` — nunca anchos fijos que rompan en pantallas pequeñas.

9. **Nunca bloquear el hilo principal con cálculos.** `calcularPlanDeudas()` puede ser costoso con muchas deudas — si en el futuro crece, moverlo a un Web Worker. Por ahora, mantener los cálculos en utils y no en el render.

10. **HTTPS en producción para PWA.** El service worker solo funciona en localhost o HTTPS. Vercel provee HTTPS automático — no hacer deploy en hosting HTTP sin SSL.

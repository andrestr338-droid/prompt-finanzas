# PROMPT PARA CLAUDE CODE — App de Finanzas Personales (PWA iPhone)

---

## CONTEXTO Y OBJETIVO

Crea una **Progressive Web App (PWA)** completa de finanzas personales optimizada para iPhone. El usuario actualmente anota sus gastos en el bloc de notas y suma todo manualmente; esta app reemplaza ese flujo con algo profesional, rápido y visualmente limpio.

La app debe poder **instalarse en el iPhone** desde Safari (Add to Home Screen) y funcionar completamente **offline** con datos guardados en `localStorage`. No requiere backend ni autenticación.

---

## STACK TÉCNICO

- **React** (single file `.jsx` si es para artifact, o estructura de archivos si es proyecto)
- **Tailwind CSS** únicamente con clases utilitarias base (sin compilador)
- **localStorage** para persistencia total de datos
- **PWA**: manifest.json + service worker para instalación en iPhone
- **Recharts** para gráficas
- Moneda: **COP (Pesos Colombianos)** — formato: `$ 1.250.000`
- Sin librerías de fechas externas; usar `Date` nativo de JS

---

## DISEÑO VISUAL

**Estilo**: Limpio, profesional, intermedio — inspirado en apps fintech modernas como Nubank o apps de banca digital latinoamericana. No genérico, no corporativo aburrido.


---

## ARQUITECTURA DE LA APP — 5 SECCIONES PRINCIPALES

### 1. 🏠 DASHBOARD (Home)

**Tarjeta principal** (hero card):
- Saldo neto del mes actual (Ingresos − Gastos)
- Color dinámico: verde si positivo, rojo si negativo
- Fecha actual y nombre del mes

**Resumen rápido en 3 chips**:
- Total ingresos del mes
- Total gastos del mes  
- % gastado del ingreso

**Mini-gráfica de barras** (Recharts): últimos 6 meses, barras de ingresos vs gastos

**Alertas inteligentes** (máximo 2, en tarjetas pequeñas):
- Si gastos > 80% de ingresos → alerta amarilla
- Si hay deudas activas → recordatorio
- Si hay meta próxima a cumplirse → motivación

**Acceso rápido**: botón FAB `+` verde flotante (abajo a la derecha) que abre modal para agregar transacción

---

### 2. 💸 TRANSACCIONES

**Sub-tabs**: Gastos | Ingresos | Todo

**Agregar transacción** (modal desde FAB o botón):
- Tipo: Gasto / Ingreso (toggle)
- Monto (campo numérico grande, teclado numérico)
- Categoría (selector visual con íconos):
  - Gastos: 🍔 Comida, 🚗 Transporte, 🏠 Vivienda, 💊 Salud, 🎮 Entretenimiento, 👕 Ropa, 📚 Educación, 💳 Deuda, 📦 Otros
  - Ingresos: 💼 Salario, 🔧 Freelance, 🎁 Regalo, 📈 Inversión, 🏦 Otro ingreso
- Descripción (texto libre, opcional)
- Fecha (por defecto hoy, editable)
- Tipo de ingreso: Fijo / Variable (solo para ingresos)
- Fuente del ingreso (texto libre, ej: "Empresa X", "Cliente Y")
- Botón guardar

**Lista de transacciones**:
- Agrupadas por día
- Ícono de categoría + descripción + monto
- Swipe o botón para eliminar
- Filtro por mes (selector mes/año)

---

### 3. 💳 DEUDAS

**Estructura de cada deuda**:
```
{
  id, nombre, tipo, saldoTotal, saldoActual,
  tasaInteres (% mensual o anual), cuotaMensual,
  fechaInicio, notas
}
```

**Tipos de deuda**:
- 💳 Tarjeta de crédito
- 🏦 Crédito bancario
- 👤 Préstamo personal (plata que se debe a alguien)
- 🏠 Crédito hipotecario
- 🚗 Crédito vehículo
- 📦 Otro

**Vista de deudas**:
- Lista de deudas con barra de progreso (% pagado)
- Total adeudado prominente arriba
- Cuota mensual total (suma de todas las deudas)

**Plan de mitigación de deudas** (sección dentro de Deudas):
- El usuario elige la estrategia:
  - ❄️ **Bola de nieve**: pagar primero la deuda más pequeña (motivación psicológica)
  - 🏔️ **Avalancha**: pagar primero la deuda con mayor tasa de interés (ahorra más dinero)
- La app calcula automáticamente:
  - Orden de pago recomendado
  - Meses estimados para quedar libre de deudas
  - Cuánto dinero extra aplicar a la deuda prioritaria (basado en saldo disponible)
  - Timeline visual (mes a mes) de cuándo se paga cada deuda
- Comparativa: cuánto se ahorra en intereses usando avalancha vs bola de nieve

---

### 4. 🎯 METAS

**Estructura de cada meta**:
```
{
  id, nombre, montoObjetivo, montoActual,
  frecuenciaAhorro (mensual/quincenal/semanal),
  fechaLimite (opcional), emoji, prioridad
}
```

**Agregar meta**:
- Nombre (ej: "Viaje a Cartagena", "Carro", "Fondo de emergencia")
- Emoji/ícono representativo
- Monto objetivo
- Monto ya ahorrado (si tiene algo)
- Frecuencia de aporte: mensual / quincenal / semanal
- Fecha límite (opcional)

**Vista de cada meta**:
- Barra de progreso circular o lineal
- "Te faltan $X — ahorrando $Y cada Z llegas en N meses"
- Botón para registrar un aporte a la meta

**Plan inteligente de prioridades** (sección "Mi Plan"):

La app analiza la situación completa y genera un plan en este orden:
1. **Primero**: cubrir gastos esenciales del mes
2. **Segundo**: pagar cuotas mínimas de todas las deudas
3. **Tercero**: aplicar dinero extra a la estrategia de deudas elegida
4. **Cuarto**: fondo de emergencia (si no tiene uno con 3 meses de gastos)
5. **Quinto**: aportes a metas en orden de prioridad

El plan muestra claramente: *"Este mes te sobran $X. Aquí está el plan recomendado..."* con una distribución visual del dinero disponible.

---

### 5. 📊 REPORTES

**Reporte mensual** (seleccionar mes):

Estructura tipo estado financiero empresarial:

```
════════════════════════════════
   REPORTE FINANCIERO PERSONAL
        Mes — Año
════════════════════════════════

INGRESOS
  Salario fijo          $X
  Freelance             $X
  Otros                 $X
  ─────────────────────────
  TOTAL INGRESOS        $X

GASTOS OPERATIVOS
  Vivienda              $X
  Alimentación          $X
  Transporte            $X
  Salud                 $X
  Entretenimiento       $X
  Educación             $X
  Otros                 $X
  ─────────────────────────
  TOTAL GASTOS          $X

SERVICIO DE DEUDA
  TC Banco X            $X
  Crédito Y             $X
  ─────────────────────────
  TOTAL DEUDA MES       $X

════════════════════════════════
RESULTADO DEL MES
  Ingresos              $X
  − Gastos              $X
  − Deuda               $X
  ─────────────────────────
  SALDO NETO            $X ✅ / $X ⚠️
════════════════════════════════

ESTADO DE DEUDAS (acumulado)
  Total adeudado        $X
  Pagado este mes       $X
  % avance plan         X%

METAS
  Meta 1 — X% completada
  Meta 2 — X% completada
════════════════════════════════
```

**Gráficas del reporte**:
- Pie chart: distribución de gastos por categoría
- Bar chart: ingresos vs gastos de los últimos 6 meses
- Line chart: evolución del saldo neto mes a mes

**Exportar reporte**: botón para copiar el texto del reporte al portapapeles (para pegar en WhatsApp, notas, etc.)

---

## FLUJO PWA — INSTALACIÓN EN IPHONE

Incluir:
- `manifest.json` con `name`, `short_name`, `start_url`, `display: standalone`, `background_color`, `theme_color`, íconos
- `service-worker.js` con cache offline básico
- Meta tags en `<head>`:
  ```html
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="FinanzasCOP">
  <link rel="apple-touch-icon" href="/icon-192.png">
  ```
- Banner de instalación: si el usuario está en Safari iOS y no ha instalado la app, mostrar una tarjeta discreta abajo que diga *"Instala esta app: toca Compartir → Añadir a pantalla de inicio"*

---

## GESTIÓN DE DATOS (localStorage)

Claves de almacenamiento:
```javascript
'fc_transacciones'   // array de transacciones
'fc_deudas'          // array de deudas
'fc_metas'           // array de metas
'fc_config'          // { estrategiaDeuda: 'nieve'|'avalancha', nombreUsuario }
```

Funciones utilitarias necesarias:
- `formatCOP(monto)` → `$ 1.250.000`
- `getMesActual()` → transacciones del mes en curso
- `calcularSaldoMes(mes, año)` → ingresos − gastos del período
- `calcularPlanDeudas(deudas, estrategia, dineroDisponible)`
- `calcularPlanMetas(metas, dineroDisponible)`
- `generarReporte(mes, año)` → objeto con todos los datos del reporte

---

## NAVEGACIÓN

**Bottom Tab Bar** fija (con padding para iPhone notch/home indicator):
- 🏠 Inicio
- 💸 Transacciones  
- 💳 Deudas
- 🎯 Metas
- 📊 Reportes

**FAB** (botón flotante `+`):
- Visible siempre excepto en la pantalla de Reportes
- Al tocarlo, abre un bottom sheet modal con las opciones: Agregar gasto / Agregar ingreso / Abonar a meta

---

## PANTALLA DE BIENVENIDA (onboarding — solo primera vez)

Si no hay datos guardados, mostrar:
1. Bienvenida con nombre del app
2. Pregunta: ¿Cuál es tu ingreso mensual aproximado? (editable después)
3. ¿Tienes deudas? Sí / No → si sí, lleva a agregar la primera
4. ¿Tienes alguna meta de ahorro? Sí / No → si sí, lleva a crear la primera
5. ¡Listo! → Dashboard

---

## DETALLES IMPORTANTES DE UX

- Todos los montos en COP con separador de miles (punto) y sin decimales
- Al escribir un monto, el campo formatea automáticamente mientras el usuario escribe
- Los modales son bottom sheets (se deslizan desde abajo) — más natural en iPhone
- Haptic feedback simulado con animaciones sutiles al guardar
- Estado vacío amigable cuando no hay datos (ilustración simple + texto motivador)
- Confirmación antes de eliminar cualquier dato
- El nombre del mes siempre en español (Enero, Febrero, etc.)

---

## INSTRUCCIONES DE DISEÑO PARA CLAUDE CODE

Usa la skill de diseño frontend con estas directrices:

> **Dirección estética**: Fintech latinoamericana premium. Dark mode absoluto. Números grandes y legibles. Tarjetas con glassmorphism muy sutil. Verde esmeralda como color de vida/dinero. Tipografía `DM Serif Display` para los números grandes del dashboard — contraste elegante con `DM Sans` para el UI. Sensación de app nativa iOS, no de página web.

> **Lo memorable**: Los números de saldo en el hero card deben ser GRANDES, con la fuente serif, y animarse al cargar (contador de 0 al valor real en 800ms). El color del número cambia dinámicamente según sea positivo o negativo.

> **Mobile-first absoluto**: Todo diseñado para pantalla de 390px de ancho (iPhone 14). Nada de layouts de escritorio. Touch targets mínimo 44px. Bottom bar con safe area.

---

## ENTREGABLES ESPERADOS

1. Aplicación React completamente funcional
2. Todos los módulos implementados (no placeholders)
3. Datos de ejemplo precargados para demo (3 meses de transacciones, 2 deudas, 2 metas)
4. Service worker y manifest para instalación PWA
5. Instrucciones breves de cómo instalar en iPhone

---

*Moneda: COP | Idioma: Español | Plataforma objetivo: iPhone (Safari PWA)*

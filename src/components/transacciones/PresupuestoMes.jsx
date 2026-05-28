import { useState } from 'react'
import { formatCOP, formatCOPInput, parseCOP, isSameMonth } from '@/utils/formatters.js'

const CATS = [
  { id: 'comida', emoji: '🍔', label: 'Comida' },
  { id: 'transporte', emoji: '🚗', label: 'Transporte' },
  { id: 'vivienda', emoji: '🏠', label: 'Vivienda' },
  { id: 'salud', emoji: '💊', label: 'Salud' },
  { id: 'entretenimiento', emoji: '🎮', label: 'Ocio' },
  { id: 'ropa', emoji: '👕', label: 'Ropa' },
  { id: 'educacion', emoji: '📚', label: 'Educación' },
  { id: 'deuda', emoji: '💳', label: 'Deuda' },
  { id: 'otros', emoji: '📦', label: 'Otros' },
]

const R = 68
const CIRC = 2 * Math.PI * R

function RingChart({ pct }) {
  const clamp = Math.min(Math.max(pct, 0), 1)
  const offset = CIRC * (1 - clamp)
  const color = pct < 0.7 ? '#10B981' : pct < 0.9 ? '#F59E0B' : '#EF4444'

  return (
    <svg width="176" height="176" viewBox="0 0 176 176">
      <circle cx="88" cy="88" r={R} fill="none" stroke="#2A2A3E" strokeWidth="14" />
      <circle
        cx="88" cy="88" r={R}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={offset}
        transform="rotate(-90 88 88)"
        style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
      />
    </svg>
  )
}

export default function PresupuestoMes({ transacciones, mes, año, limites, setLimite }) {
  const [editando, setEditando] = useState(null)
  const [inputVal, setInputVal] = useState('')

  const gastosMes = transacciones.filter(t => t.tipo === 'gasto' && isSameMonth(t.fecha, mes, año))

  const gastoPorCat = {}
  gastosMes.forEach(t => {
    gastoPorCat[t.categoria] = (gastoPorCat[t.categoria] ?? 0) + t.monto
  })

  const totalGastado = gastosMes.reduce((s, t) => s + t.monto, 0)
  const totalPresupuesto = Object.values(limites).reduce((s, v) => s + v, 0)
  const pctTotal = totalPresupuesto > 0 ? totalGastado / totalPresupuesto : 0

  const hayExcedidos = CATS.some(c => (limites[c.id] ?? 0) > 0 && (gastoPorCat[c.id] ?? 0) > limites[c.id])

  function iniciarEdicion(catId) {
    setEditando(catId)
    setInputVal(limites[catId] ? formatCOPInput(String(limites[catId])) : '')
  }

  function guardarLimite(catId) {
    const monto = parseCOP(inputVal)
    setLimite(catId, monto)
    setEditando(null)
    setInputVal('')
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {hayExcedidos && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-card px-4 py-3 flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <p className="text-destructive text-xs font-medium">Tienes categorías que excedieron el presupuesto del mes</p>
        </div>
      )}

      {/* Ring + totales */}
      <div className="bg-surface rounded-card p-5 flex flex-col items-center">
        <div className="relative">
          <RingChart pct={pctTotal} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-text-primary font-semibold text-2xl font-serif leading-none">
              {totalPresupuesto > 0 ? `${Math.round(pctTotal * 100)}%` : '—'}
            </span>
            <span className="text-text-disabled text-[11px] mt-1">del presupuesto</span>
          </div>
        </div>

        <div className="flex gap-8 mt-3">
          <div className="text-center">
            <p className="text-text-disabled text-[11px] mb-0.5">Gastado</p>
            <p className="text-destructive font-semibold text-sm font-serif">{formatCOP(totalGastado)}</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-text-disabled text-[11px] mb-0.5">Presupuesto</p>
            <p className="text-text-primary font-semibold text-sm font-serif">
              {totalPresupuesto > 0 ? formatCOP(totalPresupuesto) : 'Sin definir'}
            </p>
          </div>
        </div>

        {totalPresupuesto === 0 && (
          <p className="text-text-disabled text-xs mt-4 text-center leading-relaxed">
            Toca ✏️ en cada categoría para definir tu presupuesto mensual.
          </p>
        )}
      </div>

      {/* Categorías */}
      <div className="flex flex-col gap-2">
        {CATS.map(cat => {
          const gastado = gastoPorCat[cat.id] ?? 0
          const limite = limites[cat.id] ?? 0
          const pct = limite > 0 ? Math.min(gastado / limite, 1) : 0
          const excedido = limite > 0 && gastado > limite
          const barColor = pct < 0.7 ? 'bg-primary' : pct < 0.9 ? 'bg-warning' : 'bg-destructive'
          const isEditing = editando === cat.id

          return (
            <div key={cat.id} className="bg-surface rounded-card px-4 py-3">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-lg leading-none">{cat.emoji}</span>
                <span className="text-text-primary text-sm font-medium flex-1">{cat.label}</span>
                <span className={`font-serif text-sm ${gastado > 0 ? 'text-text-primary' : 'text-text-disabled'}`}>
                  {formatCOP(gastado)}
                </span>
                <button
                  onClick={() => isEditing ? setEditando(null) : iniciarEdicion(cat.id)}
                  className="text-text-disabled text-sm active:text-primary px-0.5"
                >
                  ✏️
                </button>
              </div>

              {isEditing && (
                <div className="flex gap-2 mb-2.5">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Límite mensual"
                      value={inputVal}
                      autoFocus
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '')
                        setInputVal(raw ? formatCOPInput(raw) : '')
                      }}
                      onKeyDown={e => e.key === 'Enter' && guardarLimite(cat.id)}
                      className="w-full bg-elevated border border-primary rounded-card pl-7 pr-3 py-2 text-text-primary text-sm focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => guardarLimite(cat.id)}
                    className="bg-primary text-white text-xs px-4 py-2 rounded-card font-semibold active:scale-95 transition-all"
                  >
                    OK
                  </button>
                </div>
              )}

              <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: limite > 0 ? `${Math.round(pct * 100)}%` : '0%' }}
                />
              </div>

              {limite > 0 && (
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px]">
                    {excedido
                      ? <span className="text-destructive font-medium">Excedido {formatCOP(gastado - limite)}</span>
                      : <span className="text-text-disabled">Disponible {formatCOP(limite - gastado)}</span>
                    }
                  </span>
                  <span className="text-text-disabled text-[10px]">Límite {formatCOP(limite)}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

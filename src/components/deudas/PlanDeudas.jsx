import { useState } from 'react'
import { calcularPlanDeudas } from '@/utils/calculos.js'
import { formatCOP, formatCOPInput, parseCOP } from '@/utils/formatters.js'

export default function PlanDeudas({ deudas, estrategia, onCambiarEstrategia }) {
  const [extraStr, setExtraStr] = useState('')
  const extra = parseCOP(extraStr)

  const plan = calcularPlanDeudas(deudas, estrategia, extra)
  const planAlternativo = calcularPlanDeudas(deudas, estrategia === 'nieve' ? 'avalancha' : 'nieve', extra)

  if (!deudas.length) {
    return <p className="text-text-secondary text-center py-8">No tienes deudas registradas.</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Selector estrategia */}
      <div>
        <p className="text-text-secondary text-xs mb-2">Estrategia de pago</p>
        <div className="flex gap-2">
          {[
            { id: 'nieve', emoji: '❄️', label: 'Bola de nieve', desc: 'Deuda más pequeña primero' },
            { id: 'avalancha', emoji: '🏔️', label: 'Avalancha', desc: 'Mayor interés primero' },
          ].map(e => (
            <button key={e.id} onClick={() => onCambiarEstrategia(e.id)}
              className={`flex-1 p-3 rounded-card border text-left transition-colors ${estrategia === e.id ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}>
              <p className="text-lg mb-1">{e.emoji}</p>
              <p className={`text-sm font-medium ${estrategia === e.id ? 'text-primary' : 'text-text-primary'}`}>{e.label}</p>
              <p className="text-text-disabled text-[11px]">{e.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Pago extra */}
      <div>
        <label className="text-text-secondary text-xs mb-2 block">¿Cuánto extra puedes pagar al mes?</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-serif">$</span>
          <input type="tel" inputMode="numeric" placeholder="0" value={extraStr}
            onChange={e => { const r = e.target.value.replace(/\D/g, ''); setExtraStr(r ? formatCOPInput(r) : '') }}
            className="w-full bg-surface border border-border rounded-card pl-9 pr-4 py-3 text-text-primary font-serif text-base focus:outline-none focus:border-primary" />
        </div>
      </div>

      {/* Orden de pago */}
      {plan.orden.length > 0 && (
        <div>
          <p className="text-text-secondary text-xs mb-3">Orden de pago recomendado</p>
          <div className="flex flex-col gap-2">
            {plan.orden.map((d, i) => (
              <div key={d.id} className="flex items-center gap-3 bg-surface rounded-card p-3 border border-border">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm font-medium truncate">{d.nombre}</p>
                  <p className="text-text-disabled text-xs">{formatCOP(d.saldoActual)} pendiente</p>
                </div>
                <div className="text-right">
                  <p className="text-primary text-xs font-medium">{d.mesPago} {d.mesPago === 1 ? 'mes' : 'meses'}</p>
                  <p className="text-text-disabled text-[10px]">para liquidar</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="bg-surface rounded-card border border-border p-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-text-secondary text-sm">Meses total libre de deudas</span>
          <span className="text-text-primary font-semibold">{plan.mesesTotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary text-sm">Intereses totales</span>
          <span className="text-destructive font-serif text-sm">{formatCOP(plan.totalInteresesPagados ?? 0)}</span>
        </div>
        {planAlternativo.mesesTotal !== plan.mesesTotal && (
          <div className="mt-1 pt-2 border-t border-border">
            <p className="text-text-disabled text-xs">
              Con la estrategia {estrategia === 'nieve' ? 'avalancha' : 'bola de nieve'} tardarías{' '}
              <span className="text-warning">{planAlternativo.mesesTotal} meses</span> y pagarías{' '}
              <span className="text-warning">{formatCOP(planAlternativo.totalInteresesPagados ?? 0)}</span> en intereses.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

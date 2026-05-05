import { useState } from 'react'
import ProgressBar from '@/components/ui/ProgressBar.jsx'
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx'
import BottomSheet from '@/components/ui/BottomSheet.jsx'
import { formatCOP, formatCOPInput, parseCOP } from '@/utils/formatters.js'

export default function MetaItem({ meta, onEliminar, onAbonar }) {
  const [confirmar, setConfirmar] = useState(false)
  const [abonarOpen, setAbonarOpen] = useState(false)
  const [montoStr, setMontoStr] = useState('')

  const pct = meta.montoObjetivo > 0 ? Math.round((meta.montoActual / meta.montoObjetivo) * 100) : 0
  const faltante = Math.max(0, meta.montoObjetivo - meta.montoActual)
  const mesesRestantes = meta.aporteMensual > 0 ? Math.ceil(faltante / meta.aporteMensual) : null
  const completada = pct >= 100

  function guardarAbono() {
    const monto = parseCOP(montoStr)
    if (!monto) return
    onAbonar(meta.id, monto)
    setMontoStr('')
    setAbonarOpen(false)
  }

  return (
    <>
      <div className={`bg-surface rounded-card border p-4 ${completada ? 'border-primary/40' : 'border-border'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.emoji}</span>
            <div>
              <p className="text-text-primary font-medium text-base">{meta.nombre}</p>
              <p className="text-text-disabled text-xs">{formatCOP(meta.montoActual)} de {formatCOP(meta.montoObjetivo)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!completada && (
              <button onClick={() => setAbonarOpen(true)} className="text-primary text-xs font-medium bg-primary/10 px-3 py-1.5 rounded-chip active:scale-95 transition-transform">
                Abonar
              </button>
            )}
            <button onClick={() => setConfirmar(true)} className="text-text-disabled text-base active:text-destructive p-1">🗑</button>
          </div>
        </div>

        <ProgressBar porcentaje={pct} color={completada ? 'bg-primary' : 'bg-primary'} />

        <div className="flex justify-between mt-3">
          <span className="text-primary text-sm font-medium">{pct}% completada</span>
          {completada ? (
            <span className="text-primary text-sm">🎉 ¡Meta cumplida!</span>
          ) : mesesRestantes ? (
            <span className="text-text-disabled text-xs">~{mesesRestantes} {mesesRestantes === 1 ? 'mes' : 'meses'} restantes</span>
          ) : null}
        </div>

        {!completada && faltante > 0 && meta.aporteMensual > 0 && (
          <p className="text-text-disabled text-xs mt-1">
            Faltan {formatCOP(faltante)} · aportando {formatCOP(meta.aporteMensual)}/{meta.frecuenciaAhorro}
          </p>
        )}
      </div>

      {/* Modal abonar */}
      <BottomSheet isOpen={abonarOpen} onClose={() => setAbonarOpen(false)} title={`Abonar a ${meta.nombre}`}>
        <div className="py-2">
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-serif text-xl">$</span>
            <input type="tel" inputMode="numeric" placeholder="0" value={montoStr}
              onChange={e => { const r = e.target.value.replace(/\D/g, ''); setMontoStr(r ? formatCOPInput(r) : '') }}
              className="w-full bg-surface border border-border rounded-card pl-10 pr-4 py-4 text-text-primary font-serif text-2xl focus:outline-none focus:border-primary" />
          </div>
          <button onClick={guardarAbono} disabled={!parseCOP(montoStr)}
            className="w-full py-4 rounded-card bg-primary text-white font-semibold disabled:opacity-40 active:scale-95 transition-all">
            Registrar abono
          </button>
        </div>
      </BottomSheet>

      <ConfirmDialog isOpen={confirmar} onConfirm={() => { setConfirmar(false); onEliminar(meta.id) }}
        onCancel={() => setConfirmar(false)} mensaje={`¿Eliminar la meta "${meta.nombre}"?`} />
    </>
  )
}

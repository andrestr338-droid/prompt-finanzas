import { useState } from 'react'
import ProgressBar from '@/components/ui/ProgressBar.jsx'
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx'
import { formatCOP } from '@/utils/formatters.js'

const EMOJIS_TIPO = { tarjeta:'💳', bancario:'🏦', personal:'👤', hipotecario:'🏠', vehiculo:'🚗', otro:'📦' }

export default function DeudaItem({ deuda, onEliminar }) {
  const [confirmar, setConfirmar] = useState(false)
  const pct = deuda.saldoTotal > 0 ? Math.round(((deuda.saldoTotal - deuda.saldoActual) / deuda.saldoTotal) * 100) : 0

  return (
    <>
      <div className="bg-surface rounded-card border border-border p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{EMOJIS_TIPO[deuda.tipo] ?? '📦'}</span>
            <div>
              <p className="text-text-primary font-medium text-base">{deuda.nombre}</p>
              <p className="text-text-disabled text-xs">{deuda.tasaInteres}% mensual</p>
            </div>
          </div>
          <button onClick={() => setConfirmar(true)} className="text-text-disabled text-lg active:text-destructive p-1">🗑</button>
        </div>

        <ProgressBar porcentaje={pct} />

        <div className="flex justify-between mt-3">
          <div>
            <p className="text-text-disabled text-[10px] uppercase tracking-wider">Pendiente</p>
            <p className="text-destructive font-serif text-base">{formatCOP(deuda.saldoActual)}</p>
          </div>
          <div className="text-right">
            <p className="text-text-disabled text-[10px] uppercase tracking-wider">Cuota mensual</p>
            <p className="text-text-primary font-serif text-base">{formatCOP(deuda.cuotaMensual)}</p>
          </div>
          <div className="text-right">
            <p className="text-text-disabled text-[10px] uppercase tracking-wider">Pagado</p>
            <p className="text-primary font-serif text-base">{pct}%</p>
          </div>
        </div>
        {deuda.notas && <p className="text-text-disabled text-xs mt-2 italic">{deuda.notas}</p>}
      </div>

      <ConfirmDialog
        isOpen={confirmar}
        onConfirm={() => { setConfirmar(false); onEliminar(deuda.id) }}
        onCancel={() => setConfirmar(false)}
        mensaje={`¿Eliminar "${deuda.nombre}"?`}
      />
    </>
  )
}

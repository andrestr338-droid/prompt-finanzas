import { useState } from 'react'
import DeudaItem from './DeudaItem.jsx'
import ModalDeuda from './ModalDeuda.jsx'
import PlanDeudas from './PlanDeudas.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCOP } from '@/utils/formatters.js'

export default function Deudas({ deudas, onAgregar, onEliminar, estrategia, onCambiarEstrategia }) {
  const [tab, setTab] = useState('lista')
  const [modal, setModal] = useState(false)

  const totalDeuda = deudas.reduce((s, d) => s + d.saldoActual, 0)
  const totalCuotas = deudas.reduce((s, d) => s + d.cuotaMensual, 0)

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-14 pb-4 bg-background">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-text-primary text-2xl font-semibold">Deudas</h1>
          <button onClick={() => setModal(true)}
            className="bg-primary/20 text-primary text-sm font-medium px-4 py-2 rounded-chip active:scale-95 transition-transform">
            + Agregar
          </button>
        </div>

        {deudas.length > 0 && (
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-surface rounded-card border border-border px-4 py-3">
              <p className="text-text-disabled text-[10px] uppercase tracking-wider">Total adeudado</p>
              <p className="text-destructive font-serif text-lg">{formatCOP(totalDeuda)}</p>
            </div>
            <div className="flex-1 bg-surface rounded-card border border-border px-4 py-3">
              <p className="text-text-disabled text-[10px] uppercase tracking-wider">Cuota mensual</p>
              <p className="text-text-primary font-serif text-lg">{formatCOP(totalCuotas)}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {['lista', 'plan'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-chip text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-primary text-white' : 'bg-surface text-text-secondary'}`}>
              {t === 'lista' ? 'Mis deudas' : '📋 Plan de pago'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-safe">
        {tab === 'lista' ? (
          deudas.length === 0 ? (
            <EmptyState icono="💳" titulo="Sin deudas registradas" descripcion="Agrega tus deudas para calcular el mejor plan de pago." accion={{ label: 'Agregar deuda', onClick: () => setModal(true) }} />
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              {deudas.map(d => <DeudaItem key={d.id} deuda={d} onEliminar={onEliminar} />)}
            </div>
          )
        ) : (
          <div className="pt-2">
            <PlanDeudas deudas={deudas} estrategia={estrategia} onCambiarEstrategia={onCambiarEstrategia} />
          </div>
        )}
      </div>

      <ModalDeuda isOpen={modal} onClose={() => setModal(false)} onGuardar={onAgregar} />
    </div>
  )
}

import { useState } from 'react'
import MetaItem from './MetaItem.jsx'
import ModalMeta from './ModalMeta.jsx'
import PlanMetas from './PlanMetas.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCOP } from '@/utils/formatters.js'

export default function Metas({ metas, transacciones, deudas, onAgregar, onEliminar, onAbonar }) {
  const [tab, setTab] = useState('metas')
  const [modal, setModal] = useState(false)

  const totalAhorrado = metas.reduce((s, m) => s + m.montoActual, 0)
  const totalObjetivo = metas.reduce((s, m) => s + m.montoObjetivo, 0)

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-14 pb-4 bg-background">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-text-primary text-2xl font-semibold">Metas</h1>
          <button onClick={() => setModal(true)} className="bg-primary/20 text-primary text-sm font-medium px-4 py-2 rounded-chip active:scale-95 transition-transform">
            + Agregar
          </button>
        </div>

        {metas.length > 0 && (
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-surface rounded-card border border-border px-4 py-3">
              <p className="text-text-disabled text-[10px] uppercase tracking-wider">Ahorrado</p>
              <p className="text-primary font-serif text-lg">{formatCOP(totalAhorrado)}</p>
            </div>
            <div className="flex-1 bg-surface rounded-card border border-border px-4 py-3">
              <p className="text-text-disabled text-[10px] uppercase tracking-wider">Objetivo total</p>
              <p className="text-text-primary font-serif text-lg">{formatCOP(totalObjetivo)}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {[['metas','Mis metas'],['plan','📋 Mi plan']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-chip text-sm font-medium transition-colors ${tab === id ? 'bg-primary text-white' : 'bg-surface text-text-secondary'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-safe">
        {tab === 'metas' ? (
          metas.length === 0 ? (
            <EmptyState icono="🎯" titulo="Sin metas aún" descripcion="Crea tu primera meta y empieza a ahorrar con un plan claro." accion={{ label: 'Crear meta', onClick: () => setModal(true) }} />
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              {metas.map(m => <MetaItem key={m.id} meta={m} onEliminar={onEliminar} onAbonar={onAbonar} />)}
            </div>
          )
        ) : (
          <div className="pt-2">
            <PlanMetas metas={metas} transacciones={transacciones} deudas={deudas} />
          </div>
        )}
      </div>

      <ModalMeta isOpen={modal} onClose={() => setModal(false)} onGuardar={onAgregar} />
    </div>
  )
}

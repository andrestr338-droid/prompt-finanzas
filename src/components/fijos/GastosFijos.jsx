import { useState } from 'react'
import ModalGastoFijo from './ModalGastoFijo.jsx'
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCOP, getMesActual, getMesNombre } from '@/utils/formatters.js'

const EMOJIS_CAT = {
  vivienda:'🏠', servicios:'💡', transporte:'🚗', salud:'💊',
  educacion:'📚', entretenimiento:'🎮', comida:'🍔', deuda:'💳', otros:'📦',
}

function getMesKey(mes, año) {
  return `${año}-${String(mes + 1).padStart(2, '0')}`
}

export default function GastosFijos({ fijos, onAgregar, onEliminar, onTildar, onDestildar }) {
  const { mes, año } = getMesActual()
  const mesKey = getMesKey(mes, año)
  const [modal, setModal] = useState(false)
  const [confirmar, setConfirmar] = useState(null)

  const pagados = fijos.filter(f => (f.pagos ?? []).includes(mesKey))
  const pendientes = fijos.filter(f => !(f.pagos ?? []).includes(mesKey))
  const totalMes = fijos.reduce((s, f) => s + f.monto, 0)
  const totalPagado = pagados.reduce((s, f) => s + f.monto, 0)
  const pct = totalMes > 0 ? Math.round((totalPagado / totalMes) * 100) : 0

  function handleTildar(fijo) {
    if ((fijo.pagos ?? []).includes(mesKey)) {
      onDestildar(fijo.id, mesKey)
    } else {
      onTildar(fijo.id, mesKey, fijo)
    }
  }

  const ItemFijo = ({ fijo }) => {
    const pagado = (fijo.pagos ?? []).includes(mesKey)
    return (
      <div className={`flex items-center gap-3 p-4 rounded-card border transition-all ${pagado ? 'border-primary/30 bg-primary/5 opacity-70' : 'border-border bg-surface'}`}>
        {/* Checkbox */}
        <button onClick={() => handleTildar(fijo)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${pagado ? 'border-primary bg-primary' : 'border-border'}`}>
          {pagado && <span className="text-white text-xs font-bold">✓</span>}
        </button>

        <span className="text-xl flex-shrink-0">{EMOJIS_CAT[fijo.categoria] ?? '📦'}</span>

        <div className="flex-1 min-w-0">
          <p className={`text-base font-medium ${pagado ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
            {fijo.nombre}
          </p>
          {fijo.tipo === 'deuda' && <p className="text-text-disabled text-xs">Cuota deuda</p>}
        </div>

        <div className="flex items-center gap-2">
          <span className={`font-serif text-base ${pagado ? 'text-primary' : 'text-text-primary'}`}>
            {formatCOP(fijo.monto)}
          </span>
          {fijo.tipo !== 'deuda' && (
            <button onClick={() => setConfirmar(fijo)} className="text-text-disabled text-base active:text-destructive p-1">🗑</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-14 pb-4 bg-background">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-text-primary text-2xl font-semibold">Gastos Fijos</h1>
            <p className="text-text-secondary text-sm">{getMesNombre(mes)} {año}</p>
          </div>
          <button onClick={() => setModal(true)}
            className="bg-primary/20 text-primary text-sm font-medium px-4 py-2 rounded-chip active:scale-95 transition-transform">
            + Agregar
          </button>
        </div>

        {/* Barra de progreso del mes */}
        {fijos.length > 0 && (
          <div className="bg-surface rounded-card border border-border p-4">
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary text-sm">{pagados.length} de {fijos.length} pagados</span>
              <span className="text-primary text-sm font-medium">{pct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-border overflow-hidden">
              <div className="h-2 bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-text-disabled text-xs">Pagado: {formatCOP(totalPagado)}</span>
              <span className="text-text-disabled text-xs">Total: {formatCOP(totalMes)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-safe">
        {fijos.length === 0 ? (
          <EmptyState
            icono="📋"
            titulo="Sin gastos fijos"
            descripcion="Agrega tus compromisos mensuales: arriendo, servicios, suscripciones... Las cuotas de tus deudas se agregan automáticamente."
            accion={{ label: 'Agregar gasto fijo', onClick: () => setModal(true) }}
          />
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            {/* Pendientes */}
            {pendientes.length > 0 && (
              <div>
                <p className="text-text-disabled text-xs uppercase tracking-wider mb-2">Pendientes ({pendientes.length})</p>
                <div className="flex flex-col gap-2">
                  {pendientes.map(f => <ItemFijo key={f.id} fijo={f} />)}
                </div>
              </div>
            )}

            {/* Pagados */}
            {pagados.length > 0 && (
              <div>
                <p className="text-text-disabled text-xs uppercase tracking-wider mb-2">Pagados ({pagados.length})</p>
                <div className="flex flex-col gap-2">
                  {pagados.map(f => <ItemFijo key={f.id} fijo={f} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ModalGastoFijo isOpen={modal} onClose={() => setModal(false)} onGuardar={onAgregar} />

      <ConfirmDialog
        isOpen={!!confirmar}
        onConfirm={() => { onEliminar(confirmar.id); setConfirmar(null) }}
        onCancel={() => setConfirmar(null)}
        mensaje={confirmar ? `¿Eliminar "${confirmar.nombre}" de los gastos fijos?` : ''}
      />
    </div>
  )
}

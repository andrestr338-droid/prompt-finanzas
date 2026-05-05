import TransaccionItem from './TransaccionItem.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCOP, formatFechaLarga, isSameMonth } from '@/utils/formatters.js'

function agruparPorDia(transacciones) {
  const grupos = {}
  transacciones.forEach(t => {
    if (!grupos[t.fecha]) grupos[t.fecha] = []
    grupos[t.fecha].push(t)
  })
  return Object.entries(grupos).sort(([a], [b]) => b.localeCompare(a))
}

export default function ListaTransacciones({ transacciones, filtroTipo, mes, año, onEliminar, onAgregar }) {
  const filtradas = transacciones
    .filter(t => isSameMonth(t.fecha, mes, año))
    .filter(t => filtroTipo === 'todo' || t.tipo === filtroTipo)

  if (!filtradas.length) {
    return (
      <EmptyState
        icono={filtroTipo === 'gasto' ? '💸' : filtroTipo === 'ingreso' ? '💰' : '📭'}
        titulo="Sin transacciones"
        descripcion="Toca + para registrar tu primer movimiento del mes."
        accion={{ label: 'Agregar', onClick: onAgregar }}
      />
    )
  }

  const grupos = agruparPorDia(filtradas)

  return (
    <div className="flex flex-col gap-4">
      {grupos.map(([fecha, items]) => {
        const totalDia = items.reduce((s, t) => t.tipo === 'ingreso' ? s + t.monto : s - t.monto, 0)
        return (
          <div key={fecha}>
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-text-secondary text-xs font-medium">{formatFechaLarga(fecha)}</span>
              <span className={`text-xs font-serif ${totalDia >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {totalDia >= 0 ? '+' : ''}{formatCOP(totalDia)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map(t => (
                <TransaccionItem key={t.id} transaccion={t} onEliminar={onEliminar} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

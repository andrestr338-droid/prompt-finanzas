import { formatCOP, isSameMonth } from '@/utils/formatters.js'

const CAT_EMOJI = {
  comida: '🍔', transporte: '🚗', vivienda: '🏠', salud: '💊',
  entretenimiento: '🎮', ropa: '👕', educacion: '📚', deuda: '💳', otros: '📦',
}

export default function GastosTarjeta({ gastos, mes, año, onPagarTarjeta, onEliminar }) {
  const delMes = gastos.filter(g => isSameMonth(g.fecha, mes, año))

  if (delMes.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-4xl mb-3">💳</p>
        <p className="text-text-secondary text-sm">No hay gastos en tarjeta este mes.</p>
        <p className="text-text-disabled text-xs mt-1">Cuando pagues con tarjeta de crédito aparecerán aquí.</p>
      </div>
    )
  }

  // Agrupar por tarjeta
  const gruposMap = {}
  delMes.forEach(g => {
    const key = g.tcId ?? 'sin-tarjeta'
    if (!gruposMap[key]) {
      gruposMap[key] = { tcId: g.tcId, tcNombre: g.tcNombre ?? 'Sin tarjeta', items: [] }
    }
    gruposMap[key].items.push(g)
  })

  const grupos = Object.values(gruposMap).map(g => ({
    ...g,
    pagado: g.items.every(i => i.pagado),
    total: g.items.reduce((s, i) => s + i.monto, 0),
  }))

  const totalGeneral = grupos.reduce((s, g) => s + g.total, 0)

  return (
    <div className="flex flex-col gap-4 pt-2 pb-6">
      {grupos.map(grupo => (
        <div key={grupo.tcId ?? 'sin'} className="bg-surface rounded-card border border-border overflow-hidden">

          {/* Cabecera tarjeta */}
          <div className={`flex items-center justify-between px-4 py-3 border-b border-border ${grupo.pagado ? 'bg-primary/10' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <span className="text-text-primary font-semibold text-sm">{grupo.tcNombre}</span>
            </div>
            {grupo.pagado
              ? <span className="text-primary text-xs font-semibold">✅ Pagado</span>
              : (
                <button
                  onClick={() => onPagarTarjeta(grupo.tcId, grupo.tcNombre, grupo.total, mes, año)}
                  className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-chip active:scale-95 transition-transform"
                >
                  Marcar pagado
                </button>
              )
            }
          </div>

          {/* Items */}
          <div className="divide-y divide-border">
            {grupo.items.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="text-base shrink-0">{CAT_EMOJI[item.categoria] ?? '📦'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm truncate">{item.descripcion || item.categoria}</p>
                  <p className="text-text-disabled text-xs">{item.fecha}</p>
                </div>
                <p className="text-destructive font-serif text-sm shrink-0">{formatCOP(item.monto)}</p>
                {!item.pagado && (
                  <button onClick={() => onEliminar(item.id)} className="text-text-disabled text-base active:text-destructive pl-1 shrink-0">🗑</button>
                )}
              </div>
            ))}
          </div>

          {/* Total por tarjeta */}
          <div className={`flex justify-between items-center px-4 py-3 border-t border-border ${grupo.pagado ? 'bg-primary/5' : 'bg-black/10'}`}>
            <span className="text-text-secondary text-xs uppercase tracking-wider">
              {grupo.pagado ? 'Total pagado' : 'Acumulado pendiente'}
            </span>
            <span className={`font-serif text-lg font-semibold ${grupo.pagado ? 'text-primary' : 'text-destructive'}`}>
              {formatCOP(grupo.total)}
            </span>
          </div>
        </div>
      ))}

      {/* Total general si hay más de una tarjeta */}
      {grupos.length > 1 && (
        <div className="bg-surface rounded-card border border-border px-4 py-3 flex justify-between items-center">
          <span className="text-text-secondary text-xs uppercase tracking-wider">Total todas las tarjetas</span>
          <span className="font-serif text-lg font-semibold text-destructive">{formatCOP(totalGeneral)}</span>
        </div>
      )}
    </div>
  )
}

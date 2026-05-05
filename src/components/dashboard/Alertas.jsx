export default function Alertas({ ingresos, gastos, deudas, metas }) {
  const alertas = []

  if (ingresos > 0 && gastos / ingresos >= 0.8) {
    const pct = Math.round((gastos / ingresos) * 100)
    alertas.push({
      icono: '⚠️',
      color: 'border-warning/30 bg-warning/5',
      texto: `Llevas el ${pct}% de tus ingresos gastados este mes.`,
    })
  }

  const deudasActivas = deudas.filter(d => d.saldoActual > 0)
  if (deudasActivas.length > 0) {
    const totalCuotas = deudasActivas.reduce((s, d) => s + d.cuotaMensual, 0)
    alertas.push({
      icono: '💳',
      color: 'border-info/30 bg-info/5',
      texto: `Tienes ${deudasActivas.length} deuda${deudasActivas.length > 1 ? 's' : ''} activa${deudasActivas.length > 1 ? 's' : ''}. Cuota total: $${totalCuotas.toLocaleString('es-CO')}.`,
    })
  }

  const metasCercanas = metas.filter(m => {
    if (!m.fechaLimite || m.montoActual >= m.montoObjetivo) return false
    const dias = (new Date(m.fechaLimite) - new Date()) / (1000 * 60 * 60 * 24)
    return dias > 0 && dias <= 90
  })
  if (metasCercanas.length > 0 && alertas.length < 2) {
    alertas.push({
      icono: '🎯',
      color: 'border-primary/30 bg-primary/5',
      texto: `¡${metasCercanas[0].emoji} ${metasCercanas[0].nombre} está cerca! Sigue así.`,
    })
  }

  const visibles = alertas.slice(0, 2)
  if (!visibles.length) return null

  return (
    <div className="px-5 mt-3 flex flex-col gap-2">
      {visibles.map((a, i) => (
        <div key={i} className={`flex items-start gap-3 p-3 rounded-card border ${a.color}`}>
          <span className="text-lg flex-shrink-0">{a.icono}</span>
          <p className="text-text-secondary text-xs leading-relaxed">{a.texto}</p>
        </div>
      ))}
    </div>
  )
}

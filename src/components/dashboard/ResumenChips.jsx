import { formatCOP } from '@/utils/formatters.js'

export default function ResumenChips({ ingresos, gastos }) {
  const pct = ingresos > 0 ? Math.round((gastos / ingresos) * 100) : 0
  const pctColor = pct >= 100 ? 'text-destructive bg-destructive/10' : pct >= 80 ? 'text-warning bg-warning/10' : 'text-primary bg-primary/10'

  return (
    <div className="flex gap-2 px-5 mt-3">
      <div className="flex-1 bg-surface rounded-card px-3 py-2.5 border border-border">
        <p className="text-text-disabled text-[10px] uppercase tracking-wider">Ingresos</p>
        <p className="text-primary font-serif text-sm mt-0.5">{formatCOP(ingresos)}</p>
      </div>
      <div className="flex-1 bg-surface rounded-card px-3 py-2.5 border border-border">
        <p className="text-text-disabled text-[10px] uppercase tracking-wider">Gastos</p>
        <p className="text-destructive font-serif text-sm mt-0.5">{formatCOP(gastos)}</p>
      </div>
      <div className={`bg-surface rounded-card px-3 py-2.5 border border-border flex items-center justify-center ${pctColor}`}>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider opacity-70">Gastado</p>
          <p className="font-serif text-sm font-normal mt-0.5">{pct}%</p>
        </div>
      </div>
    </div>
  )
}

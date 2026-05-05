import { calcularPlanMetas } from '@/utils/calculos.js'
import { formatCOP } from '@/utils/formatters.js'
import { calcularSaldoMes } from '@/utils/calculos.js'
import { getMesActual } from '@/utils/formatters.js'

export default function PlanMetas({ metas, transacciones, deudas }) {
  const { mes, año } = getMesActual()
  const { ingresos, gastos } = calcularSaldoMes(transacciones, mes, año)
  const cuotasDeuda = deudas.reduce((s, d) => s + d.cuotaMensual, 0)
  const { distribucion, disponible } = calcularPlanMetas(metas, ingresos, gastos, cuotasDeuda)

  const pasos = [
    { label: 'Gastos esenciales del mes', monto: gastos, color: 'bg-text-disabled' },
    { label: 'Cuotas mínimas de deudas', monto: cuotasDeuda, color: 'bg-warning' },
    { label: 'Disponible para metas', monto: disponible, color: 'bg-primary' },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen */}
      <div className="bg-surface rounded-card border border-border p-4">
        <p className="text-text-secondary text-xs mb-3">Este mes tienes disponible</p>
        <p className={`font-serif text-3xl ${disponible > 0 ? 'text-primary' : 'text-destructive'}`}>{formatCOP(disponible)}</p>
        <p className="text-text-disabled text-xs mt-1">Ingresos {formatCOP(ingresos)} − Gastos {formatCOP(gastos)} − Deudas {formatCOP(cuotasDeuda)}</p>
      </div>

      {/* Distribución prioridades */}
      <div>
        <p className="text-text-secondary text-xs mb-3">Plan de prioridades</p>
        <div className="flex flex-col gap-2">
          {pasos.map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface rounded-card p-3 border border-border">
              <div className={`w-2 h-8 rounded-full ${p.color} flex-shrink-0`} />
              <div className="flex-1">
                <p className="text-text-primary text-sm">{i + 1}. {p.label}</p>
              </div>
              <p className="font-serif text-sm text-text-primary">{formatCOP(p.monto)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución entre metas */}
      {distribucion.length > 0 && disponible > 0 && (
        <div>
          <p className="text-text-secondary text-xs mb-3">Distribución entre metas</p>
          <div className="flex flex-col gap-2">
            {distribucion.map(({ meta, aporte, mesesRestantes, completada }) => (
              <div key={meta.id} className="flex items-center gap-3 bg-surface rounded-card p-3 border border-border">
                <span className="text-xl">{meta.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm truncate">{meta.nombre}</p>
                  {mesesRestantes && <p className="text-text-disabled text-xs">{mesesRestantes} meses para completar</p>}
                  {completada && <p className="text-primary text-xs">✓ Completada</p>}
                </div>
                <p className="text-primary font-serif text-sm">{formatCOP(aporte)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {disponible <= 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-card p-4">
          <p className="text-warning text-sm">⚠️ Este mes tus gastos y deudas superan tus ingresos. Enfócate en reducir gastos antes de ahorrar.</p>
        </div>
      )}
    </div>
  )
}

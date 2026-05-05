import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { calcularSaldoMes } from '@/utils/calculos.js'
import { getUltimosMeses, formatCOP } from '@/utils/formatters.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-elevated border border-border rounded-card px-3 py-2 text-xs">
      <p className="text-text-secondary mb-1">{label}</p>
      <p className="text-primary">↑ {formatCOP(payload[0]?.value ?? 0)}</p>
      <p className="text-destructive">↓ {formatCOP(payload[1]?.value ?? 0)}</p>
    </div>
  )
}

export default function MiniBarChart({ transacciones }) {
  const meses = getUltimosMeses(6)
  const data = meses.map(({ mes, año, label }) => {
    const { ingresos, gastos } = calcularSaldoMes(transacciones, mes, año)
    return { label, ingresos, gastos }
  })

  return (
    <div className="mx-5 mt-3 bg-surface rounded-card border border-border p-4">
      <p className="text-text-secondary text-xs font-medium mb-3">Últimos 6 meses</p>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} barSize={8} barGap={2}>
          <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="ingresos" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="gastos" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

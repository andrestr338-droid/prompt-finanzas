import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getUltimosMeses, formatCOP, getMesNombre } from '@/utils/formatters.js'
import { calcularSaldoMes } from '@/utils/calculos.js'

const COLORES_PIE = ['#10B981','#3B82F6','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316','#6366F1']

function TooltipCOP({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-elevated border border-border rounded-card px-3 py-2 text-xs">
      {label && <p className="text-text-secondary mb-1">{label}</p>}
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {formatCOP(p.value)}</p>)}
    </div>
  )
}

export default function GraficasReporte({ reporte, transacciones }) {
  const { gastosPorCategoria } = reporte
  const meses = getUltimosMeses(6)

  const pieData = Object.entries(gastosPorCategoria).map(([name, value]) => ({ name, value }))

  const barData = meses.map(({ mes, año, label }) => {
    const { ingresos, gastos } = calcularSaldoMes(transacciones, mes, año)
    return { label, ingresos, gastos }
  })

  const lineData = meses.map(({ mes, año, label }) => {
    const { saldo } = calcularSaldoMes(transacciones, mes, año)
    return { label, saldo }
  })

  return (
    <div className="flex flex-col gap-5">
      {pieData.length > 0 && (
        <div className="bg-surface rounded-card border border-border p-4">
          <p className="text-text-secondary text-xs font-medium mb-3">Gastos por categoría</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />)}
              </Pie>
              <Tooltip content={<TooltipCOP />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-surface rounded-card border border-border p-4">
        <p className="text-text-secondary text-xs font-medium mb-3">Ingresos vs Gastos (6 meses)</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={barData} barSize={10} barGap={2}>
            <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<TooltipCOP />} />
            <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" radius={[4,4,0,0]} />
            <Bar dataKey="gastos" name="Gastos" fill="#EF4444" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface rounded-card border border-border p-4">
        <p className="text-text-secondary text-xs font-medium mb-3">Saldo neto (6 meses)</p>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={lineData}>
            <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<TooltipCOP />} />
            <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

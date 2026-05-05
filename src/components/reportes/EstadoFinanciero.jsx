import { useState } from 'react'
import { generarTextoReporte } from '@/utils/reportes.js'
import { formatCOP } from '@/utils/formatters.js'

export default function EstadoFinanciero({ reporte }) {
  const [copiado, setCopiado] = useState(false)
  const { ingresos, gastos, saldoNeto, gastosPorCategoria, ingresosPorCategoria, cuotasDeudaMes, totalDeudas, deudas, metas } = reporte

  async function copiar() {
    const texto = generarTextoReporte(reporte)
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      alert('No se pudo copiar. Intenta desde Safari en iPhone.')
    }
  }

  const Linea = ({ label, monto, color = 'text-text-primary', prefijo = '' }) => (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-text-secondary text-sm">{prefijo}{label}</span>
      <span className={`font-serif text-sm ${color}`}>{formatCOP(monto)}</span>
    </div>
  )

  const Sep = () => <div className="border-t border-border my-1" />
  const Titulo = ({ children }) => <p className="text-text-disabled text-[10px] uppercase tracking-wider mt-4 mb-1">{children}</p>

  return (
    <div className="bg-surface rounded-card border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-text-primary font-semibold">Estado financiero</p>
        <button onClick={copiar}
          className={`text-xs font-medium px-3 py-1.5 rounded-chip transition-all ${copiado ? 'bg-primary text-white' : 'bg-elevated text-text-secondary border border-border'}`}>
          {copiado ? '✓ Copiado' : '📋 Copiar'}
        </button>
      </div>

      <Titulo>Ingresos</Titulo>
      {Object.entries(ingresosPorCategoria).map(([cat, val]) => (
        <Linea key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} monto={val} color="text-primary" />
      ))}
      <Sep />
      <Linea label="TOTAL INGRESOS" monto={ingresos} color="text-primary" />

      <Titulo>Gastos operativos</Titulo>
      {Object.entries(gastosPorCategoria).map(([cat, val]) => (
        <Linea key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} monto={val} color="text-destructive" />
      ))}
      <Sep />
      <Linea label="TOTAL GASTOS" monto={gastos} color="text-destructive" />

      {deudas.length > 0 && (
        <>
          <Titulo>Servicio de deuda</Titulo>
          {deudas.map(d => <Linea key={d.id} label={d.nombre} monto={d.cuotaMensual} />)}
          <Sep />
          <Linea label="TOTAL DEUDA MES" monto={cuotasDeudaMes} />
        </>
      )}

      <div className="mt-3 pt-3 border-t-2 border-border">
        <div className="flex justify-between items-center">
          <span className="text-text-primary font-semibold">SALDO NETO</span>
          <span className={`font-serif text-xl ${saldoNeto >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {saldoNeto >= 0 ? '' : '-'}{formatCOP(Math.abs(saldoNeto))}
            <span className="ml-1 text-base">{saldoNeto >= 0 ? '✅' : '⚠️'}</span>
          </span>
        </div>
      </div>

      {metas.length > 0 && (
        <>
          <Titulo>Metas</Titulo>
          {metas.map(m => {
            const pct = m.montoObjetivo > 0 ? Math.round((m.montoActual / m.montoObjetivo) * 100) : 0
            return (
              <div key={m.id} className="flex justify-between items-center py-1.5">
                <span className="text-text-secondary text-sm">{m.emoji} {m.nombre}</span>
                <span className="text-primary text-sm">{pct}%</span>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

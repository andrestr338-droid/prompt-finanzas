import { useState } from 'react'
import EstadoFinanciero from './EstadoFinanciero.jsx'
import GraficasReporte from './GraficasReporte.jsx'
import { generarReporte } from '@/utils/reportes.js'
import { getMesActual, getMesNombre } from '@/utils/formatters.js'

export default function Reportes({ transacciones, deudas, metas }) {
  const { mes: mesHoy, año: añoHoy } = getMesActual()
  const [mes, setMes] = useState(mesHoy)
  const [año, setAño] = useState(añoHoy)

  function cambiarMes(delta) {
    let m = mes + delta, a = año
    if (m < 0) { m = 11; a-- }
    if (m > 11) { m = 0; a++ }
    setMes(m); setAño(a)
  }

  const reporte = generarReporte(transacciones, deudas, metas, mes, año)

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-14 pb-4 bg-background">
        <h1 className="text-text-primary text-2xl font-semibold mb-4">Reportes</h1>
        <div className="flex items-center justify-between bg-surface rounded-card px-4 py-2">
          <button onClick={() => cambiarMes(-1)} className="text-text-secondary text-xl px-2 py-1 active:text-primary">‹</button>
          <span className="text-text-primary font-medium text-sm">{getMesNombre(mes)} {año}</span>
          <button onClick={() => cambiarMes(1)} className="text-text-secondary text-xl px-2 py-1 active:text-primary">›</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-safe">
        <div className="flex flex-col gap-4 pt-2">
          <EstadoFinanciero reporte={reporte} />
          <GraficasReporte reporte={reporte} transacciones={transacciones} />
        </div>
      </div>
    </div>
  )
}

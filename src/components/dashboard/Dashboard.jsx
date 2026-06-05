import { useState } from 'react'
import HeroCard from './HeroCard.jsx'
import ResumenChips from './ResumenChips.jsx'
import MiniBarChart from './MiniBarChart.jsx'
import Alertas from './Alertas.jsx'
import MisTarjetas from './MisTarjetas.jsx'
import { calcularSaldoMes } from '@/utils/calculos.js'
import { getMesActual } from '@/utils/formatters.js'

export default function Dashboard({ transacciones, deudas, metas, tarjetas, onAgregarTarjeta, onEliminarTarjeta }) {
  const actual = getMesActual()
  const [mes, setMes] = useState(actual.mes)
  const [año, setAño] = useState(actual.año)

  const { ingresos, gastos, saldo } = calcularSaldoMes(transacciones, mes, año)

  function irMesAnterior() {
    if (mes === 0) { setMes(11); setAño(a => a - 1) }
    else setMes(m => m - 1)
  }

  function irMesSiguiente() {
    const esMesActual = mes === actual.mes && año === actual.año
    if (esMesActual) return
    if (mes === 11) { setMes(0); setAño(a => a + 1) }
    else setMes(m => m + 1)
  }

  const esMesActual = mes === actual.mes && año === actual.año

  return (
    <div className="flex flex-col pb-safe">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-text-primary text-2xl font-semibold">Mi Finanzas</h1>
      </div>

      <HeroCard
        saldo={saldo}
        ingresos={ingresos}
        gastos={gastos}
        mes={mes}
        año={año}
        esMesActual={esMesActual}
        onPrevMes={irMesAnterior}
        onSigMes={irMesSiguiente}
      />
      <ResumenChips ingresos={ingresos} gastos={gastos} />
      <MiniBarChart transacciones={transacciones} />
      <Alertas ingresos={ingresos} gastos={gastos} deudas={deudas} metas={metas} />
      <MisTarjetas tarjetas={tarjetas} onAgregar={onAgregarTarjeta} onEliminar={onEliminarTarjeta} />

      <div className="h-4" />
    </div>
  )
}

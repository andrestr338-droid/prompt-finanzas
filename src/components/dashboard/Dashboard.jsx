import HeroCard from './HeroCard.jsx'
import ResumenChips from './ResumenChips.jsx'
import MiniBarChart from './MiniBarChart.jsx'
import Alertas from './Alertas.jsx'
import MisTarjetas from './MisTarjetas.jsx'
import { calcularSaldoMes } from '@/utils/calculos.js'
import { getMesActual } from '@/utils/formatters.js'

export default function Dashboard({ transacciones, deudas, metas, tarjetas, onAgregarTarjeta, onEliminarTarjeta }) {
  const { mes, año } = getMesActual()
  const { ingresos, gastos, saldo } = calcularSaldoMes(transacciones, mes, año)

  return (
    <div className="flex flex-col pb-safe">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-text-primary text-2xl font-semibold">Mi Finanzas</h1>
      </div>

      <HeroCard saldo={saldo} ingresos={ingresos} gastos={gastos} />
      <ResumenChips ingresos={ingresos} gastos={gastos} />
      <MiniBarChart transacciones={transacciones} />
      <Alertas ingresos={ingresos} gastos={gastos} deudas={deudas} metas={metas} />
      <MisTarjetas tarjetas={tarjetas} onAgregar={onAgregarTarjeta} onEliminar={onEliminarTarjeta} />

      <div className="h-4" />
    </div>
  )
}

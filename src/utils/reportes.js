import { calcularSaldoMes } from './calculos.js'
import { getMesNombre, formatCOP, isSameMonth } from './formatters.js'

export function generarReporte(transacciones, deudas, metas, mes, año) {
  const { ingresos, gastos, saldo, transacciones: delMes } = calcularSaldoMes(transacciones, mes, año)

  const gastosPorCategoria = {}
  delMes.filter(t => t.tipo === 'gasto').forEach(t => {
    gastosPorCategoria[t.categoria] = (gastosPorCategoria[t.categoria] || 0) + t.monto
  })

  const ingresosPorCategoria = {}
  delMes.filter(t => t.tipo === 'ingreso').forEach(t => {
    ingresosPorCategoria[t.categoria] = (ingresosPorCategoria[t.categoria] || 0) + t.monto
  })

  const cuotasDeudaMes = deudas.reduce((s, d) => s + d.cuotaMensual, 0)
  const totalDeudas = deudas.reduce((s, d) => s + d.saldoActual, 0)
  const saldoNeto = ingresos - gastos - cuotasDeudaMes

  return {
    mes, año,
    ingresos, gastos, saldo, saldoNeto,
    gastosPorCategoria, ingresosPorCategoria,
    cuotasDeudaMes, totalDeudas,
    deudas, metas,
  }
}

export function generarTextoReporte(reporte) {
  const { mes, año, ingresos, gastos, saldoNeto, gastosPorCategoria, ingresosPorCategoria, cuotasDeudaMes, totalDeudas, deudas, metas } = reporte
  const sep = '─'.repeat(34)
  const doble = '═'.repeat(34)

  const linea = (label, monto, prefijo = '') =>
    `  ${prefijo}${label.padEnd(22)} ${formatCOP(monto).padStart(12)}`

  let texto = `${doble}\n   REPORTE FINANCIERO PERSONAL\n        ${getMesNombre(mes)} — ${año}\n${doble}\n\n`

  texto += `INGRESOS\n`
  Object.entries(ingresosPorCategoria).forEach(([cat, val]) => {
    texto += linea(cat.charAt(0).toUpperCase() + cat.slice(1), val) + '\n'
  })
  texto += `  ${sep}\n${linea('TOTAL INGRESOS', ingresos)}\n\n`

  texto += `GASTOS OPERATIVOS\n`
  Object.entries(gastosPorCategoria).forEach(([cat, val]) => {
    texto += linea(cat.charAt(0).toUpperCase() + cat.slice(1), val) + '\n'
  })
  texto += `  ${sep}\n${linea('TOTAL GASTOS', gastos)}\n\n`

  texto += `SERVICIO DE DEUDA\n`
  deudas.forEach(d => { texto += linea(d.nombre, d.cuotaMensual) + '\n' })
  texto += `  ${sep}\n${linea('TOTAL DEUDA MES', cuotasDeudaMes)}\n\n`

  texto += `${doble}\nRESULTADO DEL MES\n`
  texto += linea('Ingresos', ingresos) + '\n'
  texto += linea('Gastos', gastos, '− ') + '\n'
  texto += linea('Deuda', cuotasDeudaMes, '− ') + '\n'
  texto += `  ${sep}\n`
  texto += linea('SALDO NETO', saldoNeto) + (saldoNeto >= 0 ? ' ✅' : ' ⚠️') + '\n'
  texto += `${doble}\n\n`

  texto += `ESTADO DE DEUDAS\n`
  texto += linea('Total adeudado', totalDeudas) + '\n'
  texto += linea('Cuota mensual', cuotasDeudaMes) + '\n\n'

  texto += `METAS\n`
  metas.forEach(m => {
    const pct = m.montoObjetivo > 0 ? Math.round((m.montoActual / m.montoObjetivo) * 100) : 0
    texto += `  ${m.emoji} ${m.nombre.padEnd(20)} ${pct}% completada\n`
  })
  texto += `${doble}\n`

  return texto
}

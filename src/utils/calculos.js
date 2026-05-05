import { isSameMonth } from './formatters.js'

export function calcularSaldoMes(transacciones, mes, año) {
  const delMes = transacciones.filter(t => isSameMonth(t.fecha, mes, año))
  const ingresos = delMes.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0)
  const gastos = delMes.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0)
  return { ingresos, gastos, saldo: ingresos - gastos, transacciones: delMes }
}

export function calcularPlanDeudas(deudas, estrategia, extraMensual = 0) {
  if (!deudas.length) return { orden: [], mesesTotal: 0, ahorroIntereses: 0, timeline: [] }

  const activas = deudas.filter(d => d.saldoActual > 0)
  if (!activas.length) return { orden: [], mesesTotal: 0, ahorroIntereses: 0, timeline: [] }

  const ordenadas = [...activas].sort((a, b) =>
    estrategia === 'nieve'
      ? a.saldoActual - b.saldoActual
      : b.tasaInteres - a.tasaInteres
  )

  // Simulación mes a mes
  let saldos = ordenadas.map(d => ({ ...d, saldo: d.saldoActual }))
  const timeline = []
  let mes = 0
  let totalInteresesPagados = 0

  while (saldos.some(d => d.saldo > 0) && mes < 360) {
    mes++
    let extraDisponible = extraMensual

    // Pagar cuota mínima + intereses a todas
    saldos = saldos.map(d => {
      if (d.saldo <= 0) return d
      const interesMes = Math.round(d.saldo * (d.tasaInteres / 100))
      totalInteresesPagados += interesMes
      const pago = Math.min(d.cuotaMensual, d.saldo + interesMes)
      return { ...d, saldo: Math.max(0, d.saldo + interesMes - pago) }
    })

    // Aplicar extra a la primera deuda con saldo > 0 (según estrategia)
    for (let i = 0; i < saldos.length && extraDisponible > 0; i++) {
      if (saldos[i].saldo > 0) {
        const aplicar = Math.min(extraDisponible, saldos[i].saldo)
        saldos[i] = { ...saldos[i], saldo: saldos[i].saldo - aplicar }
        extraDisponible -= aplicar
      }
    }

    timeline.push({
      mes,
      deudas: saldos.map(d => ({ nombre: d.nombre, saldo: d.saldo })),
    })
  }

  // Calcular cuándo se paga cada deuda
  const orden = ordenadas.map(d => {
    const mesPago = timeline.findIndex(t => {
      const deuda = t.deudas.find(x => x.nombre === d.nombre)
      return deuda && deuda.saldo === 0
    })
    return { ...d, mesPago: mesPago + 1 }
  })

  return { orden, mesesTotal: mes, totalInteresesPagados, timeline }
}

export function calcularMesesMeta(meta) {
  const faltante = meta.montoObjetivo - meta.montoActual
  if (faltante <= 0) return 0
  const aporteMensual = meta.frecuenciaAhorro === 'mensual'
    ? meta.aporteMensual
    : meta.frecuenciaAhorro === 'quincenal'
    ? meta.aporteMensual * 2
    : meta.aporteMensual * 4
  if (!aporteMensual) return null
  return Math.ceil(faltante / aporteMensual)
}

export function calcularPlanMetas(metas, ingresos, gastos, cuotasDeuda) {
  const disponible = Math.max(0, ingresos - gastos - cuotasDeuda)
  const metasOrdenadas = [...metas].sort((a, b) => a.prioridad - b.prioridad)

  let restante = disponible
  const distribucion = metasOrdenadas.map(m => {
    const faltante = m.montoObjetivo - m.montoActual
    if (faltante <= 0) return { meta: m, aporte: 0, completada: true }
    const aporte = Math.min(restante, Math.round(disponible * 0.3))
    restante = Math.max(0, restante - aporte)
    const mesesRestantes = aporte > 0 ? Math.ceil(faltante / aporte) : null
    return { meta: m, aporte, mesesRestantes }
  })

  return { distribucion, disponible, restante }
}

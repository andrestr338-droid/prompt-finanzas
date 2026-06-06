import { useState } from 'react'
import { getData, setData, KEYS } from '@/store/localStorage.js'

export function useGastosTarjeta() {
  const [gastos, setGastos] = useState(() => getData(KEYS.GASTOS_TARJETA) ?? [])

  function save(list) {
    setGastos(list)
    setData(KEYS.GASTOS_TARJETA, list)
  }

  function agregar(t) {
    save([{ id: crypto.randomUUID(), pagado: false, ...t }, ...gastos])
  }

  function eliminar(id) {
    save(gastos.filter(g => g.id !== id))
  }

  // Marca como pagados todos los items de una tarjeta en un mes/año
  function marcarPagado(tcId, mes, año) {
    save(gastos.map(g => {
      if (g.tcId === tcId && !g.pagado) {
        const [y, m] = g.fecha.split('-').map(Number)
        if (y === año && m - 1 === mes) return { ...g, pagado: true }
      }
      return g
    }))
  }

  return { gastos, agregar, eliminar, marcarPagado }
}

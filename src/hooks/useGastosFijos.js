import { useState } from 'react'
import { getData, setData, KEYS } from '@/store/localStorage.js'

export function useGastosFijos() {
  const [fijos, setFijos] = useState(() => getData(KEYS.GASTOS_FIJOS) ?? [])

  function save(list) {
    setFijos(list)
    setData(KEYS.GASTOS_FIJOS, list)
  }

  function agregar(f) {
    save([...fijos, { id: crypto.randomUUID(), pagos: [], ...f }])
  }

  function eliminar(id) {
    save(fijos.filter(f => f.id !== id))
  }

  function marcarPagado(id, mesKey) {
    save(fijos.map(f => f.id === id ? { ...f, pagos: [...(f.pagos ?? []), mesKey] } : f))
  }

  function desmarcar(id, mesKey) {
    save(fijos.map(f => f.id === id ? { ...f, pagos: (f.pagos ?? []).filter(p => p !== mesKey) } : f))
  }

  // Sync: agrega entrada de deuda si no existe, elimina si la deuda fue borrada
  function sincronizarConDeudas(deudas) {
    const fijosActuales = getData(KEYS.GASTOS_FIJOS) ?? []
    let cambios = false
    let lista = [...fijosActuales]

    // Agregar fijos para deudas nuevas
    deudas.forEach(d => {
      const yaExiste = lista.some(f => f.deudaId === d.id)
      if (!yaExiste && d.cuotaMensual > 0) {
        lista.push({
          id: crypto.randomUUID(),
          nombre: d.nombre,
          monto: d.cuotaMensual,
          categoria: 'deuda',
          tipo: 'deuda',
          deudaId: d.id,
          pagos: [],
        })
        cambios = true
      }
    })

    // Eliminar fijos de deudas que ya no existen
    const idsDeudas = deudas.map(d => d.id)
    const filtrada = lista.filter(f => !f.deudaId || idsDeudas.includes(f.deudaId))
    if (filtrada.length !== lista.length) { lista = filtrada; cambios = true }

    // Actualizar montos si cambiaron las cuotas
    lista = lista.map(f => {
      if (!f.deudaId) return f
      const deuda = deudas.find(d => d.id === f.deudaId)
      if (deuda && f.monto !== deuda.cuotaMensual) { cambios = true; return { ...f, monto: deuda.cuotaMensual, nombre: deuda.nombre } }
      return f
    })

    if (cambios) {
      setData(KEYS.GASTOS_FIJOS, lista)
      setFijos(lista)
    }
  }

  return { fijos, agregar, eliminar, marcarPagado, desmarcar, sincronizarConDeudas }
}

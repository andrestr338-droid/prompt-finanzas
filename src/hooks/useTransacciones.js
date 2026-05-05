import { useState } from 'react'
import { getData, setData, KEYS } from '@/store/localStorage.js'

export function useTransacciones() {
  const [transacciones, setT] = useState(() => getData(KEYS.TRANSACCIONES) ?? [])

  function save(list) {
    setT(list)
    setData(KEYS.TRANSACCIONES, list)
  }

  function agregar(t) {
    save([{ id: crypto.randomUUID(), ...t }, ...transacciones])
  }

  function eliminar(id) {
    save(transacciones.filter(t => t.id !== id))
  }

  function abonarAMeta(metaId, monto, fecha) {
    agregar({
      tipo: 'gasto',
      monto,
      categoria: 'otros',
      descripcion: `Aporte a meta`,
      fecha,
      metaId,
    })
  }

  return { transacciones, agregar, eliminar, abonarAMeta }
}

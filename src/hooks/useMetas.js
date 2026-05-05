import { useState } from 'react'
import { getData, setData, KEYS } from '@/store/localStorage.js'

export function useMetas() {
  const [metas, setM] = useState(() => getData(KEYS.METAS) ?? [])

  function save(list) {
    setM(list)
    setData(KEYS.METAS, list)
  }

  function agregar(m) {
    save([...metas, { id: crypto.randomUUID(), montoActual: 0, prioridad: metas.length + 1, ...m }])
  }

  function eliminar(id) {
    save(metas.filter(m => m.id !== id))
  }

  function actualizar(id, changes) {
    save(metas.map(m => m.id === id ? { ...m, ...changes } : m))
  }

  function abonar(id, monto) {
    save(metas.map(m => m.id === id ? { ...m, montoActual: Math.min(m.montoActual + monto, m.montoObjetivo) } : m))
  }

  return { metas, agregar, eliminar, actualizar, abonar }
}

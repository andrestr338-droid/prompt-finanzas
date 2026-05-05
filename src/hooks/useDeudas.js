import { useState } from 'react'
import { getData, setData, KEYS } from '@/store/localStorage.js'

export function useDeudas() {
  const [deudas, setD] = useState(() => getData(KEYS.DEUDAS) ?? [])

  function save(list) {
    setD(list)
    setData(KEYS.DEUDAS, list)
  }

  function agregar(d) {
    save([...deudas, { id: crypto.randomUUID(), ...d }])
  }

  function eliminar(id) {
    save(deudas.filter(d => d.id !== id))
  }

  function actualizar(id, changes) {
    save(deudas.map(d => d.id === id ? { ...d, ...changes } : d))
  }

  return { deudas, agregar, eliminar, actualizar }
}

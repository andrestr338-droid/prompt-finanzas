import { useState } from 'react'
import { getData, setData, KEYS } from '@/store/localStorage.js'

export function usePresupuesto() {
  const [limites, setL] = useState(() => getData(KEYS.PRESUPUESTO) ?? {})

  function save(next) {
    setL(next)
    setData(KEYS.PRESUPUESTO, next)
  }

  function setLimite(catId, monto) {
    save({ ...limites, [catId]: monto })
  }

  return { limites, setLimite }
}

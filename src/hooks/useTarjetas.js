import { useState } from 'react'
import { getData, setData, KEYS } from '@/store/localStorage.js'

export function useTarjetas() {
  const [tarjetas, setT] = useState(() => getData(KEYS.TARJETAS) ?? [])

  function save(list) { setT(list); setData(KEYS.TARJETAS, list) }

  function agregar(nombre) {
    if (!nombre.trim()) return
    save([...tarjetas, { id: crypto.randomUUID(), nombre: nombre.trim() }])
  }

  function eliminar(id) { save(tarjetas.filter(t => t.id !== id)) }

  return { tarjetas, agregar, eliminar }
}

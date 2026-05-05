import { useState } from 'react'
import { getData, setData, KEYS } from '@/store/localStorage.js'

const DEFAULT_CONFIG = {
  estrategiaDeuda: 'nieve',
  nombreUsuario: '',
  ingresoMensualRef: 0,
  onboardingCompleto: false,
}

export function useConfig() {
  const [config, setConfigState] = useState(() => ({
    ...DEFAULT_CONFIG,
    ...(getData(KEYS.CONFIG) ?? {}),
  }))

  function updateConfig(changes) {
    setConfigState(prev => {
      const next = { ...prev, ...changes }
      setData(KEYS.CONFIG, next)
      return next
    })
  }

  return { config, updateConfig }
}

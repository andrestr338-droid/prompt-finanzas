const KEYS = {
  TRANSACCIONES: 'fc_transacciones',
  DEUDAS: 'fc_deudas',
  METAS: 'fc_metas',
  CONFIG: 'fc_config',
  GASTOS_FIJOS: 'fc_gastos_fijos',
  TARJETAS: 'fc_tarjetas',
  PRESUPUESTO: 'fc_presupuesto',
}

export { KEYS }

export function getData(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('localStorage write failed', e)
  }
}

export function clearAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}

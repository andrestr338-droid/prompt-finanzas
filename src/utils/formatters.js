export function formatCOP(monto) {
  if (monto == null || isNaN(monto)) return '$ 0'
  const n = Math.round(Number(monto))
  return '$ ' + n.toLocaleString('es-CO')
}

export function formatCOPInput(raw) {
  const digits = String(raw).replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('es-CO')
}

export function parseCOP(str) {
  return parseInt(String(str).replace(/\D/g, '') || '0', 10)
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

export function getMesNombre(mes) {
  return MESES[mes] ?? ''
}

export function getHoy() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function formatFechaCorta(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  const fecha = new Date(y, m - 1, d)
  return `${DIAS[fecha.getDay()]} ${d} ${MESES[m - 1].slice(0, 3)}`
}

export function formatFechaLarga(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${y}`
}

export function getMesActual() {
  const d = new Date()
  return { mes: d.getMonth(), año: d.getFullYear() }
}

export function isSameMonth(isoDate, mes, año) {
  const [y, m] = isoDate.split('-').map(Number)
  return y === año && m - 1 === mes
}

export function getUltimosMeses(n = 6) {
  const result = []
  const hoy = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    result.push({ mes: d.getMonth(), año: d.getFullYear(), label: MESES[d.getMonth()].slice(0, 3) })
  }
  return result
}

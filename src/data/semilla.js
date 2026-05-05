import { getData, setData, KEYS } from '@/store/localStorage.js'

const hoy = new Date()
const f = (mesesAtras, dia) => {
  const d = new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, dia)
  return d.toISOString().slice(0, 10)
}

export const TRANSACCIONES_DEMO = [
  // Mes actual
  { id: '1', tipo: 'ingreso', monto: 4200000, categoria: 'salario', descripcion: 'Salario abril', fecha: f(0, 1), tipoIngreso: 'fijo', fuente: 'Empresa ABC' },
  { id: '2', tipo: 'ingreso', monto: 800000, categoria: 'freelance', descripcion: 'Proyecto diseño', fecha: f(0, 5), tipoIngreso: 'variable', fuente: 'Cliente Estudio XYZ' },
  { id: '3', tipo: 'gasto', monto: 950000, categoria: 'vivienda', descripcion: 'Arriendo', fecha: f(0, 3) },
  { id: '4', tipo: 'gasto', monto: 320000, categoria: 'comida', descripcion: 'Mercado', fecha: f(0, 7) },
  { id: '5', tipo: 'gasto', monto: 85000, categoria: 'transporte', descripcion: 'Gasolina', fecha: f(0, 9) },
  { id: '6', tipo: 'gasto', monto: 45000, categoria: 'entretenimiento', descripcion: 'Netflix + Spotify', fecha: f(0, 10) },
  { id: '7', tipo: 'gasto', monto: 180000, categoria: 'comida', descripcion: 'Restaurantes', fecha: f(0, 14) },
  { id: '8', tipo: 'gasto', monto: 120000, categoria: 'salud', descripcion: 'Consulta médica', fecha: f(0, 16) },
  { id: '9', tipo: 'gasto', monto: 75000, categoria: 'educacion', descripcion: 'Libro técnico', fecha: f(0, 18) },
  // Mes anterior
  { id: '10', tipo: 'ingreso', monto: 4200000, categoria: 'salario', descripcion: 'Salario marzo', fecha: f(1, 1), tipoIngreso: 'fijo', fuente: 'Empresa ABC' },
  { id: '11', tipo: 'ingreso', monto: 350000, categoria: 'regalo', descripcion: 'Regalo cumpleaños', fecha: f(1, 15), tipoIngreso: 'variable', fuente: 'Familia' },
  { id: '12', tipo: 'gasto', monto: 950000, categoria: 'vivienda', descripcion: 'Arriendo', fecha: f(1, 3) },
  { id: '13', tipo: 'gasto', monto: 298000, categoria: 'comida', descripcion: 'Mercado', fecha: f(1, 8) },
  { id: '14', tipo: 'gasto', monto: 90000, categoria: 'transporte', descripcion: 'Uber + gasolina', fecha: f(1, 11) },
  { id: '15', tipo: 'gasto', monto: 210000, categoria: 'ropa', descripcion: 'Ropa trabajo', fecha: f(1, 20) },
  { id: '16', tipo: 'gasto', monto: 55000, categoria: 'entretenimiento', descripcion: 'Cine + snacks', fecha: f(1, 22) },
  // Hace 2 meses
  { id: '17', tipo: 'ingreso', monto: 4200000, categoria: 'salario', descripcion: 'Salario febrero', fecha: f(2, 1), tipoIngreso: 'fijo', fuente: 'Empresa ABC' },
  { id: '18', tipo: 'ingreso', monto: 600000, categoria: 'freelance', descripcion: 'Landing page', fecha: f(2, 12), tipoIngreso: 'variable', fuente: 'Startup local' },
  { id: '19', tipo: 'gasto', monto: 950000, categoria: 'vivienda', descripcion: 'Arriendo', fecha: f(2, 3) },
  { id: '20', tipo: 'gasto', monto: 310000, categoria: 'comida', descripcion: 'Mercado + domicilios', fecha: f(2, 9) },
  { id: '21', tipo: 'gasto', monto: 95000, categoria: 'transporte', descripcion: 'Gasolina', fecha: f(2, 14) },
  { id: '22', tipo: 'gasto', monto: 145000, categoria: 'salud', descripcion: 'Medicamentos', fecha: f(2, 18) },
]

export const DEUDAS_DEMO = [
  {
    id: 'd1',
    nombre: 'Tarjeta Bancolombia',
    tipo: 'tarjeta',
    saldoTotal: 8500000,
    saldoActual: 5200000,
    tasaInteres: 2.8,
    cuotaMensual: 450000,
    fechaInicio: f(8, 1),
    notas: 'Pagar antes del día 15',
  },
  {
    id: 'd2',
    nombre: 'Crédito Libre Inversión',
    tipo: 'bancario',
    saldoTotal: 15000000,
    saldoActual: 11800000,
    tasaInteres: 1.6,
    cuotaMensual: 620000,
    fechaInicio: f(14, 1),
    notas: 'Davivienda, débito automático',
  },
]

export const METAS_DEMO = [
  {
    id: 'm1',
    nombre: 'Fondo de emergencia',
    emoji: '🛡️',
    montoObjetivo: 6000000,
    montoActual: 2400000,
    frecuenciaAhorro: 'mensual',
    aporteMensual: 300000,
    fechaLimite: null,
    prioridad: 1,
  },
  {
    id: 'm2',
    nombre: 'Viaje a Cartagena',
    emoji: '🏖️',
    montoObjetivo: 3500000,
    montoActual: 850000,
    frecuenciaAhorro: 'mensual',
    aporteMensual: 200000,
    fechaLimite: f(-6, 1),
    prioridad: 2,
  },
]

export function cargarSemilla() {
  const yaHayDatos = getData(KEYS.TRANSACCIONES)
  if (yaHayDatos && yaHayDatos.length > 0) return
  setData(KEYS.TRANSACCIONES, TRANSACCIONES_DEMO)
  setData(KEYS.DEUDAS, DEUDAS_DEMO)
  setData(KEYS.METAS, METAS_DEMO)
}

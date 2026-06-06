import { useState } from 'react'
import ListaTransacciones from './ListaTransacciones.jsx'
import ModalTransaccion from './ModalTransaccion.jsx'
import PresupuestoMes from './PresupuestoMes.jsx'
import GastosTarjeta from './GastosTarjeta.jsx'
import { usePresupuesto } from '@/hooks/usePresupuesto.js'
import { getMesActual, getMesNombre } from '@/utils/formatters.js'

const TABS = [
  { id: 'todo', label: 'Todo' },
  { id: 'gasto', label: 'Gastos' },
  { id: 'ingreso', label: 'Ingresos' },
  { id: 'tarjetas', label: '💳 Tarjetas' },
  { id: 'presupuesto', label: 'Presupuesto' },
]

export default function Transacciones({
  transacciones, tarjetas = [], gastosTarjeta = [],
  onAgregar, onEliminar, onEliminarGastoTarjeta, onPagarTarjeta,
}) {
  const { mes: mesHoy, año: añoHoy } = getMesActual()
  const [tab, setTab] = useState('todo')
  const [mes, setMes] = useState(mesHoy)
  const [año, setAño] = useState(añoHoy)
  const [modal, setModal] = useState(false)
  const [tipoModal, setTipoModal] = useState('gasto')
  const { limites, setLimite } = usePresupuesto()

  function abrirModal(tipo = 'gasto') {
    setTipoModal(tipo)
    setModal(true)
  }

  function cambiarMes(delta) {
    let m = mes + delta
    let a = año
    if (m < 0) { m = 11; a-- }
    if (m > 11) { m = 0; a++ }
    setMes(m)
    setAño(a)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-background">
        <h1 className="text-text-primary text-2xl font-semibold mb-4">Movimientos</h1>

        {/* Selector de mes */}
        <div className="flex items-center justify-between mb-4 bg-surface rounded-card px-4 py-2">
          <button onClick={() => cambiarMes(-1)} className="text-text-secondary text-xl px-2 py-1 active:text-primary">‹</button>
          <span className="text-text-primary font-medium text-sm">{getMesNombre(mes)} {año}</span>
          <button onClick={() => cambiarMes(1)} className="text-text-secondary text-xl px-2 py-1 active:text-primary">›</button>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-chip text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-primary text-white' : 'bg-surface text-text-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-safe">
        {tab === 'tarjetas' ? (
          <GastosTarjeta
            gastos={gastosTarjeta}
            mes={mes}
            año={año}
            onPagarTarjeta={onPagarTarjeta}
            onEliminar={onEliminarGastoTarjeta}
          />
        ) : tab === 'presupuesto' ? (
          <PresupuestoMes
            transacciones={transacciones}
            mes={mes}
            año={año}
            limites={limites}
            setLimite={setLimite}
          />
        ) : (
          <ListaTransacciones
            transacciones={transacciones}
            filtroTipo={tab}
            mes={mes}
            año={año}
            onEliminar={onEliminar}
            onAgregar={() => abrirModal('gasto')}
          />
        )}
      </div>

      <ModalTransaccion
        isOpen={modal}
        onClose={() => setModal(false)}
        onGuardar={onAgregar}
        tipoInicial={tipoModal}
        tarjetas={tarjetas}
      />
    </div>
  )
}

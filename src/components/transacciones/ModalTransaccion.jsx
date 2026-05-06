import { useState, useEffect } from 'react'
import BottomSheet from '@/components/ui/BottomSheet.jsx'
import { formatCOPInput, parseCOP, getHoy } from '@/utils/formatters.js'

const CATS_GASTO = [
  { id: 'comida', emoji: '🍔', label: 'Comida' },
  { id: 'transporte', emoji: '🚗', label: 'Transporte' },
  { id: 'vivienda', emoji: '🏠', label: 'Vivienda' },
  { id: 'salud', emoji: '💊', label: 'Salud' },
  { id: 'entretenimiento', emoji: '🎮', label: 'Ocio' },
  { id: 'ropa', emoji: '👕', label: 'Ropa' },
  { id: 'educacion', emoji: '📚', label: 'Educación' },
  { id: 'deuda', emoji: '💳', label: 'Deuda' },
  { id: 'otros', emoji: '📦', label: 'Otros' },
]

const CATS_INGRESO = [
  { id: 'salario', emoji: '💼', label: 'Salario' },
  { id: 'freelance', emoji: '🔧', label: 'Freelance' },
  { id: 'regalo', emoji: '🎁', label: 'Regalo' },
  { id: 'inversion', emoji: '📈', label: 'Inversión' },
  { id: 'otro_ingreso', emoji: '🏦', label: 'Otro' },
]

const INIT = {
  tipo: 'gasto', montoStr: '', categoria: '', descripcion: '',
  fecha: getHoy(), tipoIngreso: 'fijo', fuente: '',
  metodoPago: 'efectivo', tcId: null, tcNombre: null,
}

export default function ModalTransaccion({ isOpen, onClose, onGuardar, tipoInicial, tarjetas = [] }) {
  const [form, setForm] = useState(INIT)

  useEffect(() => {
    if (isOpen) setForm({ ...INIT, tipo: tipoInicial ?? 'gasto', fecha: getHoy() })
  }, [isOpen, tipoInicial])

  const cats = form.tipo === 'gasto' ? CATS_GASTO : CATS_INGRESO

  function set(field, val) { setForm(p => ({ ...p, [field]: val })) }

  function handleMonto(e) {
    const raw = e.target.value.replace(/\D/g, '')
    set('montoStr', raw ? formatCOPInput(raw) : '')
  }

  function handleTipo(tipo) {
    setForm(p => ({ ...p, tipo, categoria: '', metodoPago: 'efectivo', tcId: null, tcNombre: null }))
  }

  function handleMetodoPago(metodo) {
    setForm(p => ({ ...p, metodoPago: metodo, tcId: null, tcNombre: null }))
  }

  function handleTC(tc) {
    setForm(p => ({ ...p, tcId: tc.id, tcNombre: tc.nombre }))
  }

  function guardar() {
    const monto = parseCOP(form.montoStr)
    if (!monto || !form.categoria) return
    if (form.tipo === 'gasto' && form.metodoPago === 'tc' && !form.tcId) return
    onGuardar({
      tipo: form.tipo,
      monto,
      categoria: form.categoria,
      descripcion: form.descripcion,
      fecha: form.fecha,
      tipoIngreso: form.tipo === 'ingreso' ? form.tipoIngreso : null,
      fuente: form.tipo === 'ingreso' ? form.fuente : null,
      metodoPago: form.tipo === 'gasto' ? form.metodoPago : 'efectivo',
      tcId: form.tipo === 'gasto' ? form.tcId : null,
      tcNombre: form.tipo === 'gasto' ? form.tcNombre : null,
    })
    onClose()
  }

  const tcSeleccionada = form.metodoPago === 'tc' && !form.tcId
  const valido = parseCOP(form.montoStr) > 0 && form.categoria && !tcSeleccionada

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Nueva transacción">
      {/* Toggle tipo */}
      <div className="flex rounded-card bg-surface p-1 mb-5">
        {['gasto', 'ingreso'].map(t => (
          <button key={t} onClick={() => handleTipo(t)}
            className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-colors capitalize ${
              form.tipo === t
                ? t === 'gasto' ? 'bg-destructive text-white' : 'bg-primary text-white'
                : 'text-text-secondary'
            }`}>
            {t === 'gasto' ? '💸 Gasto' : '💰 Ingreso'}
          </button>
        ))}
      </div>

      {/* Método de pago — solo para gastos */}
      {form.tipo === 'gasto' && (
        <div className="mb-5">
          <label className="text-text-secondary text-xs mb-2 block">¿Cómo pagaste?</label>
          <div className="flex gap-2 mb-3">
            <button onClick={() => handleMetodoPago('efectivo')}
              className={`flex-1 py-3 rounded-card border text-sm font-medium transition-colors ${form.metodoPago === 'efectivo' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-secondary'}`}>
              💵 Efectivo / Débito
            </button>
            <button onClick={() => handleMetodoPago('tc')}
              className={`flex-1 py-3 rounded-card border text-sm font-medium transition-colors ${form.metodoPago === 'tc' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-secondary'}`}>
              💳 Tarjeta crédito
            </button>
          </div>

          {/* Selector de TC */}
          {form.metodoPago === 'tc' && (
            <div>
              {tarjetas.length === 0 ? (
                <div className="bg-warning/10 border border-warning/30 rounded-card p-3">
                  <p className="text-warning text-xs text-center">
                    Aún no tienes tarjetas guardadas. Ve a Inicio → Mis tarjetas para agregarlas.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {tarjetas.map(tc => (
                    <button key={tc.id} onClick={() => handleTC(tc)}
                      className={`flex items-center gap-3 p-3 rounded-card border transition-colors ${form.tcId === tc.id ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}>
                      <span className="text-xl">💳</span>
                      <span className={`text-sm font-medium flex-1 text-left ${form.tcId === tc.id ? 'text-primary' : 'text-text-primary'}`}>
                        {tc.nombre}
                      </span>
                      {form.tcId === tc.id && <span className="text-primary text-sm">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Monto */}
      <div className="mb-5">
        <label className="text-text-secondary text-xs mb-2 block">Monto</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-serif text-xl">$</span>
          <input type="tel" inputMode="numeric" placeholder="0" value={form.montoStr} onChange={handleMonto}
            className="w-full bg-surface border border-border rounded-card pl-10 pr-4 py-4 text-text-primary font-serif text-2xl focus:outline-none focus:border-primary transition-colors" />
        </div>
      </div>

      {/* Categoría */}
      <div className="mb-5">
        <label className="text-text-secondary text-xs mb-2 block">Categoría</label>
        <div className="grid grid-cols-3 gap-2">
          {cats.map(c => (
            <button key={c.id} onClick={() => set('categoria', c.id)}
              className={`flex flex-col items-center gap-1 py-3 rounded-card border transition-colors ${
                form.categoria === c.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-secondary'
              }`}>
              <span className="text-xl">{c.emoji}</span>
              <span className="text-[11px] font-medium">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label className="text-text-secondary text-xs mb-2 block">Descripción (opcional)</label>
        <input type="text" placeholder="Ej: Mercado semanal" value={form.descripcion}
          onChange={e => set('descripcion', e.target.value)}
          className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary transition-colors" />
      </div>

      {/* Fecha */}
      <div className="mb-4">
        <label className="text-text-secondary text-xs mb-2 block">Fecha</label>
        <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)}
          className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary transition-colors" />
      </div>

      {/* Campos extra para ingresos */}
      {form.tipo === 'ingreso' && (
        <>
          <div className="mb-4">
            <label className="text-text-secondary text-xs mb-2 block">Tipo de ingreso</label>
            <div className="flex gap-2">
              {['fijo', 'variable'].map(t => (
                <button key={t} onClick={() => set('tipoIngreso', t)}
                  className={`flex-1 py-3 rounded-card border text-sm font-medium transition-colors capitalize ${form.tipoIngreso === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-secondary'}`}>
                  {t === 'fijo' ? '📅 Fijo' : '📊 Variable'}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-text-secondary text-xs mb-2 block">Fuente (opcional)</label>
            <input type="text" placeholder="Ej: Empresa XYZ, Cliente ABC" value={form.fuente}
              onChange={e => set('fuente', e.target.value)}
              className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary transition-colors" />
          </div>
        </>
      )}

      <button onClick={guardar} disabled={!valido}
        className="w-full py-4 rounded-card bg-primary text-white font-semibold text-base mt-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all">
        Guardar
      </button>
    </BottomSheet>
  )
}

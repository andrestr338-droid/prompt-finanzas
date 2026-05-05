import { useState, useEffect } from 'react'
import BottomSheet from '@/components/ui/BottomSheet.jsx'
import { formatCOPInput, parseCOP, getHoy } from '@/utils/formatters.js'

const TIPOS = [
  { id: 'tarjeta', emoji: '💳', label: 'Tarjeta' },
  { id: 'bancario', emoji: '🏦', label: 'Crédito bancario' },
  { id: 'personal', emoji: '👤', label: 'Préstamo personal' },
  { id: 'hipotecario', emoji: '🏠', label: 'Hipotecario' },
  { id: 'vehiculo', emoji: '🚗', label: 'Vehículo' },
  { id: 'otro', emoji: '📦', label: 'Otro' },
]

const INIT = { nombre: '', tipo: '', saldoTotal: '', saldoActual: '', tasaInteres: '', cuotaMensual: '', fechaInicio: getHoy(), notas: '' }

export default function ModalDeuda({ isOpen, onClose, onGuardar }) {
  const [form, setForm] = useState(INIT)

  useEffect(() => { if (isOpen) setForm({ ...INIT, fechaInicio: getHoy() }) }, [isOpen])

  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  function handleMonto(field) {
    return (e) => {
      const raw = e.target.value.replace(/\D/g, '')
      set(field, raw ? formatCOPInput(raw) : '')
    }
  }

  function guardar() {
    if (!form.nombre || !form.tipo || !parseCOP(form.saldoActual)) return
    onGuardar({
      nombre: form.nombre,
      tipo: form.tipo,
      saldoTotal: parseCOP(form.saldoTotal) || parseCOP(form.saldoActual),
      saldoActual: parseCOP(form.saldoActual),
      tasaInteres: parseFloat(form.tasaInteres) || 0,
      cuotaMensual: parseCOP(form.cuotaMensual),
      fechaInicio: form.fechaInicio,
      notas: form.notas,
    })
    onClose()
  }

  const valido = form.nombre && form.tipo && parseCOP(form.saldoActual) > 0

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Agregar deuda">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-text-secondary text-xs mb-2 block">Nombre</label>
          <input
            type="text" placeholder="Ej: Tarjeta Bancolombia" value={form.nombre}
            onChange={e => set('nombre', e.target.value)}
            className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Tipo de deuda</label>
          <div className="grid grid-cols-3 gap-2">
            {TIPOS.map(t => (
              <button key={t.id} onClick={() => set('tipo', t.id)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-card border text-xs transition-colors ${form.tipo === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-secondary'}`}>
                <span className="text-lg">{t.emoji}</span>{t.label}
              </button>
            ))}
          </div>
        </div>

        {[
          { field: 'saldoActual', label: 'Saldo actual pendiente', ph: '0' },
          { field: 'saldoTotal', label: 'Saldo original (opcional)', ph: '0' },
          { field: 'cuotaMensual', label: 'Cuota mensual', ph: '0' },
        ].map(({ field, label, ph }) => (
          <div key={field}>
            <label className="text-text-secondary text-xs mb-2 block">{label}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-serif">$</span>
              <input type="tel" inputMode="numeric" placeholder={ph} value={form[field]} onChange={handleMonto(field)}
                className="w-full bg-surface border border-border rounded-card pl-9 pr-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary font-serif" />
            </div>
          </div>
        ))}

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Tasa de interés mensual (%)</label>
          <input type="number" step="0.1" placeholder="2.5" value={form.tasaInteres} onChange={e => set('tasaInteres', e.target.value)}
            className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Fecha de inicio</label>
          <input type="date" value={form.fechaInicio} onChange={e => set('fechaInicio', e.target.value)}
            className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Notas (opcional)</label>
          <input type="text" placeholder="Ej: Pagar antes del día 15" value={form.notas} onChange={e => set('notas', e.target.value)}
            className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary" />
        </div>

        <button onClick={guardar} disabled={!valido}
          className="w-full py-4 rounded-card bg-primary text-white font-semibold text-base disabled:opacity-40 active:scale-95 transition-all">
          Guardar deuda
        </button>
      </div>
    </BottomSheet>
  )
}

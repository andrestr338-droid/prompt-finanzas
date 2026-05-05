import { useState, useEffect } from 'react'
import BottomSheet from '@/components/ui/BottomSheet.jsx'
import { formatCOPInput, parseCOP } from '@/utils/formatters.js'

const EMOJIS_SUGERIDOS = ['🎯','✈️','🏖️','🚗','🏠','💻','🎓','💍','🛡️','📱','🎸','🏋️']
const INIT = { nombre: '', emoji: '🎯', montoObjetivo: '', montoActual: '', frecuenciaAhorro: 'mensual', aporteMensual: '', fechaLimite: '' }

export default function ModalMeta({ isOpen, onClose, onGuardar }) {
  const [form, setForm] = useState(INIT)

  useEffect(() => { if (isOpen) setForm(INIT) }, [isOpen])
  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  function handleMonto(field) {
    return e => { const r = e.target.value.replace(/\D/g, ''); set(field, r ? formatCOPInput(r) : '') }
  }

  function guardar() {
    if (!form.nombre || !parseCOP(form.montoObjetivo)) return
    onGuardar({
      nombre: form.nombre,
      emoji: form.emoji,
      montoObjetivo: parseCOP(form.montoObjetivo),
      montoActual: parseCOP(form.montoActual) || 0,
      frecuenciaAhorro: form.frecuenciaAhorro,
      aporteMensual: parseCOP(form.aporteMensual) || 0,
      fechaLimite: form.fechaLimite || null,
    })
    onClose()
  }

  const valido = form.nombre && parseCOP(form.montoObjetivo) > 0

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Nueva meta">
      <div className="flex flex-col gap-4">
        {/* Emoji selector */}
        <div>
          <label className="text-text-secondary text-xs mb-2 block">Ícono</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS_SUGERIDOS.map(e => (
              <button key={e} onClick={() => set('emoji', e)}
                className={`w-10 h-10 rounded-card text-xl flex items-center justify-center transition-colors ${form.emoji === e ? 'bg-primary/20 border border-primary' : 'bg-surface border border-border'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Nombre de la meta</label>
          <input type="text" placeholder="Ej: Viaje a Cartagena" value={form.nombre} onChange={e => set('nombre', e.target.value)}
            className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary" />
        </div>

        {[
          { field: 'montoObjetivo', label: 'Monto objetivo', ph: '0' },
          { field: 'montoActual', label: 'Ya tengo ahorrado (opcional)', ph: '0' },
          { field: 'aporteMensual', label: 'Aporte mensual planeado', ph: '0' },
        ].map(({ field, label, ph }) => (
          <div key={field}>
            <label className="text-text-secondary text-xs mb-2 block">{label}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-serif">$</span>
              <input type="tel" inputMode="numeric" placeholder={ph} value={form[field]} onChange={handleMonto(field)}
                className="w-full bg-surface border border-border rounded-card pl-9 pr-4 py-3 text-text-primary font-serif text-base focus:outline-none focus:border-primary" />
            </div>
          </div>
        ))}

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Frecuencia de aporte</label>
          <div className="flex gap-2">
            {[['mensual','📅 Mensual'],['quincenal','🗓 Quincenal'],['semanal','📆 Semanal']].map(([id, label]) => (
              <button key={id} onClick={() => set('frecuenciaAhorro', id)}
                className={`flex-1 py-2.5 rounded-card border text-xs font-medium transition-colors ${form.frecuenciaAhorro === id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-secondary'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Fecha límite (opcional)</label>
          <input type="date" value={form.fechaLimite} onChange={e => set('fechaLimite', e.target.value)}
            className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary" />
        </div>

        <button onClick={guardar} disabled={!valido}
          className="w-full py-4 rounded-card bg-primary text-white font-semibold text-base disabled:opacity-40 active:scale-95 transition-all">
          Crear meta
        </button>
      </div>
    </BottomSheet>
  )
}

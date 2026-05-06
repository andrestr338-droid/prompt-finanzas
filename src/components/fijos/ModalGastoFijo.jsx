import { useState, useEffect } from 'react'
import BottomSheet from '@/components/ui/BottomSheet.jsx'
import { formatCOPInput, parseCOP } from '@/utils/formatters.js'

const CATS = [
  { id: 'vivienda', emoji: '🏠', label: 'Vivienda' },
  { id: 'servicios', emoji: '💡', label: 'Servicios' },
  { id: 'transporte', emoji: '🚗', label: 'Transporte' },
  { id: 'salud', emoji: '💊', label: 'Salud' },
  { id: 'educacion', emoji: '📚', label: 'Educación' },
  { id: 'entretenimiento', emoji: '🎮', label: 'Suscripciones' },
  { id: 'comida', emoji: '🍔', label: 'Comida' },
  { id: 'otros', emoji: '📦', label: 'Otros' },
]

const INIT = { nombre: '', monto: '', categoria: 'otros' }

export default function ModalGastoFijo({ isOpen, onClose, onGuardar }) {
  const [form, setForm] = useState(INIT)

  useEffect(() => { if (isOpen) setForm(INIT) }, [isOpen])

  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  function guardar() {
    if (!form.nombre || !parseCOP(form.monto)) return
    onGuardar({ nombre: form.nombre, monto: parseCOP(form.monto), categoria: form.categoria, tipo: 'manual', deudaId: null })
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Nuevo gasto fijo">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-text-secondary text-xs mb-2 block">Nombre</label>
          <input type="text" placeholder="Ej: Arriendo, Netflix, Gym..." value={form.nombre}
            onChange={e => set('nombre', e.target.value)}
            className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-base focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Monto mensual</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-serif text-xl">$</span>
            <input type="tel" inputMode="numeric" placeholder="0" value={form.monto}
              onChange={e => { const r = e.target.value.replace(/\D/g, ''); set('monto', r ? formatCOPInput(r) : '') }}
              className="w-full bg-surface border border-border rounded-card pl-10 pr-4 py-3 text-text-primary font-serif text-xl focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="text-text-secondary text-xs mb-2 block">Categoría</label>
          <div className="grid grid-cols-4 gap-2">
            {CATS.map(c => (
              <button key={c.id} onClick={() => set('categoria', c.id)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-card border text-[11px] transition-colors ${form.categoria === c.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-secondary'}`}>
                <span className="text-lg">{c.emoji}</span>{c.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={guardar} disabled={!form.nombre || !parseCOP(form.monto)}
          className="w-full py-4 rounded-card bg-primary text-white font-semibold text-base disabled:opacity-40 active:scale-95 transition-all">
          Agregar
        </button>
      </div>
    </BottomSheet>
  )
}

import { useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet.jsx'

export default function FAB({ onAgregarGasto, onAgregarIngreso, onAbonarMeta }) {
  const [open, setOpen] = useState(false)

  const opciones = [
    { icono: '💸', label: 'Agregar gasto', color: 'text-destructive', accion: onAgregarGasto },
    { icono: '💰', label: 'Agregar ingreso', color: 'text-primary', accion: onAgregarIngreso },
    { icono: '🎯', label: 'Abonar a meta', color: 'text-info', accion: onAbonarMeta },
  ]

  function handle(accion) {
    setOpen(false)
    setTimeout(accion, 50)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-2xl text-white active:scale-90 transition-transform"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Agregar"
      >
        +
      </button>

      <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="¿Qué quieres registrar?">
        <div className="flex flex-col gap-3 py-2">
          {opciones.map(op => (
            <button
              key={op.label}
              onClick={() => handle(op.accion)}
              className="flex items-center gap-4 p-4 rounded-card bg-surface active:bg-border transition-colors text-left"
            >
              <span className="text-2xl">{op.icono}</span>
              <span className={`font-medium text-base ${op.color}`}>{op.label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}

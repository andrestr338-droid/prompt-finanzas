import { useState } from 'react'
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx'

export default function MisTarjetas({ tarjetas, onAgregar, onEliminar }) {
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState(null)
  const [abierto, setAbierto] = useState(false)

  function guardar() {
    if (!nueva.trim()) return
    onAgregar(nueva)
    setNueva('')
  }

  return (
    <div className="mx-5 mt-3 bg-surface rounded-card border border-border">
      {/* Header colapsable */}
      <button onClick={() => setAbierto(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💳</span>
          <span className="text-text-primary text-sm font-medium">Mis tarjetas de crédito</span>
          {tarjetas.length > 0 && (
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-chip">{tarjetas.length}</span>
          )}
        </div>
        <span className="text-text-disabled text-sm">{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <div className="px-4 pb-4 border-t border-border">
          {/* Lista de tarjetas */}
          {tarjetas.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 mb-3">
              {tarjetas.map(tc => (
                <div key={tc.id} className="flex items-center gap-3 bg-elevated rounded-card px-3 py-2.5">
                  <span className="text-base">💳</span>
                  <span className="text-text-primary text-sm flex-1">{tc.nombre}</span>
                  <button onClick={() => setConfirmar(tc)} className="text-text-disabled active:text-destructive text-sm p-1">🗑</button>
                </div>
              ))}
            </div>
          )}

          {/* Agregar nueva */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Ej: Visa Bancolombia, Mastercard Falabella..."
              value={nueva}
              onChange={e => setNueva(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && guardar()}
              className="flex-1 bg-elevated border border-border rounded-card px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary"
            />
            <button onClick={guardar} disabled={!nueva.trim()}
              className="bg-primary text-white px-4 py-2.5 rounded-card text-sm font-medium disabled:opacity-40 active:scale-95 transition-all">
              + Agregar
            </button>
          </div>
          {tarjetas.length === 0 && (
            <p className="text-text-disabled text-xs mt-2">Agrega tus tarjetas aquí para seleccionarlas al registrar gastos.</p>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmar}
        onConfirm={() => { onEliminar(confirmar.id); setConfirmar(null) }}
        onCancel={() => setConfirmar(null)}
        mensaje={confirmar ? `¿Eliminar la tarjeta "${confirmar.nombre}"?` : ''}
      />
    </div>
  )
}

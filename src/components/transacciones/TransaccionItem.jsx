import { useState } from 'react'
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx'
import { formatCOP } from '@/utils/formatters.js'

const EMOJIS = {
  comida:'🍔', transporte:'🚗', vivienda:'🏠', salud:'💊', entretenimiento:'🎮',
  ropa:'👕', educacion:'📚', deuda:'💳', otros:'📦',
  salario:'💼', freelance:'🔧', regalo:'🎁', inversion:'📈', otro_ingreso:'🏦',
}

export default function TransaccionItem({ transaccion, onEliminar }) {
  const [confirmar, setConfirmar] = useState(false)
  const { tipo, monto, categoria, descripcion } = transaccion
  const esIngreso = tipo === 'ingreso'

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-4 bg-surface rounded-card border border-border">
        <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center text-lg flex-shrink-0">
          {EMOJIS[categoria] ?? '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-medium truncate">
            {descripcion || categoria}
          </p>
          <p className="text-text-disabled text-xs capitalize">{categoria}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-serif text-base font-normal ${esIngreso ? 'text-primary' : 'text-destructive'}`}>
            {esIngreso ? '+' : '-'}{formatCOP(monto)}
          </span>
          <button
            onClick={() => setConfirmar(true)}
            className="w-8 h-8 flex items-center justify-center text-text-disabled active:text-destructive transition-colors"
          >
            🗑
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmar}
        onConfirm={() => { setConfirmar(false); onEliminar(transaccion.id) }}
        onCancel={() => setConfirmar(false)}
        mensaje="¿Eliminar esta transacción?"
      />
    </>
  )
}

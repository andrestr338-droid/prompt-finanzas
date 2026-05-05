import BottomSheet from './BottomSheet.jsx'

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, mensaje = '¿Estás seguro de eliminar esto?' }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onCancel}>
      <div className="py-2">
        <p className="text-text-primary text-center text-base mb-6">{mensaje}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 rounded-card bg-destructive text-white font-semibold text-base active:scale-95 transition-transform"
          >
            Eliminar
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 rounded-card bg-surface text-text-secondary font-medium text-base active:scale-95 transition-transform"
          >
            Cancelar
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}

export default function EmptyState({ icono = '📭', titulo, descripcion, accion }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="text-5xl mb-4">{icono}</div>
      <h3 className="text-text-primary font-semibold text-lg mb-2">{titulo}</h3>
      {descripcion && <p className="text-text-secondary text-sm leading-relaxed mb-6">{descripcion}</p>}
      {accion && (
        <button
          onClick={accion.onClick}
          className="bg-primary text-white font-medium px-6 py-3 rounded-chip text-sm active:scale-95 transition-transform"
        >
          {accion.label}
        </button>
      )}
    </div>
  )
}

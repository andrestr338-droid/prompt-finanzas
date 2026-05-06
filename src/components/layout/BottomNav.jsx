const TABS = [
  { id: 'dashboard', label: 'Inicio', icono: '🏠' },
  { id: 'fijos', label: 'Fijos', icono: '📋' },
  { id: 'transacciones', label: 'Gastos', icono: '💸' },
  { id: 'deudas', label: 'Deudas', icono: '💳' },
  { id: 'metas', label: 'Metas', icono: '🎯' },
  { id: 'reportes', label: 'Reportes', icono: '📊' },
]

export default function BottomNav({ tabActiva, onCambiar }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border safe-bottom">
      <div className="flex">
        {TABS.map(tab => {
          const activa = tabActiva === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onCambiar(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors ${
                activa ? 'text-primary' : 'text-text-disabled'
              }`}
            >
              <span className="text-lg leading-none mb-0.5">{tab.icono}</span>
              <span className={`text-[9px] font-medium leading-none ${activa ? 'text-primary' : 'text-text-disabled'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

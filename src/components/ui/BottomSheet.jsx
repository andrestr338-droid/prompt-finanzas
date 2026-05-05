import { useEffect } from 'react'

export default function BottomSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative bg-elevated rounded-t-modal border border-border border-b-0 animate-slide-up max-h-[92vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        {title && (
          <div className="px-5 pb-3 flex-shrink-0">
            <h2 className="text-lg font-semibold text-text-primary font-sans">{title}</h2>
          </div>
        )}
        <div className="overflow-y-auto flex-1 px-5 pb-8 safe-bottom">
          {children}
        </div>
      </div>
    </div>
  )
}

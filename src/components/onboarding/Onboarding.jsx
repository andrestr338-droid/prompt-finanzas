import { useState } from 'react'
import { formatCOPInput, parseCOP } from '@/utils/formatters.js'

export default function Onboarding({ onCompletar }) {
  const [paso, setPaso] = useState(0)
  const [nombre, setNombre] = useState('')
  const [ingresoStr, setIngresoStr] = useState('')
  const [tieneDeudas, setTieneDeudas] = useState(null)
  const [tieneMetas, setTieneMetas] = useState(null)

  function siguiente() { setPaso(p => p + 1) }

  function finalizar() {
    onCompletar({
      nombreUsuario: nombre || 'Amigo',
      ingresoMensualRef: parseCOP(ingresoStr),
    })
  }

  const pasos = [
    // Paso 0: Bienvenida
    <div key={0} className="flex flex-col items-center text-center px-8 py-12">
      <div className="text-7xl mb-6">💚</div>
      <h1 className="text-text-primary text-3xl font-semibold mb-3">Bienvenido a FinanzasCOP</h1>
      <p className="text-text-secondary text-base leading-relaxed mb-2">Tu app de finanzas personales. Simple, rápida, sin internet.</p>
      <p className="text-text-secondary text-sm mb-8">¿Cómo te llamas?</p>
      <input
        type="text" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)}
        className="w-full bg-surface border border-border rounded-card px-4 py-3 text-text-primary text-lg text-center focus:outline-none focus:border-primary mb-6"
      />
      <button onClick={siguiente} className="w-full py-4 rounded-card bg-primary text-white font-semibold text-base active:scale-95 transition-transform">
        Empezar →
      </button>
    </div>,

    // Paso 1: Ingreso mensual
    <div key={1} className="flex flex-col px-8 py-12">
      <div className="text-5xl mb-6 text-center">💰</div>
      <h2 className="text-text-primary text-2xl font-semibold text-center mb-2">Hola{nombre ? `, ${nombre}` : ''}!</h2>
      <p className="text-text-secondary text-base text-center mb-8">¿Cuánto ganas aproximadamente al mes?</p>
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-serif text-2xl">$</span>
        <input type="tel" inputMode="numeric" placeholder="0" value={ingresoStr}
          onChange={e => { const r = e.target.value.replace(/\D/g,''); setIngresoStr(r ? formatCOPInput(r) : '') }}
          className="w-full bg-surface border border-border rounded-card pl-12 pr-4 py-4 text-text-primary font-serif text-3xl focus:outline-none focus:border-primary" />
      </div>
      <p className="text-text-disabled text-xs text-center mb-8">Puedes cambiarlo después. Solo es una referencia.</p>
      <button onClick={siguiente} className="w-full py-4 rounded-card bg-primary text-white font-semibold text-base active:scale-95 transition-transform">
        Continuar →
      </button>
    </div>,

    // Paso 2: Deudas
    <div key={2} className="flex flex-col px-8 py-12">
      <div className="text-5xl mb-6 text-center">💳</div>
      <h2 className="text-text-primary text-2xl font-semibold text-center mb-2">¿Tienes deudas?</h2>
      <p className="text-text-secondary text-base text-center mb-8">Tarjetas, créditos, préstamos...</p>
      <div className="flex flex-col gap-3 mb-6">
        {[['si', '✅ Sí, tengo deudas'], ['no', '🙌 No tengo deudas']].map(([v, label]) => (
          <button key={v} onClick={() => setTieneDeudas(v)}
            className={`w-full py-4 rounded-card border text-base font-medium transition-colors ${tieneDeudas === v ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-secondary'}`}>
            {label}
          </button>
        ))}
      </div>
      <button onClick={siguiente} disabled={!tieneDeudas} className="w-full py-4 rounded-card bg-primary text-white font-semibold text-base disabled:opacity-40 active:scale-95 transition-all">
        Continuar →
      </button>
    </div>,

    // Paso 3: Metas
    <div key={3} className="flex flex-col px-8 py-12">
      <div className="text-5xl mb-6 text-center">🎯</div>
      <h2 className="text-text-primary text-2xl font-semibold text-center mb-2">¿Tienes una meta de ahorro?</h2>
      <p className="text-text-secondary text-base text-center mb-8">Un viaje, un fondo de emergencia, lo que sea</p>
      <div className="flex flex-col gap-3 mb-6">
        {[['si', '✅ Sí, quiero ahorrar para algo'], ['no', '⏳ Aún no tengo una meta']].map(([v, label]) => (
          <button key={v} onClick={() => setTieneMetas(v)}
            className={`w-full py-4 rounded-card border text-base font-medium transition-colors ${tieneMetas === v ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-secondary'}`}>
            {label}
          </button>
        ))}
      </div>
      <button onClick={finalizar} disabled={!tieneMetas} className="w-full py-4 rounded-card bg-primary text-white font-semibold text-base disabled:opacity-40 active:scale-95 transition-all">
        🚀 ¡Empezar!
      </button>
    </div>,
  ]

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-16 pb-4">
        {pasos.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === paso ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`} />
        ))}
      </div>
      <div className="flex-1">{pasos[paso]}</div>
    </div>
  )
}

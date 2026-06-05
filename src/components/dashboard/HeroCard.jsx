import { useEffect, useRef, useState } from 'react'
import { formatCOP, getMesNombre } from '@/utils/formatters.js'

function useContador(objetivo, duracion = 800) {
  const [valor, setValor] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const inicio = Date.now()
    const desde = 0
    function tick() {
      const t = Math.min((Date.now() - inicio) / duracion, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setValor(Math.round(desde + (objetivo - desde) * ease))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [objetivo, duracion])

  return valor
}

export default function HeroCard({ saldo, ingresos, gastos, mes, año, esMesActual, onPrevMes, onSigMes }) {
  const saldoAnimado = useContador(Math.abs(saldo))
  const positivo = saldo >= 0

  return (
    <div className="mx-5 mt-4 rounded-hero glassmorphism p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">Saldo del mes</p>
          <p className="text-text-secondary text-sm mt-0.5">{getMesNombre(mes)} {año}</p>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${positivo ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
          {positivo ? '↑' : '↓'}
        </div>
      </div>

      <div className={`font-serif text-5xl font-normal leading-none mb-4 ${positivo ? 'text-primary' : 'text-destructive'}`}>
        {saldo < 0 ? '-' : ''}$ {saldoAnimado.toLocaleString('es-CO')}
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-black/20 rounded-card p-3">
          <p className="text-text-secondary text-[10px] uppercase tracking-wider mb-1">Ingresos</p>
          <p className="text-primary font-serif text-base">{formatCOP(ingresos)}</p>
        </div>
        <div className="flex-1 bg-black/20 rounded-card p-3">
          <p className="text-text-secondary text-[10px] uppercase tracking-wider mb-1">Gastos</p>
          <p className="text-destructive font-serif text-base">{formatCOP(gastos)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPrevMes}
          className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-text-secondary hover:opacity-70 transition"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <p className="text-text-secondary text-xs font-medium">
          {esMesActual ? 'Mes actual' : getMesNombre(mes) + ' ' + año}
        </p>
        <button
          onClick={onSigMes}
          disabled={esMesActual}
          className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-text-secondary hover:opacity-70 transition disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>
    </div>
  )
}

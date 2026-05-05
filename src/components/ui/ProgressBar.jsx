export default function ProgressBar({ porcentaje, color = 'bg-primary', altura = 'h-2' }) {
  const pct = Math.min(100, Math.max(0, porcentaje))
  return (
    <div className={`w-full ${altura} rounded-full bg-border overflow-hidden`}>
      <div
        className={`${altura} ${color} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

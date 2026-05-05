import { useState, useEffect } from 'react'
import { useConfig } from '@/hooks/useConfig.js'
import { useTransacciones } from '@/hooks/useTransacciones.js'
import { useDeudas } from '@/hooks/useDeudas.js'
import { useMetas } from '@/hooks/useMetas.js'
import { cargarSemilla } from '@/data/semilla.js'
import Onboarding from '@/components/onboarding/Onboarding.jsx'
import BottomNav from '@/components/layout/BottomNav.jsx'
import FAB from '@/components/layout/FAB.jsx'
import Dashboard from '@/components/dashboard/Dashboard.jsx'
import Transacciones from '@/components/transacciones/Transacciones.jsx'
import ModalTransaccion from '@/components/transacciones/ModalTransaccion.jsx'
import Deudas from '@/components/deudas/Deudas.jsx'
import Metas from '@/components/metas/Metas.jsx'
import Reportes from '@/components/reportes/Reportes.jsx'

export default function App() {
  const { config, updateConfig } = useConfig()
  const { transacciones, agregar: agregarT, eliminar: eliminarT } = useTransacciones()
  const { deudas, agregar: agregarD, eliminar: eliminarD, actualizar: actualizarD } = useDeudas()
  const { metas, agregar: agregarM, eliminar: eliminarM, actualizar: actualizarM, abonar } = useMetas()
  const [tabActiva, setTabActiva] = useState('dashboard')
  const [modalT, setModalT] = useState({ open: false, tipo: 'gasto' })
  const [bannerDismissed, setBannerDismissed] = useState(() => !!localStorage.getItem('fc_banner_dismissed'))

  useEffect(() => { cargarSemilla() }, [])

  // Banner de instalación iOS
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const mostrarBanner = isIOS && !isStandalone && !bannerDismissed

  function onboardingCompleto({ nombreUsuario, ingresoMensualRef }) {
    updateConfig({ nombreUsuario, ingresoMensualRef, onboardingCompleto: true })
  }

  function abrirFAB(tipo) {
    setModalT({ open: true, tipo })
    setTabActiva(prev => tipo === 'gasto' || tipo === 'ingreso' ? prev : 'metas')
  }

  if (!config.onboardingCompleto) {
    return <Onboarding onCompletar={onboardingCompleto} />
  }

  return (
    <div className="relative min-h-dvh bg-background overflow-hidden">
      {/* Contenido principal */}
      <main className="h-dvh overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {tabActiva === 'dashboard' && (
            <Dashboard transacciones={transacciones} deudas={deudas} metas={metas} />
          )}
          {tabActiva === 'transacciones' && (
            <Transacciones
              transacciones={transacciones}
              onAgregar={agregarT}
              onEliminar={eliminarT}
            />
          )}
          {tabActiva === 'deudas' && (
            <Deudas
              deudas={deudas}
              onAgregar={agregarD}
              onEliminar={eliminarD}
              estrategia={config.estrategiaDeuda}
              onCambiarEstrategia={e => updateConfig({ estrategiaDeuda: e })}
            />
          )}
          {tabActiva === 'metas' && (
            <Metas
              metas={metas}
              transacciones={transacciones}
              deudas={deudas}
              onAgregar={agregarM}
              onEliminar={eliminarM}
              onAbonar={abonar}
            />
          )}
          {tabActiva === 'reportes' && (
            <Reportes transacciones={transacciones} deudas={deudas} metas={metas} />
          )}
        </div>
      </main>

      {/* FAB — solo visible fuera de reportes */}
      {tabActiva !== 'reportes' && (
        <FAB
          onAgregarGasto={() => abrirFAB('gasto')}
          onAgregarIngreso={() => abrirFAB('ingreso')}
          onAbonarMeta={() => setTabActiva('metas')}
        />
      )}

      {/* Bottom Nav */}
      <BottomNav tabActiva={tabActiva} onCambiar={setTabActiva} />

      {/* Modal transacción desde FAB */}
      <ModalTransaccion
        isOpen={modalT.open}
        onClose={() => setModalT({ open: false, tipo: 'gasto' })}
        onGuardar={agregarT}
        tipoInicial={modalT.tipo}
      />

      {/* Banner instalación iOS */}
      {mostrarBanner && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-elevated border border-border rounded-card p-3 flex items-start gap-3 shadow-lg">
          <span className="text-2xl">📱</span>
          <div className="flex-1">
            <p className="text-text-primary text-xs font-medium">Instala esta app en tu iPhone</p>
            <p className="text-text-secondary text-xs mt-0.5">Toca Compartir → Añadir a pantalla de inicio</p>
          </div>
          <button onClick={() => { localStorage.setItem('fc_banner_dismissed', '1'); setBannerDismissed(true) }}
            className="text-text-disabled text-lg leading-none">×</button>
        </div>
      )}
    </div>
  )
}

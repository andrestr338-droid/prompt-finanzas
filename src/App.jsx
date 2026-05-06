import { useState, useEffect } from 'react'
import { useConfig } from '@/hooks/useConfig.js'
import { useTransacciones } from '@/hooks/useTransacciones.js'
import { useDeudas } from '@/hooks/useDeudas.js'
import { useMetas } from '@/hooks/useMetas.js'
import { useGastosFijos } from '@/hooks/useGastosFijos.js'
import { useTarjetas } from '@/hooks/useTarjetas.js'
import { cargarSemilla } from '@/data/semilla.js'
import { getHoy } from '@/utils/formatters.js'
import Onboarding from '@/components/onboarding/Onboarding.jsx'
import BottomNav from '@/components/layout/BottomNav.jsx'
import FAB from '@/components/layout/FAB.jsx'
import Dashboard from '@/components/dashboard/Dashboard.jsx'
import Transacciones from '@/components/transacciones/Transacciones.jsx'
import ModalTransaccion from '@/components/transacciones/ModalTransaccion.jsx'
import Deudas from '@/components/deudas/Deudas.jsx'
import Metas from '@/components/metas/Metas.jsx'
import Reportes from '@/components/reportes/Reportes.jsx'
import GastosFijos from '@/components/fijos/GastosFijos.jsx'

export default function App() {
  const { config, updateConfig } = useConfig()
  const { transacciones, agregar: agregarT, eliminar: eliminarT } = useTransacciones()
  const { deudas, agregar: agregarD, eliminar: eliminarD, actualizar: actualizarD } = useDeudas()
  const { metas, agregar: agregarM, eliminar: eliminarM, abonar } = useMetas()
  const { fijos, agregar: agregarF, eliminar: eliminarF, marcarPagado, desmarcar, sincronizarConDeudas } = useGastosFijos()
  const { tarjetas, agregar: agregarTarjeta, eliminar: eliminarTarjeta } = useTarjetas()
  const [tabActiva, setTabActiva] = useState('dashboard')
  const [bannerDismissed, setBannerDismissed] = useState(() => !!localStorage.getItem('fc_banner_dismissed'))

  // Detectar ?add=gasto o ?add=ingreso en la URL (para atajos de iOS)
  const paramAdd = new URLSearchParams(window.location.search).get('add')
  const [modalT, setModalT] = useState(() => {
    if (paramAdd === 'gasto' || paramAdd === 'ingreso') return { open: true, tipo: paramAdd }
    return { open: false, tipo: 'gasto' }
  })

  useEffect(() => {
    cargarSemilla()
    // Limpiar el parámetro de la URL sin recargar la página
    if (paramAdd) window.history.replaceState({}, '', window.location.pathname)
  }, [])

  // Sincronizar gastos fijos con deudas cada vez que cambien las deudas
  useEffect(() => { sincronizarConDeudas(deudas) }, [deudas])

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const mostrarBanner = isIOS && !isStandalone && !bannerDismissed

  function onboardingCompleto({ nombreUsuario, ingresoMensualRef }) {
    updateConfig({ nombreUsuario, ingresoMensualRef, onboardingCompleto: true })
  }

  function abrirFAB(tipo) {
    setModalT({ open: true, tipo })
  }

  // Cuando se tilda un gasto fijo: registrar transacción automáticamente
  function handleTildar(id, mesKey, fijo) {
    marcarPagado(id, mesKey)
    // Registrar gasto automáticamente
    agregarT({
      tipo: 'gasto',
      monto: fijo.monto,
      categoria: fijo.categoria,
      descripcion: fijo.nombre,
      fecha: getHoy(),
      tipoIngreso: null,
      fuente: null,
    })
    // Si es cuota de deuda, reducir el saldo de la deuda
    if (fijo.tipo === 'deuda' && fijo.deudaId) {
      const deuda = deudas.find(d => d.id === fijo.deudaId)
      if (deuda) {
        const nuevoSaldo = Math.max(0, deuda.saldoActual - fijo.monto)
        actualizarD(fijo.deudaId, { saldoActual: nuevoSaldo })
      }
    }
  }

  // Cuando se destilda: eliminar la última transacción automática del fijo en este mes
  function handleDestildar(id, mesKey) {
    desmarcar(id, mesKey)
  }

  // Agregar deuda y sincronizar fijos
  function handleAgregarDeuda(d) {
    agregarD(d)
  }

  // Eliminar deuda y limpiar fijo asociado
  function handleEliminarDeuda(id) {
    eliminarD(id)
  }

  if (!config.onboardingCompleto) {
    return <Onboarding onCompletar={onboardingCompleto} />
  }

  return (
    <div className="relative min-h-dvh bg-background overflow-hidden">
      <main className="h-dvh overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {tabActiva === 'dashboard' && (
            <Dashboard transacciones={transacciones} deudas={deudas} metas={metas}
              tarjetas={tarjetas} onAgregarTarjeta={agregarTarjeta} onEliminarTarjeta={eliminarTarjeta} />
          )}
          {tabActiva === 'fijos' && (
            <GastosFijos
              fijos={fijos}
              onAgregar={agregarF}
              onEliminar={eliminarF}
              onTildar={handleTildar}
              onDestildar={handleDestildar}
            />
          )}
          {tabActiva === 'transacciones' && (
            <Transacciones transacciones={transacciones} tarjetas={tarjetas} onAgregar={agregarT} onEliminar={eliminarT} />
          )}
          {tabActiva === 'deudas' && (
            <Deudas
              deudas={deudas}
              onAgregar={handleAgregarDeuda}
              onEliminar={handleEliminarDeuda}
              estrategia={config.estrategiaDeuda}
              onCambiarEstrategia={e => updateConfig({ estrategiaDeuda: e })}
            />
          )}
          {tabActiva === 'metas' && (
            <Metas metas={metas} transacciones={transacciones} deudas={deudas}
              onAgregar={agregarM} onEliminar={eliminarM} onAbonar={abonar} />
          )}
          {tabActiva === 'reportes' && (
            <Reportes transacciones={transacciones} deudas={deudas} metas={metas} />
          )}
        </div>
      </main>

      {tabActiva !== 'reportes' && (
        <FAB
          onAgregarGasto={() => abrirFAB('gasto')}
          onAgregarIngreso={() => abrirFAB('ingreso')}
          onAbonarMeta={() => setTabActiva('metas')}
        />
      )}

      <BottomNav tabActiva={tabActiva} onCambiar={setTabActiva} />

      <ModalTransaccion
        isOpen={modalT.open}
        onClose={() => setModalT({ open: false, tipo: 'gasto' })}
        onGuardar={agregarT}
        tipoInicial={modalT.tipo}
        tarjetas={tarjetas}
      />

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

import { useState, useEffect } from 'react'
import { useConfig } from '@/hooks/useConfig.js'
import { useTransacciones } from '@/hooks/useTransacciones.js'
import { useDeudas } from '@/hooks/useDeudas.js'
import { useMetas } from '@/hooks/useMetas.js'
import { useGastosFijos } from '@/hooks/useGastosFijos.js'
import { useTarjetas } from '@/hooks/useTarjetas.js'
import { useGastosTarjeta } from '@/hooks/useGastosTarjeta.js'
import { cargarSemilla } from '@/data/semilla.js'
import { getHoy, getMesNombre } from '@/utils/formatters.js'
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
  const { gastos: gastosTarjeta, agregar: agregarGT, eliminar: eliminarGT, marcarPagado: marcarPagadoGT } = useGastosTarjeta()
  const [tabActiva, setTabActiva] = useState('dashboard')
  const [bannerDismissed, setBannerDismissed] = useState(() => !!localStorage.getItem('fc_banner_dismissed'))

  const paramAdd = new URLSearchParams(window.location.search).get('add')
  const [modalT, setModalT] = useState(() => {
    if (paramAdd === 'gasto' || paramAdd === 'ingreso') return { open: true, tipo: paramAdd }
    return { open: false, tipo: 'gasto' }
  })

  useEffect(() => {
    cargarSemilla()
    if (paramAdd) window.history.replaceState({}, '', window.location.pathname)
  }, [])

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

  // Gastos en tarjeta van a su propio store; el resto a transacciones normales
  function handleAgregarTransaccion(t) {
    if (t.tipo === 'gasto' && t.metodoPago === 'tc') {
      agregarGT(t)
    } else {
      agregarT(t)
    }
  }

  // Cuando se marca el pago de una tarjeta: crear transacción real que suma al mes
  function handlePagarTarjeta(tcId, tcNombre, total, mes, año) {
    marcarPagadoGT(tcId, mes, año)
    agregarT({
      tipo: 'gasto',
      monto: total,
      categoria: 'deuda',
      descripcion: `Pago tarjeta ${tcNombre} — ${getMesNombre(mes)} ${año}`,
      fecha: getHoy(),
      metodoPago: 'efectivo',
      tcId: null,
      tcNombre: null,
    })
  }

  function handleTildar(id, mesKey, fijo) {
    marcarPagado(id, mesKey)
    agregarT({
      tipo: 'gasto',
      monto: fijo.monto,
      categoria: fijo.categoria,
      descripcion: fijo.nombre,
      fecha: getHoy(),
      tipoIngreso: null,
      fuente: null,
    })
    if (fijo.tipo === 'deuda' && fijo.deudaId) {
      const deuda = deudas.find(d => d.id === fijo.deudaId)
      if (deuda) {
        const nuevoSaldo = Math.max(0, deuda.saldoActual - fijo.monto)
        actualizarD(fijo.deudaId, { saldoActual: nuevoSaldo })
      }
    }
  }

  function handleDestildar(id, mesKey) {
    desmarcar(id, mesKey)
  }

  function handleAgregarDeuda(d) {
    agregarD(d)
  }

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
            <Transacciones
              transacciones={transacciones}
              tarjetas={tarjetas}
              gastosTarjeta={gastosTarjeta}
              onAgregar={handleAgregarTransaccion}
              onEliminar={eliminarT}
              onEliminarGastoTarjeta={eliminarGT}
              onPagarTarjeta={handlePagarTarjeta}
            />
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
        onGuardar={handleAgregarTransaccion}
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

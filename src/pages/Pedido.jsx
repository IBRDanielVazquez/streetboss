import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Trash2, ChevronRight, Percent, DollarSign } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useRol } from '../hooks/useRol'
import ProductoCard from '../components/ProductoCard'
import ModalCancelar from '../components/ModalCancelar'
import ModalPin from '../components/ModalPin'

export default function Pedido() {
  const { mesa } = useParams()
  const numMesa  = Number(mesa)
  const navigate = useNavigate()
  const {
    mesas, menu, config,
    agregarProductoAMesa, quitarProductoDeMesa, cancelarProducto, actualizarNota,
    enviarACocina, aplicarDescuento, cancelarPedido, slug, loading
  } = useApp()
  const { rol, basePath, meseroSlug } = useRol()

  const mesaInfo  = mesas.find(m => m.numero === numMesa) || {}
  const pedidos   = mesaInfo.pedidos || []
  const descuento = mesaInfo.descuento || { tipo: null, valor: 0 }

  // Grupos entregados por cocina (historial de esta mesa)
  const gruposEntregados = (mesaInfo.grupos || []).filter(g => g.entregado)
  const hayEntregados    = gruposEntregados.length > 0

  // Productos pendientes de enviar (no enviados aún)
  const pedidosPendientes = pedidos.filter(p => !p.enviadoACocina)

  const [catActiva,     setCatActiva]     = useState(menu[0]?.id || '')
  const [notaModal,     setNotaModal]     = useState(null)
  const [cancelarVis,   setCancelarVis]   = useState(false)
  const [descTipo,      setDescTipo]      = useState(descuento.tipo || 'porcentaje')
  const [descValor,     setDescValor]     = useState(descuento.valor || '')
  const [toastEnviado,  setToastEnviado]  = useState(false)

  // Estado para PIN de descuento
  const [descPinVis,    setDescPinVis]    = useState(false)

  // Estado para cancelar producto individual con PIN
  const [cancelProdId,  setCancelProdId]  = useState(null)

  // FIX 1: subtotal/total solo de productos pendientes (nuevo pedido), no del acumulado total
  const subtotalNuevo = pedidosPendientes.reduce((s, p) => s + p.precio * p.cantidad, 0)
  const descMonto  = descuento.tipo === 'porcentaje' ? Math.round(subtotalNuevo * descuento.valor / 100) : descuento.tipo === 'monto' ? descuento.valor : 0
  const total      = subtotalNuevo - descMonto
  const catVisible = menu.filter(c => c.visible)
  const catActual  = catVisible.find(c => c.id === catActiva) || catVisible[0]

  const irAtras = () => navigate(rol === 'admin' ? `${basePath}/mesas` : `${basePath}`)

  // FIX 2: enviar a cocina → toast 2s → redirigir a mesas
  const handleEnviar = () => {
    const mesero = config.meseros?.find(m => m.slug === meseroSlug)
    const meseroNombre = mesero ? mesero.nombre : null
    enviarACocina(numMesa, meseroNombre)
    setToastEnviado(true)
    setTimeout(() => {
      setToastEnviado(false)
      navigate(rol === 'admin' ? `${basePath}/mesas` : `${basePath}`)
    }, 2000)
  }

  const handleCancelarMesa = (razon) => { cancelarPedido(numMesa, razon); irAtras() }

  // Descuento: primero pide PIN, luego aplica
  const solicitarDescuento = () => {
    if (descValor) setDescPinVis(true)
  }
  const confirmarDescuento = () => {
    aplicarDescuento(numMesa, descTipo, Number(descValor), 'Admin')
    setDescPinVis(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark flex flex-col relative">
      {/* Toast */}
      {toastEnviado && (
        <div className="fixed top-20 left-4 right-4 z-[100] animate-bounce">
          <div className="bg-green-500 text-dark font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-2">
            <span>✅</span> Pedido enviado a cocina
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark sticky top-0 z-20">
        <button onClick={irAtras} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary">←</button>
        <div className="flex-1">
          <h2 className="text-white font-black text-lg">Mesa {numMesa}</h2>
          <p className="text-gray-500 text-xs">{pedidos.length ? `${pedidos.reduce((s,p)=>s+p.cantidad,0)} productos` : 'Toma el pedido'}</p>
        </div>
        {pedidos.length > 0 && (
          <button onClick={() => navigate(`${basePath}/cobro/${numMesa}`)}
            className="bg-dark3 border border-gray-700 text-primary text-sm font-bold px-3 py-2 rounded-xl min-h-[44px] flex items-center gap-1">
            Ver cuenta <ChevronRight size={14}/>
          </button>
        )}
        <button onClick={() => setCancelarVis(true)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-red-400">
          <X size={22}/>
        </button>
      </div>

      {/* Tabs categorías */}
      <div className="flex overflow-x-auto gap-2 px-4 py-3 border-b border-white/5 no-scrollbar">
        {catVisible.map(c => (
          <button key={c.id} onClick={() => setCatActiva(c.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold min-h-[40px] transition-colors
              ${catActiva === c.id ? 'bg-primary text-dark' : 'bg-dark3 text-gray-300'}`}>
            {c.nombre}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
        {catActual?.productos.filter(p => p.activo).map(prod => {
          const enCarrito = pedidosPendientes.find(p => p.id === prod.id || p.prodId === prod.id)
          return (
            <ProductoCard key={prod.id} producto={prod} cantidad={enCarrito?.cantidad || 0}
              esPlus={catActual.esPlus}
              onAgregar={() => agregarProductoAMesa(numMesa, prod)}
              onQuitar={() => {
                if (enCarrito && !enCarrito.enviadoACocina) {
                  quitarProductoDeMesa(numMesa, enCarrito.id)
                }
              }}
              onNota={() => setNotaModal({ prodId: prod.id, nota: enCarrito?.nota || '' })}
            />
          )
        })}
      </div>

      {/* Modal nota */}
      {notaModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50">
          <div className="bg-dark2 rounded-t-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-black text-lg">Nota del producto</h3>
            <input autoFocus type="text" value={notaModal.nota}
              onChange={e => setNotaModal(n => ({...n, nota: e.target.value}))}
              placeholder="ej: sin cebolla, extra salsa..."
              className="w-full bg-dark3 border border-gray-600 text-white px-4 py-3 rounded-xl outline-none focus:border-primary min-h-[52px]"/>
            <div className="flex gap-3">
              <button onClick={() => setNotaModal(null)} className="flex-1 bg-dark3 text-gray-400 font-bold py-3 rounded-2xl min-h-[52px]">Cancelar</button>
              <button onClick={() => { actualizarNota(numMesa, notaModal.prodId, notaModal.nota); setNotaModal(null) }}
                className="flex-[2] bg-primary text-dark font-black py-3 rounded-2xl min-h-[52px]">Guardar nota</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer carrito — solo visible si hay algo que mostrar */}
      {(pedidos.length > 0 || hayEntregados) && (
        <div className="border-t border-white/5 bg-dark2">

          {/* FIX 1: Ya entregados — historial readonly, NO suma al total */}
          {hayEntregados && (
            <div className="px-4 pt-3 pb-2">
              <p className="text-green-400 text-xs font-bold mb-2">✅ Ya entregados por cocina</p>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {gruposEntregados.flatMap(g => g.productos).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 opacity-40">
                    <span className="text-gray-500 text-xs w-5">{p.cantidad}×</span>
                    <span className="text-gray-400 text-xs flex-1 line-through">{p.nombre}</span>
                    <span className="text-gray-500 text-xs">${(p.precio * p.cantidad).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-white/5 mt-2" />
            </div>
          )}

          {/* En cocina (grupos activos no entregados) — readonly con botón cancelar PIN */}
          {(() => {
            const gruposActivos = (mesaInfo.grupos || []).filter(g => !g.entregado)
            if (!gruposActivos.length) return null
            return (
              <div className="px-4 pt-2 pb-2">
                <p className="text-orange-400 text-xs font-bold mb-2">🍳 En cocina</p>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {gruposActivos.flatMap(g => g.productos).map((p, i) => (
                    <div key={`cocina-${i}`} className="flex items-center gap-2">
                      <span className="text-orange-400 text-xs w-5">{p.cantidad}×</span>
                      <span className="text-gray-400 text-xs flex-1 italic">{p.nombre}</span>
                      <span className="text-gray-500 text-xs">${(p.precio * p.cantidad).toLocaleString()}</span>
                      {/* FIX 3: cancelar producto ya enviado también requiere PIN + alerta */}
                      <button
                        onClick={() => {
                          if (window.confirm('⚠️ Este producto ya fue enviado a cocina.\nSe notificará al administrador de la cancelación.\n¿Continuar?')) {
                            setCancelProdId(p.id)
                          }
                        }}
                        className="text-gray-700 active:text-red-400 p-1"
                      >
                        <Trash2 size={12}/>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-white/5 mt-2" />
              </div>
            )
          })()}

          {/* Nuevo pedido — solo productos pendientes de enviar */}
          <div className="px-4 pt-2 pb-0 space-y-3">
            {pedidosPendientes.length > 0 && (
              <p className="text-primary text-xs font-bold">➕ Nuevo pedido</p>
            )}
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {pedidosPendientes.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="text-white text-sm font-semibold">{p.cantidad}× {p.nombre}</span>
                    {p.nota && <span className="text-gray-500 text-xs ml-1">({p.nota})</span>}
                  </div>
                  <span className="text-white text-sm font-bold">${(p.precio * p.cantidad).toLocaleString()}</span>
                  <button onClick={() => setCancelProdId(p.id)} className="text-gray-600 active:text-red-400 p-1">
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))}
            </div>

            {/* Descuento — requiere PIN admin */}
            {(pedidosPendientes.length > 0 || rol === 'admin') && (
              <div className="flex items-center gap-2">
                <button onClick={() => setDescTipo(t => t === 'porcentaje' ? 'monto' : 'porcentaje')}
                  className="bg-dark3 border border-gray-700 text-gray-400 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {descTipo === 'porcentaje' ? <Percent size={15}/> : <DollarSign size={15}/>}
                </button>
                <input type="number" value={descValor}
                  onChange={e => setDescValor(e.target.value)}
                  onBlur={solicitarDescuento}
                  placeholder={descTipo === 'porcentaje' ? '% desc.' : '$ desc.'}
                  className="flex-1 bg-dark3 border border-gray-700 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-primary min-h-[40px]"/>
                {descMonto > 0 && (
                  <span className="text-red-400 text-sm font-bold whitespace-nowrap">−${descMonto}</span>
                )}
              </div>
            )}

            {/* FIX 1: Total = solo productos nuevos (pendientes), no acumulado */}
            <div className="flex items-center justify-between pb-4">
              <div>
                {pedidosPendientes.length > 0 ? (
                  <>
                    <p className="text-gray-500 text-xs">Este pedido</p>
                    <p className="text-primary font-black text-2xl">${total.toLocaleString()}</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-xs">Carrito vacío</p>
                    <p className="text-gray-600 font-black text-lg">$0</p>
                  </>
                )}
              </div>
              {pedidosPendientes.length > 0 && (
                <button onClick={handleEnviar}
                  className="bg-primary text-dark font-black px-6 py-3 rounded-2xl text-base min-h-[52px] active:opacity-80">
                  🍳 Enviar a cocina
                </button>
              )}
              {pedidosPendientes.length === 0 && pedidos.length > 0 && !(rol === 'mesero' && config.cajeroHabilitado) && (
                <button onClick={() => navigate(`${basePath}/cobro/${numMesa}`)}
                  className="bg-green-600 text-white font-black px-6 py-3 rounded-2xl text-base min-h-[52px] active:opacity-80">
                  💰 Cobrar
                </button>
              )}
              {pedidosPendientes.length === 0 && pedidos.length > 0 && rol === 'mesero' && config.cajeroHabilitado && (
                <div className="bg-dark3 border border-gray-700 px-4 py-3 rounded-2xl text-center">
                  <p className="text-gray-400 text-xs font-bold">✅ Listo</p>
                  <p className="text-gray-600 text-[10px]">Esperando cajero</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal cancelar mesa completa (con PIN + razón) */}
      {cancelarVis && (
        <ModalCancelar pinAdmin={config.pinAdmin} onConfirmar={handleCancelarMesa} onCerrar={() => setCancelarVis(false)}/>
      )}

      {/* Modal cancelar producto individual (con PIN + razón) */}
      {cancelProdId && (
        <ModalCancelar
          pinAdmin={config.pinAdmin}
          onConfirmar={(razon) => {
            cancelarProducto(numMesa, cancelProdId, razon)
            setCancelProdId(null)
          }}
          onCerrar={() => setCancelProdId(null)}
        />
      )}

      {/* Modal PIN para descuento */}
      {descPinVis && (
        <ModalPin
          titulo="Aplicar descuento"
          subtitulo="Ingresa el PIN de administrador"
          pinCorrecto={config.pinAdmin}
          onExito={confirmarDescuento}
          onCerrar={() => setDescPinVis(false)}
        />
      )}
    </div>
  )
}

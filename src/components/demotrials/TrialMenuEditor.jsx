// Editor del MENÚ de una prueba: categorías y productos con foto local.
import { useState } from 'react'
import { Plus, Pencil, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react'
import { comprimirImagen } from '../../context/DemoTrialsContext'
import { ModalDemo, inputCls, labelCls } from './ProspectForm'

const FORM_PROD_VACIO = { nombre: '', precio: '', descripcion: '' }

export default function TrialMenuEditor({ menu, crearCategoria, editarCategoria, toggleCategoria, moverCategoria, crearProducto, editarProducto }) {
  // modalProd: null | { catId } (nuevo) | { catId, prod } (editar)
  const [modalProd, setModalProd] = useState(null)
  const [formProd, setFormProd] = useState(FORM_PROD_VACIO)
  // modalCat: null | 'nueva' | { cat } (renombrar)
  const [modalCat, setModalCat] = useState(null)
  const [nombreCat, setNombreCat] = useState('')
  const [error, setError] = useState('')
  const [fotoError, setFotoError] = useState('')

  // ── Abrir modales ────────────────────────────────────────────────────────
  const abrirNuevoProd = (catId) => { setFormProd(FORM_PROD_VACIO); setError(''); setModalProd({ catId }) }
  const abrirEditarProd = (catId, prod) => {
    setFormProd({ nombre: prod.nombre, precio: String(prod.precio), descripcion: prod.descripcion || '' })
    setError(''); setModalProd({ catId, prod })
  }

  const guardarProd = () => {
    if (!formProd.nombre.trim()) { setError('El nombre del platillo es obligatorio'); return }
    const datos = { nombre: formProd.nombre.trim(), precio: Number(formProd.precio) || 0, descripcion: formProd.descripcion.trim() }
    if (modalProd.prod) editarProducto(modalProd.catId, modalProd.prod.id, datos)
    else crearProducto(modalProd.catId, datos)
    setModalProd(null)
  }

  const guardarCat = () => {
    if (!nombreCat.trim()) { setError('El nombre de la categoría es obligatorio'); return }
    if (modalCat === 'nueva') crearCategoria(nombreCat)
    else editarCategoria(modalCat.cat.id, { nombre: nombreCat.trim() })
    setModalCat(null)
  }

  // Subir/cambiar foto: comprimida a máx 800px para cuidar el localStorage
  const subirFoto = async (catId, prodId, file) => {
    if (!file) return
    setFotoError('')
    try {
      const dataUrl = await comprimirImagen(file)
      editarProducto(catId, prodId, { foto: dataUrl })
    } catch {
      setFotoError('No se pudo procesar la imagen. Intenta con otra foto.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{menu.length} categorías · {menu.reduce((s, c) => s + c.productos.length, 0)} productos</p>
        <button
          onClick={() => { setNombreCat(''); setError(''); setModalCat('nueva') }}
          className="flex items-center gap-2 bg-dark2 border border-white/10 text-white font-bold text-xs px-3 py-2 rounded-xl hover:border-primary/50 transition-colors"
        >
          <Plus size={14} /> Nueva categoría
        </button>
      </div>
      {fotoError && <p className="text-red-400 text-xs font-bold">{fotoError}</p>}

      {menu.map((cat, ci) => (
        <div key={cat.id} className={`bg-dark2 border border-white/5 rounded-2xl p-4 ${!cat.visible ? 'opacity-50' : ''}`}>
          {/* Cabecera de categoría */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-bold flex-1 truncate">{cat.nombre}</span>
            <button onClick={() => moverCategoria(cat.id, -1)} disabled={ci === 0} className="text-gray-500 hover:text-primary disabled:opacity-30 p-1" aria-label="Subir categoría"><ArrowUp size={15} /></button>
            <button onClick={() => moverCategoria(cat.id, 1)} disabled={ci === menu.length - 1} className="text-gray-500 hover:text-primary disabled:opacity-30 p-1" aria-label="Bajar categoría"><ArrowDown size={15} /></button>
            <button
              onClick={() => toggleCategoria(cat.id)}
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${cat.visible ? 'bg-green-500/15 text-green-400' : 'bg-dark3 text-gray-500'}`}
              aria-label={cat.visible ? `Desactivar ${cat.nombre}` : `Activar ${cat.nombre}`}
            >
              {cat.visible ? <Eye size={12} /> : <EyeOff size={12} />} {cat.visible ? 'Visible' : 'Oculta'}
            </button>
            <button onClick={() => { setNombreCat(cat.nombre); setError(''); setModalCat({ cat }) }} className="text-gray-500 hover:text-primary p-1" aria-label={`Renombrar ${cat.nombre}`}>
              <Pencil size={15} />
            </button>
          </div>

          {/* Productos */}
          <div className="space-y-2">
            {cat.productos.map(prod => (
              <div key={prod.id} className={`bg-dark3 rounded-xl p-3 ${!prod.activo ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-3">
                  {/* Foto */}
                  <label className="cursor-pointer shrink-0 group relative" title={prod.foto ? 'Cambiar foto' : 'Subir foto'}>
                    {prod.foto
                      ? <img src={prod.foto} alt={prod.nombre} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                      : <div className="w-12 h-12 rounded-lg bg-dark2 border border-white/10 flex items-center justify-center text-lg">📷</div>}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => { subirFoto(cat.id, prod.id, e.target.files[0]); e.target.value = '' }} />
                  </label>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{prod.nombre}</p>
                    {prod.descripcion && <p className="text-gray-500 text-xs truncate">{prod.descripcion}</p>}
                  </div>

                  {/* Precio editable directo */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-gray-500 text-xs">$</span>
                    <input
                      type="number"
                      value={prod.precio}
                      onChange={e => editarProducto(cat.id, prod.id, { precio: Number(e.target.value) || 0 })}
                      className="w-16 bg-dark2 border border-white/10 text-white text-sm px-2 py-1 rounded-lg outline-none focus:border-primary text-right"
                      aria-label={`Precio de ${prod.nombre}`}
                    />
                  </div>

                  {/* Estado: activo / agotado / oculto */}
                  <select
                    value={!prod.activo ? 'oculto' : (prod.agotado ? 'agotado' : 'activo')}
                    onChange={e => {
                      const v = e.target.value
                      editarProducto(cat.id, prod.id, { activo: v !== 'oculto', agotado: v === 'agotado' })
                    }}
                    className={`shrink-0 text-xs px-2 py-1.5 rounded-lg font-bold outline-none cursor-pointer appearance-none text-center ${
                      !prod.activo ? 'bg-dark2 text-gray-500' : prod.agotado ? 'bg-yellow-500/15 text-yellow-400' : 'bg-green-500/15 text-green-400'
                    }`}
                    aria-label={`Estado de ${prod.nombre}`}
                  >
                    <option value="activo">🟢 Activo</option>
                    <option value="agotado">🟡 Agotado</option>
                    <option value="oculto">⚫ Oculto</option>
                  </select>

                  <button onClick={() => abrirEditarProd(cat.id, prod)} className="text-gray-500 hover:text-primary p-1.5 shrink-0" aria-label={`Editar ${prod.nombre}`}>
                    <Pencil size={15} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => abrirNuevoProd(cat.id)}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-white/10 text-gray-500 hover:text-primary hover:border-primary/40 text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              <Plus size={14} /> Agregar platillo a {cat.nombre}
            </button>
          </div>
        </div>
      ))}

      {/* Modal producto (crear/editar) */}
      {modalProd && (
        <ModalDemo titulo={modalProd.prod ? 'Editar platillo' : 'Nuevo platillo'} onCerrar={() => setModalProd(null)}>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Nombre *</label>
              <input className={inputCls} value={formProd.nombre} onChange={e => setFormProd({ ...formProd, nombre: e.target.value })} placeholder="Ej. Taco de pastor" />
            </div>
            <div>
              <label className={labelCls}>Precio ($)</label>
              <input className={inputCls} inputMode="decimal" value={formProd.precio} onChange={e => setFormProd({ ...formProd, precio: e.target.value.replace(/[^0-9.]/g, '') })} placeholder="Ej. 25" />
            </div>
            <div>
              <label className={labelCls}>Descripción</label>
              <textarea className={`${inputCls} min-h-[70px]`} value={formProd.descripcion} onChange={e => setFormProd({ ...formProd, descripcion: e.target.value })} placeholder="Ej. Con piña, cilantro y cebolla" />
            </div>
            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
            <button onClick={guardarProd} className="w-full bg-primary text-dark font-black py-3 rounded-xl hover:opacity-90 transition-opacity">
              {modalProd.prod ? 'Guardar cambios' : 'Crear platillo'}
            </button>
          </div>
        </ModalDemo>
      )}

      {/* Modal categoría (crear/renombrar) */}
      {modalCat && (
        <ModalDemo titulo={modalCat === 'nueva' ? 'Nueva categoría' : 'Renombrar categoría'} onCerrar={() => setModalCat(null)}>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Nombre *</label>
              <input className={inputCls} value={nombreCat} onChange={e => setNombreCat(e.target.value)} placeholder="Ej. 🌮 Tacos" />
            </div>
            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
            <button onClick={guardarCat} className="w-full bg-primary text-dark font-black py-3 rounded-xl hover:opacity-90 transition-opacity">
              {modalCat === 'nueva' ? 'Crear categoría' : 'Guardar'}
            </button>
          </div>
        </ModalDemo>
      )}
    </div>
  )
}

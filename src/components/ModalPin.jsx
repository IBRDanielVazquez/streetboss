import { useState } from 'react'
import { Delete } from 'lucide-react'

// modo: 'numerico' (4 dígitos, teclado) | 'texto' (alfanumérico, input libre)
export default function ModalPin({
  titulo    = 'PIN requerido',
  subtitulo = '',
  pinCorrecto,
  modo      = 'numerico',
  // Acepta tanto onExito como onSuccess (compatibilidad)
  onExito, onSuccess,
  onCerrar, onCancel,
}) {
  const exito  = onExito  || onSuccess
  const cerrar = onCerrar || onCancel

  // ── Modo NUMÉRICO ────────────────────────────────────────────
  const [dig,   setDig]   = useState([])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const agregar = d => {
    if (dig.length >= 4) return
    const nuevo = [...dig, d]
    setDig(nuevo)
    if (nuevo.length === 4) {
      if (nuevo.join('') === String(pinCorrecto)) { exito?.() }
      else {
        setError(true); setShake(true)
        setTimeout(() => { setDig([]); setError(false); setShake(false) }, 800)
      }
    }
  }
  const borrar = () => setDig(d => d.slice(0,-1))
  const teclas = [1,2,3,4,5,6,7,8,9,null,0,'⌫']

  // ── Modo TEXTO (alfanumérico) ────────────────────────────────
  const [codigo, setCodigo] = useState('')
  const [errorT, setErrorT] = useState(false)

  const verificarTexto = () => {
    if (codigo.trim().toUpperCase() === String(pinCorrecto).toUpperCase()) {
      exito?.()
    } else {
      setErrorT(true)
      setTimeout(() => setErrorT(false), 1500)
    }
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-6"
         onClick={e => e.target === e.currentTarget && cerrar?.()}>
      <div className={`bg-dark2 rounded-3xl p-6 w-full max-w-xs space-y-5 transition-all ${shake ? 'scale-95' : ''}`}>

        {/* Cabecera */}
        <div className="text-center">
          <p className="text-4xl mb-2">🔐</p>
          <h3 className="text-white font-black text-xl">{titulo}</h3>
          {subtitulo && <p className="text-gray-500 text-sm mt-1">{subtitulo}</p>}
        </div>

        {modo === 'numerico' ? (
          <>
            {/* Puntos indicadores */}
            <div className="flex justify-center gap-4">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all
                  ${error ? 'border-red-400 bg-red-400' : i < dig.length ? 'border-primary bg-primary' : 'border-gray-600'}`}/>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm text-center font-semibold -mt-2">PIN incorrecto</p>}

            {/* Teclado numérico */}
            <div className="grid grid-cols-3 gap-2">
              {teclas.map((t, i) => t === null ? <div key={i}/> : (
                <button key={i} onClick={() => t === '⌫' ? borrar() : agregar(String(t))}
                  className={`rounded-2xl font-bold text-xl min-h-[60px] active:scale-95 transition-transform
                    ${t === '⌫' ? 'bg-gray-700 text-gray-300' : 'bg-dark3 text-white active:bg-gray-700'}`}>
                  {t === '⌫' ? <Delete size={20} className="mx-auto"/> : t}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Input alfanumérico */}
            <input
              autoFocus
              type="text"
              value={codigo}
              onChange={e => { setCodigo(e.target.value); setErrorT(false) }}
              onKeyDown={e => e.key === 'Enter' && verificarTexto()}
              placeholder="Ingresa el código"
              className={`w-full bg-dark3 border text-white text-center text-lg font-bold px-4 py-3 rounded-2xl outline-none tracking-widest min-h-[56px]
                ${errorT ? 'border-red-500' : 'border-gray-600 focus:border-primary'}`}
            />
            {errorT && <p className="text-red-400 text-sm text-center font-semibold -mt-2">Código incorrecto</p>}

            <button onClick={verificarTexto}
              className="w-full bg-primary text-dark font-black py-3 rounded-2xl text-lg min-h-[52px]">
              Entrar
            </button>
          </>
        )}

        {/* Cancelar */}
        {cerrar && (
          <button onClick={cerrar}
            className="w-full bg-gray-800 text-gray-400 font-semibold py-3 rounded-2xl min-h-[48px]">
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}

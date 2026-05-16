import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Header({ titulo, subtitulo, atras, accionesDer=[] }) {
  const { config } = useApp()
  const navigate   = useNavigate()
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark sticky top-0 z-20">
      {atras&&<button onClick={()=>typeof atras==='string'?navigate(atras):atras()} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary"><ArrowLeft size={22}/></button>}
      {!atras&&config.logo&&<img src={config.logo} alt="logo" className="w-9 h-9 rounded-xl object-cover"/>}
      <div className="flex-1 min-w-0">
        <h2 className="text-white font-black text-base leading-tight truncate">{titulo||config.negocio}</h2>
        {subtitulo&&<p className="text-gray-400 text-xs truncate">{subtitulo}</p>}
      </div>
      <div className="flex items-center gap-2">
        {accionesDer.map((a,i)=>(
          <button key={i} onClick={a.onClick} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 active:text-primary relative">
            <a.Icono size={22}/>
            {a.badge>0&&<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{a.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

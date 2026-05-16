import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutGrid, Flame, BarChart2, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useRol } from '../hooks/useRol'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { mesas, slug } = useApp()
  const { rol } = useRol()
  
  if (rol !== 'admin') return null

  const badgeCocina = mesas.filter(m => m.enCocina).length
  const badgeMesas   = mesas.filter(m => m.estado === 'lista').length

  const tabs = [
    { ruta: `/${slug}/admin/mesas`,   Icono: LayoutGrid, label: 'Mesas',   badge: badgeMesas },
    { ruta: `/${slug}/admin/cocina`,  Icono: Flame,      label: 'Cocina',  badge: badgeCocina },
    { ruta: `/${slug}/admin/reporte`, Icono: BarChart2,  label: 'Reporte', badge: 0 },
    { ruta: `/${slug}/admin/config`,  Icono: Settings,   label: 'Config',  badge: 0 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-dark2/80 backdrop-blur-xl border-t border-white/5 flex z-30 pb-safe">
      {tabs.map(({ ruta, Icono, label, badge }) => {
        const act = pathname === ruta
        return (
          <button key={ruta} onClick={() => navigate(ruta)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 min-h-[56px] relative transition-colors ${act ? 'text-primary' : 'text-gray-500 active:text-gray-300'}`}>
            <Icono size={22} strokeWidth={act ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
            {badge > 0 && (
              <span className="absolute top-1.5 right-4 bg-red-600 text-white text-[9px] font-black rounded-full min-w-[18px] h-4.5 flex items-center justify-center px-1 border-2 border-dark2 animate-pulse">
                {badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

import { NavLink } from 'react-router-dom';
import { Home, Calendar, Image as ImageIcon, LayoutGrid, Megaphone, Share2, Palette, CheckSquare, ListTodo, PieChart, Settings } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/calendar', icon: Calendar, label: 'Calendario' },
    { to: '/posts', icon: LayoutGrid, label: 'Publicaciones' },
    { to: '/campaigns', icon: Megaphone, label: 'Campañas' },
    { to: '/library', icon: ImageIcon, label: 'Biblioteca Visual' },
    { to: '/profiles', icon: Share2, label: 'Perfiles Sociales' },
    { to: '/brand', icon: Palette, label: 'Activos de Marca' },
    { to: '/approvals', icon: CheckSquare, label: 'Aprobaciones' },
    { to: '/pending', icon: ListTodo, label: 'Pendientes' },
    { to: '/reports', icon: PieChart, label: 'Reportes' },
    { to: '/settings', icon: Settings, label: 'Configuración' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/assets/brand-core/StreetBoss-Isotipo-Circular.png" alt="SB" style={{borderRadius: '50%'}} />
        STREETBOSS
      </div>
      <nav style={{display: 'flex', flexDirection: 'column'}}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <l.icon size={18} />
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

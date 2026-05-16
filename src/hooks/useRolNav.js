import { useNavigate, useParams } from 'react-router-dom'

export function useRolNav() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const rol = window.location.pathname.split('/')[2] || 'mesero'
  const base = `/${slug}/${rol}`

  return {
    irAMesas: () => navigate(`/${slug}/${rol === 'admin' ? 'admin/mesero' : 'mesero'}`),
    irAPedido: (mesa) => navigate(`/${slug}/${rol}/pedido/${mesa}`),
    irACocina: () => navigate(`/${slug}/cocina`),
    irACobro: (mesa) => navigate(`/${slug}/${rol}/cobro/${mesa}`),
    irAConfig: () => navigate(`/${slug}/config`),
    irAReporte: () => navigate(`/${slug}/reporte`),
    irAAdmin: () => navigate(`/${slug}/admin`),
    irASuperAdmin: () => navigate('/superadmin'),
    slug, rol, base,
  }
}

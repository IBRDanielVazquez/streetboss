import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Executive Dashboard</div>
        <div style={{fontSize: '14px', color: 'var(--text-gray)'}}>Social Command Center V1.0</div>
      </div>
      <div className="scroll-area">
        <div className="dashboard-metrics">
          <div className="metric-card"><div className="metric-value">7</div><div className="metric-label">Publicaciones Planeadas (S1)</div></div>
          <div className="metric-card"><div className="metric-value">7</div><div className="metric-label">Publicaciones Listas</div></div>
          <div className="metric-card"><div className="metric-value">28</div><div className="metric-label">Activos Institucionales</div></div>
          <div className="metric-card"><div className="metric-value">0</div><div className="metric-label">Bloqueos</div></div>
        </div>

        <div className="grid grid-cols-2">
          <div className="card">
            <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><AlertCircle size={18} color="var(--street-orange)"/> Próximas Acciones</h3>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              <li style={{padding: '12px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between'}}><span>Configurar perfil en Instagram</span> <button className="btn">Ir</button></li>
              <li style={{padding: '12px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between'}}><span>Revisar copys de P01-P07</span> <button className="btn">Ir</button></li>
              <li style={{padding: '12px 0', display: 'flex', justifyContent: 'space-between'}}><span>Aprobar lanzamiento Semana 1</span> <button className="btn">Ir</button></li>
            </ul>
          </div>
          
          <div className="card">
            <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><CheckCircle size={18} color="#48bb78"/> Resumen de Plataformas</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'X'].map(p => (
                <div key={p} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--boss-charcoal)', borderRadius: '6px'}}>
                  <span style={{fontWeight: 600}}>{p}</span>
                  <span className="chip orange">Pendiente de Configurar</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

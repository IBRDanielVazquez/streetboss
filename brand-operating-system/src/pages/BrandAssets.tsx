export default function BrandAssets() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Activos de Marca Oficiales</div>
      </div>
      <div className="scroll-area">
        <div className="card" style={{marginBottom: '24px'}}>
          <h2 style={{color: 'var(--street-orange)', marginTop: 0}}>LEY ABSOLUTA (Documentada)</h2>
          <p>El <strong>Logo Horizontal Completo (con Tagline)</strong> es el activo de máxima autoridad. Debe usarse para portadas, publicitarios y piezas principales de manera FUERTE y predominante.</p>
        </div>
        <div className="grid grid-cols-2">
          <div className="card">
            <h3>Logo Horizontal Principal</h3>
            <img src="/assets/brand-core/StreetBoss-Logo-Horizontal.png" style={{width: '100%', background: '#000', padding: '20px', borderRadius: '8px'}}/>
            <p style={{fontSize: '12px', color: 'var(--text-gray)'}}>Uso: Portadas, headers, piezas principales.</p>
          </div>
          <div className="card">
            <h3>Isotipo Circular</h3>
            <img src="/assets/brand-core/StreetBoss-Isotipo-Circular.png" style={{width: '150px', background: '#000', padding: '20px', borderRadius: '50%'}}/>
            <p style={{fontSize: '12px', color: 'var(--text-gray)'}}>Uso: Avatares de redes sociales y espacios mínimos cuadrados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

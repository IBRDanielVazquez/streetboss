import postsData from '../data/posts.json';

export default function Posts() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Fichas CRM de Publicaciones</div>
      </div>
      <div className="scroll-area">
        <div className="grid">
          {postsData.map(p => (
            <div key={p.id} className="card" style={{display: 'flex', gap: '24px'}}>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
                    <span className="chip orange">{p.id}</span>
                    <h2 style={{margin: 0}}>{p.title}</h2>
                  </div>
                  <span className="chip gray">{p.status}</span>
                </div>
                <div className="grid grid-cols-2" style={{gap: '12px', marginTop: '16px'}}>
                  <div><strong>Red:</strong> {p.network}</div>
                  <div><strong>Formato:</strong> {p.format}</div>
                </div>
                <div style={{marginTop: '20px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px'}}>
                  <strong>Copy Principal:</strong><br/>
                  <span style={{color: 'var(--text-gray)', whiteSpace: 'pre-wrap'}}>{p.copy}</span>
                </div>
                <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                   <button className="btn primary" onClick={() => {navigator.clipboard.writeText(p.copy); alert('Copy copiado!');}}>Copiar Copy</button>
                   <button className="btn">Aprobar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

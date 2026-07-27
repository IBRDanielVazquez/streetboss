import { useState } from 'react';
import postsData from '../data/posts.json';
import { ExternalLink } from 'lucide-react';

export default function VisualLibrary() {
  const [filter, setFilter] = useState('all');
  
  const platforms = [...new Set(postsData.map(a => a.network))];
  
  const filtered = filter === 'all' ? postsData : postsData.filter(a => a.network === filter || a.format === filter);

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="topbar">
        <div className="page-title">Biblioteca Visual</div>
        <div style={{display: 'flex', gap: '10px'}}>
          <select className="input" style={{width: '200px'}} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Todas las plataformas</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="scroll-area">
        <div className="grid grid-cols-4">
          {filtered.map((a, i) => (
            <div key={i} className="card asset-card" style={{padding: 0}}>
              <div className="asset-info">
                <div className="chip orange" style={{marginBottom: '10px'}}>{a.format}</div>
                <div className="asset-title">{a.id}</div>
                <div className="asset-meta">Plataforma: {a.network}<br/>Dim: {a.resolution}</div>
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                  <span className="btn" style={{flex: 1, justifyContent: 'center', textDecoration: 'none'}}>{a.filename}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

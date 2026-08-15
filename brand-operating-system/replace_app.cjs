const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add useCompletedPosts hook
const hookCode = `
const useCompletedPosts = () => {
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sbos_completed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const isDone = prev.includes(id);
      const next = isDone ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('sbos_completed', JSON.stringify(next));
      return next;
    });
  };
  return { completed, toggleComplete };
};
`;
code = code.replace(/import '\.\/index\.css';/, "import './index.css';\n" + hookCode);

// 2. Remove GenericNetworkView
code = code.replace(/const GenericNetworkView = \(\) => \{[\s\S]*?^};\n/m, '');

// 3. Update NetworkView to always use CalendarView
code = code.replace(/const NetworkView = \(\) => \{[\s\S]*?^};\n/m, `const NetworkView = () => {
  const location = useLocation();
  const network = location.pathname.replace('/', '') || 'Instagram';
  const profile = profilesData.find(p => p.network.toLowerCase() === network.toLowerCase());
  const posts = postsData.filter(p => p.network.toLowerCase() === network.toLowerCase());
  return <CalendarView network={network} profile={profile} posts={posts} />;
};
`);

// 4. Update CalendarView
// Change mainTab from 'calendario' to 'pendientes' default.
code = code.replace(/const \[mainTab, setMainTab\] = useState\('calendario'\);/, `const [mainTab, setMainTab] = useState('pendientes');\n  const { completed, toggleComplete } = useCompletedPosts();`);

// Change tabs in CalendarView
code = code.replace(/<div className="tabs">[\s\S]*?<\/div>/, `<div className="tabs">
        <div className={\`tab \${mainTab==='pendientes'?'active':''}\`} onClick={() => setMainTab('pendientes')}>Pendientes</div>
        <div className={\`tab \${mainTab==='realizados'?'active':''}\`} onClick={() => setMainTab('realizados')}>Realizados</div>
        <div className={\`tab \${mainTab==='perfil'?'active':''}\`} onClick={() => setMainTab('perfil')}>Perfil & Bios</div>
      </div>`);

// Update ordered logic to filter by pend/realizados
code = code.replace(/const ordered = useMemo\(\(\) => \{([\s\S]*?)return list\.sort\(chronoSort\);\n  \}, \[posts, fCat, fFormat\]\);/, `const ordered = useMemo(() => {
    let list = [...posts];
    if (fCat !== 'all') list = list.filter((p: any) => categoryOf(p) === fCat);
    if (fFormat !== 'all') list = list.filter((p: any) => p.format === fFormat);
    if (mainTab === 'pendientes') list = list.filter((p: any) => !completed.includes(p.id));
    if (mainTab === 'realizados') list = list.filter((p: any) => completed.includes(p.id));
    return list.sort(chronoSort);
  }, [posts, fCat, fFormat, mainTab, completed]);`);

// Change the condition for rendering calendar (now checking 'pendientes' or 'realizados')
code = code.replace(/\{mainTab === 'calendario' && \(/, `{['pendientes', 'realizados'].includes(mainTab) && (`);

// Modify the ig-card to include checkbox and remove dates
code = code.replace(/<div className="ig-card-idrow">\s*<span className="ig-card-id">\{num\(post\)\}<\/span>/, `<div className="ig-card-idrow">
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <input 
                            type="checkbox" 
                            checked={completed.includes(post.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleComplete(post.id);
                            }}
                            style={{width:'18px', height:'18px', cursor:'pointer'}}
                          />
                          <span className="ig-card-id">{num(post)}</span>
                        </div>`);

code = code.replace(/<div className="ig-card-when">[\s\S]*?<\/div>/, ``);

fs.writeFileSync('src/App.tsx', code);

import os

search_terms = ['sepomex', 'postal', 'cp', 'colonia', 'municipio', 'estado', 'cobertura']
exclude_dirs = {'.git', 'node_modules', 'dist', '.next', '.vercel', 'streetboss_ARCHIVED_DO_NOT_USE'}
exclude_extensions = {'.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css', '.svg', '.png', '.jpg', '.ico', '.map', '.cjs', '.mjs'}

for root, dirs, files in os.walk('/Users/danielvazquez/Proyectos'):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    
    for f in files:
        f_lower = f.lower()
        if any(f_lower.endswith(ext) for ext in exclude_extensions):
            continue
            
        if any(term in f_lower for term in search_terms):
            print(os.path.join(root, f))

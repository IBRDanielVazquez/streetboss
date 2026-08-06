import React from 'react'

export default function VersionFooterBadge({ clientId, userId }) {
  const commitHash = 'cf4fb01'
  const buildDate = '2026-08-06 17:09 UTC'
  const appVersion = 'v3.0.0'
  const environment = window.location.hostname.includes('streetboss.com.mx')
    ? 'Producción (streetboss.com.mx)'
    : window.location.hostname.includes('vercel.app')
      ? 'Vercel Preview / Subdominio'
      : 'Desarrollo Local'
  
  const deploymentId = 'dpl_38E6zLPYJfMZV2FwrD9qQJuo936S'

  return (
    <footer className="mt-8 pt-4 border-t border-white/5 text-[10px] font-mono text-gray-500 flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#0A0B0E]/80 rounded-xl">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bg-[#FF4B00]/10 text-[#FF6A1A] px-2 py-0.5 rounded font-bold">
          {appVersion} ({commitHash})
        </span>
        <span>Build: {buildDate}</span>
        <span>Entorno: <strong className="text-gray-300">{environment}</strong></span>
      </div>

      <div className="flex items-center gap-3 flex-wrap text-gray-400">
        <span>Cliente: <strong className="text-emerald-400">{clientId || 'global'}</strong></span>
        <span>Usuario: <strong>{userId || 'anon_b2b'}</strong></span>
        <span className="text-gray-600">Deploy: {deploymentId}</span>
      </div>
    </footer>
  )
}

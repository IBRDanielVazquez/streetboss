import { useState } from 'react'
import { Clock3, ExternalLink, Maximize2, Play, Video } from 'lucide-react'
import { TUTORIALS } from '../data/tutorials'

function TutorialPlayer({ tutorial }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-2xl">
      <div className="aspect-[886/1920] max-h-[72vh] w-full bg-black sm:aspect-video">
        <video
          key={tutorial.id}
          className="h-full w-full object-contain"
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          playsInline
          preload="metadata"
          onContextMenu={event => event.preventDefault()}
          aria-label={`Tutorial ${tutorial.id}: ${tutorial.title}`}
        >
          <source src={tutorial.videoUrl} type="video/mp4" />
          Tu navegador no puede reproducir este video.
        </video>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#14161F] px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF6A1A]">Tutorial {tutorial.id}</p>
          <h3 className="truncate text-sm font-black text-white">{tutorial.title}</h3>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-white/50"><Maximize2 size={13} /> Pantalla completa</span>
      </div>
    </div>
  )
}

export default function TutorialLibrary() {
  const [selectedId, setSelectedId] = useState(null)
  const selectedTutorial = TUTORIALS.find(tutorial => tutorial.id === selectedId)

  return (
    <section className="space-y-5 animate-fade-in">
      <div className="overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 via-[#14161F] to-[#14161F] p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-700 text-white shadow-lg"><Video size={25} /></span>
        <h2 className="mt-4 text-2xl font-black text-white">Tutoriales</h2>
        <p className="mt-1 text-sm text-white/60">Aprende a configurar tu StreetBoss paso a paso.</p>
      </div>

      {selectedTutorial ? <TutorialPlayer tutorial={selectedTutorial} /> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TUTORIALS.map(tutorial => (
          <button
            key={tutorial.id}
            type="button"
            onClick={() => setSelectedId(tutorial.id)}
            className={`group flex min-h-24 items-center gap-4 rounded-[1.35rem] border p-4 text-left transition-all active:scale-[0.98] ${selectedId === tutorial.id ? 'border-cyan-400/50 bg-cyan-500/15' : 'border-white/10 bg-[#14161F] hover:bg-white/[0.07]'}`}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-700 text-lg font-black text-white shadow-lg">
              {tutorial.id}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-white">{tutorial.title}</span>
              <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-white/45"><Clock3 size={12} /> {tutorial.duration}</span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-[#FF4B00]"><Play size={17} fill="currentColor" /></span>
          </button>
        ))}
      </div>

      <p className="flex items-center justify-center gap-1 text-center text-[10px] text-white/35"><ExternalLink size={11} /> Los tutoriales también cuentan con enlaces públicos para compartir.</p>
    </section>
  )
}

export { TutorialPlayer }

import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, PlayCircle } from 'lucide-react'
import { getTutorialById } from '../data/tutorials'
import { TutorialPlayer } from '../components/TutorialLibrary'

export default function TutorialPublic() {
  const { tutorialId } = useParams()
  const tutorial = getTutorialById(tutorialId)

  if (!tutorial) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0D0E12] px-5 text-white">
        <div className="text-center"><h1 className="text-2xl font-black">Tutorial no encontrado</h1><Link to="/" className="mt-5 inline-block text-[#FF6A1A]">Volver a StreetBoss</Link></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0E12] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-xs font-black text-white/60 hover:text-white"><ArrowLeft size={16} /> StreetBoss</Link>
          <span className="flex items-center gap-2 rounded-full border border-[#FF4B00]/30 bg-[#FF4B00]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#FF6A1A]"><PlayCircle size={14} /> Tutorial oficial</span>
        </header>
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6A1A]">Tutorial {tutorial.id}</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">{tutorial.title}</h1>
          <p className="mt-2 text-sm text-white/55">Aprende a configurar tu StreetBoss paso a paso.</p>
        </div>
        <TutorialPlayer tutorial={tutorial} />
      </div>
    </main>
  )
}

import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProofSection } from '@/components/landing/SocialProofSection'
import { SavingsCalculator } from '@/components/landing/SavingsCalculator'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { ProductDemoSection } from '@/components/landing/ProductDemoSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'

export const metadata = {
  title: 'StreetBoss | Tu Menú Digital. Tus Ganancias.',
  description: 'Sistema de pedidos por WhatsApp para restaurantes. Sin comisiones, envíos GPS exactos. Vende directo sin pagar 30% a las apps.',
  openGraph: {
    title: 'StreetBoss | Tu Menú Digital. Tus Ganancias.',
    description: 'Sistema de pedidos por WhatsApp para restaurantes sin comisiones.',
    url: 'https://streetboss.com.mx',
    siteName: 'StreetBoss',
    images: [
      {
        url: '/brand/derived/og_image_derived.png',
        width: 1200,
        height: 630,
        alt: 'StreetBoss',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30 selection:text-white">
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <SavingsCalculator />
      <BenefitsSection />
      <ProductDemoSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  )
}

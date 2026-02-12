import { Hero } from '@/components/sections/Hero'
import { Now } from '@/components/sections/Now'
import { Lab } from '@/components/sections/Lab'
import { Journey } from '@/components/sections/Journey'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="flex flex-col gap-12 w-full">
      <Hero />
      <Now />
      <Lab />
      <Journey />
      <Footer />
    </main>
  )
}

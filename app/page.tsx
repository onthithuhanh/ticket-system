import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { FeaturedEvents } from "@/components/featured-events"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center">
          <MainNav />
        
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeaturedEvents />
      </main>
      <Footer />
    </div>
  )
}

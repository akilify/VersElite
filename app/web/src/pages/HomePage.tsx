import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";
import { ExplorePreview } from "@/components/ExplorePreview";
import { HowItWorks } from "@/components/HowItWorks";
import { PlatformStats } from "@/components/PlatformStats";
import { CTABanner } from "@/components/CTABanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export default function HomePage() {
  return (
    <div className="bg-[#0B0B0C] min-h-screen">
      <Header />
      <Hero />
      <FeaturedSection />
      <ExplorePreview />
      <HowItWorks />
      <PlatformStats />
      <CTABanner />
      <Footer />
    </div>
  );
}

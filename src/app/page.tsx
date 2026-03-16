import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import NewsSection from "@/components/sections/NewsSection";
import IntroSection from "@/components/sections/IntroSection";
import UsageGuideSection from "@/components/sections/UsageGuideSection";
import ReservationSection from "@/components/sections/ReservationSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NewsSection />
        <IntroSection />
        <UsageGuideSection />
        <ReservationSection />
      </main>
      <Footer />
    </>
  );
}

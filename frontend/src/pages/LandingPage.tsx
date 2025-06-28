import { CTASection } from "../components/cta-section";
import { DashboardPreview } from "../components/dashboard-preview";
import { FAQ } from "../components/faq";
import { Features } from "../components/features";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Testimonials } from "../components/testimonials";
import { ThemeProvider } from "../components/theme-provider";

const LandingPage = () => {
   return (
    <ThemeProvider defaultTheme="system" storageKey="joblytics-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main>
          <Hero />
          <Features />
          <DashboardPreview />
          <Testimonials />
          <FAQ />
          <CTASection
           />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
export default LandingPage
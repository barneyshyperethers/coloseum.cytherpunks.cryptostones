import { NavBar } from "./components/NavBar";
import { Hero } from "./components/Hero";
import { ArchitectureDiagram } from "./components/ArchitectureDiagram";
import { LiveFeedsGrid } from "./components/LiveFeedsGrid";
import { AgentMarketplace } from "./components/AgentMarketplace";
import { Footer } from "./components/Footer";
import { MobileNav } from "./components/MobileNav";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E8E9ED] relative overflow-x-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0038FF]/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00E0FF]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#0038FF]/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <NavBar />
        <main>
          <Hero />
          <ArchitectureDiagram />
          <LiveFeedsGrid />
          <AgentMarketplace />
        </main>
        <Footer />
        <MobileNav />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 224, 255, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 224, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>
    </div>
  );
}

import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Sound } from "./components/Sound";
import { Structure } from "./components/Structure";
import { Finishes } from "./components/Finishes";
import { Specs } from "./components/Specs";
import { Footer } from "./components/Footer";
import { BookingPanel } from "./components/BookingPanel";
import { BookingProvider } from "./components/booking/booking";

export default function App() {
  return (
    <BookingProvider>
      <a href="#main" className="skip-link">
        跳到主要内容
      </a>

      {/* film grain + vignette */}
      <div aria-hidden="true" className="noise-layer pointer-events-none fixed inset-0 z-[6]" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(0,0,0,0.32))]"
      />

      <Nav />
      <main id="main">
        <Hero />
        <Sound />
        <Structure />
        <Finishes />
        <Specs />
      </main>
      <Footer />
      <BookingPanel />
    </BookingProvider>
  );
}

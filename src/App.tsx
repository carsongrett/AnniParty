import { useEffect } from "react";
import { Celebration } from "./components/Celebration";
import { EventDetails } from "./components/EventDetails";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { RSVPSection } from "./components/RSVPSection";
import { event } from "./config/event";

export default function App() {
  useEffect(() => {
    document.title = `${event.name} · ${event.coupleNames}`;
  }, []);

  return (
    <div className="min-h-svh bg-ivory font-sans text-ink antialiased">
      <Header />
      <main id="content">
        <Hero />
        <Celebration />
        <EventDetails />
        <Gallery />
        <FAQ />
        <RSVPSection />
      </main>
      <Footer />
    </div>
  );
}

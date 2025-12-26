
import Hero from './components/Hero';
import About from './components/About';
import Recruitment from './components/Recruitment';
import Innovations from './components/Innovations';
import GlobalPresence from './components/GlobalPresence';
import ScientificIntegrity from './components/ScientificIntegrity';
import Contact from './components/Contact';
import Footer from '../../components/feature/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Recruitment />
      <Innovations />
      <GlobalPresence />
      <ScientificIntegrity />
      <Contact />
      <Footer />
    </div>
  );
}

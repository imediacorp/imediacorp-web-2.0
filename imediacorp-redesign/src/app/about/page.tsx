import Image from 'next/image';
import bryanPic from '../../../bryan.png';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Gradient hero to match other pages */}
      <section className="bg-gradient-to-b from-[#001F3F] to-white text-white px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-futura mb-3">About Intermedia Communications Corp.</h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          We balance innovation across diagnostics and creativity. With products like CHADD/HDPD and Rhapsode, we build
          tools that help teams make better decisions and craft better stories. Headquartered globally with offices in
          Toronto, Belek, and Birkirkara, we collaborate across time zones to deliver meaningful technology.
        </p>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        {/* Vision Statement */}
        <div className="p-6 md:p-8 rounded-lg border bg-white/60 mb-10">
          <h2 className="text-2xl font-semibold mb-3">Vision</h2>
          <p className="text-gray-700">
            Balance truth and creativity to help people and organizations see clearly and build wisely. Inspired by the
            Feather of Ma’at, our vision is to bring equilibrium to complex systems—diagnostics that are rigorous yet
            humane, and creative tools that are powerful yet calm. We design technologies that harmonize analysis and
            expression, so better decisions and better stories become the natural outcome.
          </p>
        </div>

        {/* Core pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-700">Balance, truth, and clarity—rooted in the Feather of Ma'at—guide our work.
              We create systems that are rigorous yet human-centered.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Our Approach</h3>
            <p className="text-gray-700">Minimalist, fast, accessible. We use modern frameworks and thoughtful design
              to deliver calm, effective experiences.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Global Presence</h3>
            <p className="text-gray-700">Toronto · Belek · Birkirkara. We embrace diverse perspectives to build
              adaptable solutions.</p>
          </div>
        </div>

        {/* Team */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-4">Leadership</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Bryan */}
            <div className="p-6 border rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Image src={bryanPic} alt="Bryan David Persaud" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="text-lg font-semibold">Bryan David Persaud</div>
                  <div className="text-sm text-gray-600">Founder & Systems Architect</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                A polymathic engineer and designer, Bryan leads platform architecture for CHADD/HDPD and Rhapsode.
                His focus is on bringing structure to complexity—graph reasoning, clean interfaces, and humane
                automation that serves real creative and analytical work.
              </p>
              <ul className="flex flex-wrap gap-2 text-xs">
                <li className="px-2 py-1 rounded bg-gray-100">Neo4j & graph thinking</li>
                <li className="px-2 py-1 rounded bg-gray-100">Systems design</li>
                <li className="px-2 py-1 rounded bg-gray-100">DX & accessibility</li>
              </ul>
            </div>

            {/* Leslie */}
            <div className="p-6 border rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-lg font-semibold">L</div>
                <div>
                  <div className="text-lg font-semibold">Leslie (Isis)</div>
                  <div className="text-sm text-gray-600">Creative Director & Research Lead</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Leslie unites semiotics, mythology, and human-computer interaction to shape Intermedia’s narrative and
                product sensibilities. Drawing on the Isis archetype—care, restoration, and insight—she guides brand
                storytelling and research so the technology communicates with clarity and grace.
              </p>
              <ul className="flex flex-wrap gap-2 text-xs">
                <li className="px-2 py-1 rounded bg-gray-100">Design systems</li>
                <li className="px-2 py-1 rounded bg-gray-100">Narrative strategy</li>
                <li className="px-2 py-1 rounded bg-gray-100">HCI research</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <a href="/products" className="bg-[#D4AF37] text-white px-5 py-3 rounded">Explore Products</a>
          <a href="/site-audit" className="px-5 py-3 rounded border">Request a Site Audit</a>
        </div>
      </section>
    </main>
  );
}

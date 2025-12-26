export default function SiteAuditPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-[#001F3F] to-white text-white px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-futura mb-3">Optimize with SiteLint</h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">Request an accessibility and performance audit to elevate your experience.</p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 grid md:grid-cols-2 gap-8">
        <form className="border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input id="name" type="text" className="w-full border rounded px-3 py-2" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" className="w-full border rounded px-3 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="url">Website URL</label>
            <input id="url" type="url" className="w-full border rounded px-3 py-2" placeholder="https://" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="notes">Notes</label>
            <textarea id="notes" className="w-full border rounded px-3 py-2 h-28" placeholder="Goals, concerns, or specific pages to audit" />
          </div>
          <button type="button" className="bg-[#D4AF37] text-white px-4 py-2 rounded">Request Audit</button>
          <p className="text-xs text-gray-500">We’ll follow up with next steps and an estimate.</p>
        </form>

        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Dashboard Preview</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-green-600">98</div>
                <div className="text-xs text-gray-600">Performance</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-blue-600">100</div>
                <div className="text-xs text-gray-600">Accessibility</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-amber-600">92</div>
                <div className="text-xs text-gray-600">Best Practices</div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Benefits</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Actionable recommendations</li>
              <li>Accessibility improvements (WCAG)</li>
              <li>SEO and performance insights</li>
              <li>Continuous monitoring options</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

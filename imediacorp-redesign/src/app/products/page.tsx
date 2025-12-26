import { useState } from 'react';

export default function ProductsPage() {
  // Minimal interactivity; safe for server components via client directive not used. Keep static sections instead of tabs.
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-[#001F3F] to-white text-white px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-futura mb-3">Products</h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">Diagnostics and creativity in balance. Explore CHADD/HDPD and Rhapsode.</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">CHADD/HDPD</h2>
          <p className="text-gray-700 mb-4">A cross-industry diagnostic protocol and system providing structured assessments and actionable insights.</p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Multi-domain diagnostics</li>
            <li>Scalable reporting</li>
            <li>API-first architecture</li>
          </ul>
          <div className="flex gap-3">
            <a href="#" className="bg-[#D4AF37] text-white px-4 py-2 rounded">View Demo</a>
            <a href="#pricing" className="px-4 py-2 rounded border">Pricing</a>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Rhapsode</h2>
          <p className="text-gray-700 mb-4">An AI-assisted writing tool for long-form fiction workflows, collaboration, and revision.</p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Outline-to-draft pipelines</li>
            <li>Collaboration and versioning</li>
            <li>Context-aware suggestions</li>
          </ul>
          <div className="flex gap-3">
            <a href="#" className="bg-[#D4AF37] text-white px-4 py-2 rounded">Start Writing</a>
            <a href="#pricing" className="px-4 py-2 rounded border">Pricing</a>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 pb-16">
        <h3 className="text-2xl font-semibold mb-6">Pricing</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h4 className="text-xl font-semibold mb-2">Starter</h4>
            <p className="text-gray-700 mb-4">For individuals exploring our tools.</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Basic features</li>
              <li>Email support</li>
            </ul>
            <button className="bg-[#D4AF37] text-white px-4 py-2 rounded w-full">Choose</button>
          </div>
          <div className="border rounded-lg p-6">
            <h4 className="text-xl font-semibold mb-2">Professional</h4>
            <p className="text-gray-700 mb-4">Teams needing collaborative workflows and diagnostics.</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Advanced features</li>
              <li>Priority support</li>
            </ul>
            <button className="bg-[#D4AF37] text-white px-4 py-2 rounded w-full">Choose</button>
          </div>
          <div className="border rounded-lg p-6">
            <h4 className="text-xl font-semibold mb-2">Enterprise</h4>
            <p className="text-gray-700 mb-4">Custom integrations and security for large organizations.</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Custom SLAs</li>
              <li>Dedicated support</li>
            </ul>
            <button className="bg-[#D4AF37] text-white px-4 py-2 rounded w-full">Contact Sales</button>
          </div>
        </div>
      </section>
    </main>
  );
}

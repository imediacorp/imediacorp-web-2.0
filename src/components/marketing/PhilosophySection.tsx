/**
 * Philosophy Section Component
 * Displays Ma'at philosophy explanation
 */

export function PhilosophySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
            What is Ma'at?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ma'at is an ancient Egyptian concept representing truth, balance, order, harmony, law,
            morality, and justice. At imediacorp, we apply these principles to modern technology
            and business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Balance */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">⚖️</div>
            <h3 className="text-2xl font-serif font-bold text-blue-900 mb-4">Balance</h3>
            <p className="text-gray-700 mb-4">
              We balance scientific rigor with creative innovation, stability with growth, and
              purpose with profit. Every decision considers multiple perspectives and seeks
              equilibrium.
            </p>
            <div className="bg-white rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600 italic">
                "Balance is not about compromise—it's about finding the optimal harmony between
                competing forces."
              </p>
            </div>
          </div>

          {/* Unity */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4">Unity</h3>
            <p className="text-gray-700 mb-4">
              Our universal S/Q/U/D framework unifies diagnostics across all domains. We bring
              together diverse teams, technologies, and perspectives into a cohesive whole.
            </p>
            <div className="bg-white rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600 italic">
                "Unity is strength—when we work together, we achieve more than the sum of our
                parts."
              </p>
            </div>
          </div>

          {/* Harmony */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">🎵</div>
            <h3 className="text-2xl font-serif font-bold text-green-900 mb-4">Harmony</h3>
            <p className="text-gray-700 mb-4">
              Like musical harmony, our systems work in concert. Each component supports the
              others, creating a symphony of functionality that serves people effectively.
            </p>
            <div className="bg-white rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600 italic">
                "Harmony emerges when all elements work together in perfect coordination."
              </p>
            </div>
          </div>
        </div>

        {/* How Philosophy Shapes Products */}
        <div className="bg-gray-50 rounded-lg p-8 md:p-12">
          <h3 className="text-2xl font-serif font-bold text-blue-900 mb-6 text-center">
            How Ma'at Shapes Our Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Universal Framework</h4>
              <p className="text-gray-600">
                The same S/Q/U/D framework across all domains reflects unity—one language for all
                diagnostics.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Tools Serve People</h4>
              <p className="text-gray-600">
                AI amplifies human judgment rather than replacing it—balance between automation and
                human insight.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Scientific Integrity</h4>
              <p className="text-gray-600">
                Every innovation must withstand scientific scrutiny—harmony between innovation and
                rigor.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Sustainable Growth</h4>
              <p className="text-gray-600">
                Profits follow purpose—balance between business success and meaningful impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


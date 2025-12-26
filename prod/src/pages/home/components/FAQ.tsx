import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What makes CHADD/HDPD™ different from traditional Revolutionary Universal Diagnostic Algorithm methods?",
      answer: "CHADD/HDPD™ represents a revolutionary approach to Revolutionary Universal Diagnostic Algorithm by integrating multiple assessment modalities including behavioral analysis, cognitive testing, and neurological indicators. Unlike traditional methods that rely primarily on subjective observations, our platform provides objective, data-driven insights with unprecedented accuracy and consistency."
    },
    {
      question: "How does Rhapsode™ Creative Suite enhance therapeutic outcomes?",
      answer: "Rhapsode™ leverages the therapeutic power of creative expression through digital innovation. Our platform provides adaptive creative interfaces that respond to individual needs, tracks therapeutic progress in real-time, and offers personalized intervention protocols. This multi-sensory approach has shown significant improvements in engagement and treatment outcomes for neurodivergent individuals."
    },
    {
      question: "What applications does the Composite Patient Generator™ have in medical research?",
      answer: "The Composite Patient Generator™ creates sophisticated virtual patient profiles for multiple applications including clinical research, medical training, treatment protocol development, and drug testing simulations. It enables researchers to model complex patient scenarios, test interventions safely, and develop more effective treatment strategies without compromising patient privacy or safety."
    },
    {
      question: "Are these technologies available for clinical use?",
      answer: "Our technologies are currently in various stages of development and patent application. We are working with regulatory bodies and clinical partners to ensure proper validation and approval processes. We expect to begin limited clinical trials and pilot programs in the near future, with broader availability following successful validation."
    },
    {
      question: "How can healthcare providers partner with Intermedia Communications Corp?",
      answer: "We welcome partnerships with healthcare providers, research institutions, and medical organizations. Potential collaboration opportunities include clinical trials, research partnerships, technology licensing, and pilot program participation. Contact us to discuss how our innovations can benefit your organization and patients."
    },
    {
      question: "What is the cooperative model and how does it benefit stakeholders?",
      answer: "Our cooperative model ensures that all stakeholders - researchers, developers, healthcare providers, and patients - have a voice in our innovation process. This democratic approach to medical research ensures that developments are truly patient-centered, ethically sound, and practically applicable. Members share in both decision-making and the benefits of our collective success."
    },
    {
      question: "How do you ensure data privacy and security in your platforms?",
      answer: "Data privacy and security are fundamental to our platform design. We implement enterprise-grade encryption, comply with HIPAA and international privacy regulations, use anonymized data processing, and maintain strict access controls. Our systems are designed with privacy-by-design principles, ensuring patient data is protected at every level."
    },
    {
      question: "What research validates the effectiveness of your technologies?",
      answer: "Our technologies are built on extensive research foundations including peer-reviewed studies, clinical validations, and collaborative research with leading medical institutions. We maintain rigorous scientific standards and are committed to publishing our findings in respected medical journals. Detailed research documentation is available upon request for qualified partners."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate Schema.org FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e3a5f]">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get answers to common questions about our innovative medical technologies and research initiatives
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold text-[#1e3a5f] pr-4">
                      {faq.question}
                    </h3>
                    <div className={`w-8 h-8 flex items-center justify-center text-[#d4af37] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                      <i className="ri-arrow-down-s-line text-2xl"></i>
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
                <p className="text-lg mb-6 text-gray-200">
                  Our team is here to provide detailed information about our technologies and research initiatives
                </p>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-[#d4af37] text-[#1e3a5f] rounded-full font-semibold hover:bg-[#c19b2f] transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
                >
                  Contact Our Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

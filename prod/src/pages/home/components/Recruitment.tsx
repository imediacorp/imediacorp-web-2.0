import RecruitmentForm from './RecruitmentForm';

export default function Recruitment() {
  const benefits = [
    {
      icon: 'ri-team-line',
      title: 'Democratic Ownership',
      description: 'Equal voice in company decisions and profit sharing based on contribution'
    },
    {
      icon: 'ri-funds-line',
      title: 'Fair Compensation',
      description: 'Competitive salaries with transparent pay scales and performance bonuses'
    },
    {
      icon: 'ri-time-line',
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible hours and work-life balance'
    },
    {
      icon: 'ri-graduation-cap-line',
      title: 'Continuous Learning',
      description: 'Professional development budget and access to cutting-edge research'
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'Health & Wellness',
      description: 'Comprehensive health coverage and mental wellness support'
    },
    {
      icon: 'ri-global-line',
      title: 'Global Impact',
      description: 'Work on projects that make a real difference in communities worldwide'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join Our Cooperative
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Be part of a revolutionary research organization where every member has a voice, shares in success, and contributes to meaningful scientific advancement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
                <i className={`${benefit.icon} text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
              Ready to Make a Difference?
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We're looking for passionate researchers, developers, analysts, and innovators who share our vision of democratizing scientific research. Whether you're an experienced professional or just starting your career, if you're committed to excellence and collaborative innovation, we want to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <RecruitmentForm />
              <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 whitespace-nowrap cursor-pointer">
                Learn More About Us
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                We are an equal opportunity employer committed to diversity and inclusion
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-purple-600">
                    <i className="ri-check-line"></i>
                  </div>
                  <span>Remote-First</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-purple-600">
                    <i className="ri-check-line"></i>
                  </div>
                  <span>Flexible Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-purple-600">
                    <i className="ri-check-line"></i>
                  </div>
                  <span>Competitive Benefits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-purple-600">
                    <i className="ri-check-line"></i>
                  </div>
                  <span>Growth Opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628]">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f4d03f]" style={{ fontFamily: '"Pacifico", serif' }}>
              Intermedia
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{profile?.full_name}</p>
              <p className="text-xs text-gray-400">{profile?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-sm whitespace-nowrap"
            >
              <i className="ri-logout-box-line mr-2"></i>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-400">Access your CHADD diagnostic tools and research resources</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                <i className="ri-file-chart-line text-2xl text-[#d4af37]"></i>
              </div>
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">3</h3>
            <p className="text-sm text-gray-400">Projects</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-database-2-line text-2xl text-blue-400"></i>
              </div>
              <span className="text-xs text-gray-400">Available</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">12</h3>
            <p className="text-sm text-gray-400">Datasets</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-check-double-line text-2xl text-green-400"></i>
              </div>
              <span className="text-xs text-gray-400">Completed</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">8</h3>
            <p className="text-sm text-gray-400">Analyses</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-2xl text-purple-400"></i>
              </div>
              <span className="text-xs text-gray-400">This Month</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">24h</h3>
            <p className="text-sm text-gray-400">Compute Time</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tools */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Your Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CHADD Diagnostic Suite */}
                <Link
                  to="/chadd-diagnostic-suite"
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-pulse-line text-2xl text-[#0a1628]"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                    CHADD Diagnostic Suite
                  </h4>
                  <p className="text-sm text-gray-400">
                    Advanced medical diagnostics with no cherry-picked data
                  </p>
                </Link>

                {/* Rhapsode Creative Suite */}
                <Link
                  to="/rhapsode-creative-suite"
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-palette-line text-2xl text-white"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    Rhapsode Creative Suite
                  </h4>
                  <p className="text-sm text-gray-400">
                    AI-powered creative tools for content generation
                  </p>
                </Link>

                {/* Composite Patient Generator */}
                <Link
                  to="/composite-patient-generator"
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-user-heart-line text-2xl text-white"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    Patient Generator
                  </h4>
                  <p className="text-sm text-gray-400">
                    Generate composite patient data for research
                  </p>
                </Link>

                {/* Fibonacci Cosmology */}
                <Link
                  to="/fibonacci-cosmology"
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-planet-line text-2xl text-white"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    Fibonacci Cosmology
                  </h4>
                  <p className="text-sm text-gray-400">
                    Explore mathematical patterns in nature
                  </p>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-green-400"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Analysis Complete</p>
                    <p className="text-sm text-gray-400">Cardiovascular risk assessment finished</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-upload-cloud-line text-blue-400"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Dataset Uploaded</p>
                    <p className="text-sm text-gray-400">New patient cohort data added</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-file-text-line text-purple-400"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Report Generated</p>
                    <p className="text-sm text-gray-400">Monthly analytics summary available</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Support */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <i className="ri-add-line"></i>
                  New Analysis
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <i className="ri-upload-line"></i>
                  Upload Data
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <i className="ri-download-line"></i>
                  Export Results
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#d4af37] transition-colors"
                >
                  <i className="ri-customer-service-line"></i>
                  <span className="text-sm">Contact Support</span>
                </Link>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#d4af37] transition-colors"
                >
                  <i className="ri-book-open-line"></i>
                  <span className="text-sm">Documentation</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#d4af37] transition-colors"
                >
                  <i className="ri-question-line"></i>
                  <span className="text-sm">FAQ</span>
                </a>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Account</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white font-medium">Professional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                {profile?.organization && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Organization</span>
                    <span className="text-white font-medium">{profile.organization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

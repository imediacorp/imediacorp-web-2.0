import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function StaffDashboard() {
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
            <span className="px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37]/50 rounded-full text-xs text-[#d4af37] font-semibold whitespace-nowrap">
              {profile?.role === 'admin' ? 'ADMIN' : 'STAFF'}
            </span>
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
            Staff Dashboard
          </h2>
          <p className="text-gray-400">Manage research projects, clients, and internal tools</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-2xl text-blue-400"></i>
              </div>
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">247</h3>
            <p className="text-sm text-gray-400">Active Clients</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                <i className="ri-folder-line text-2xl text-[#d4af37]"></i>
              </div>
              <span className="text-xs text-gray-400">Running</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">42</h3>
            <p className="text-sm text-gray-400">Projects</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-line-chart-line text-2xl text-green-400"></i>
              </div>
              <span className="text-xs text-gray-400">This Month</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">1,284</h3>
            <p className="text-sm text-gray-400">Analyses</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-team-line text-2xl text-purple-400"></i>
              </div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">18</h3>
            <p className="text-sm text-gray-400">Team Members</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tools & Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Internal Tools */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Internal Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#f4d03f] rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-pulse-line text-2xl text-[#0a1628]"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                    CHADD Suite
                  </h4>
                  <p className="text-sm text-gray-400">Full diagnostic access</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-palette-line text-2xl text-white"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    Rhapsode Suite
                  </h4>
                  <p className="text-sm text-gray-400">Creative tools access</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-database-2-line text-2xl text-white"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    Data Management
                  </h4>
                  <p className="text-sm text-gray-400">Dataset administration</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-settings-3-line text-2xl text-white"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    System Admin
                  </h4>
                  <p className="text-sm text-gray-400">Platform configuration</p>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Recent Projects</h3>
                <button className="text-sm text-[#d4af37] hover:text-[#f4d03f] transition-colors whitespace-nowrap">
                  View All <i className="ri-arrow-right-line ml-1"></i>
                </button>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">Cardiovascular Risk Study</div>
                        <div className="text-xs text-gray-400">Medical Research</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Toronto General Hospital</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full whitespace-nowrap">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div className="bg-[#d4af37] h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-xs text-gray-400">75%</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">Energy Grid Optimization</div>
                        <div className="text-xs text-gray-400">Energy Systems</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Ontario Power Generation</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full whitespace-nowrap">In Review</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div className="bg-[#d4af37] h-2 rounded-full" style={{ width: '90%' }}></div>
                          </div>
                          <span className="text-xs text-gray-400">90%</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">Financial Risk Assessment</div>
                        <div className="text-xs text-gray-400">Finance</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">TD Bank Group</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full whitespace-nowrap">Planning</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div className="bg-[#d4af37] h-2 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                          <span className="text-xs text-gray-400">25%</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Team */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1628] font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <i className="ri-add-line"></i>
                  New Project
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <i className="ri-user-add-line"></i>
                  Add Client
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <i className="ri-file-chart-line"></i>
                  Generate Report
                </button>
              </div>
            </div>

            {/* Team Status */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Team Online</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a1628] rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Dr. Jane Doe</p>
                    <p className="text-xs text-gray-400">Lead Researcher</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                      MS
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a1628] rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Michael Smith</p>
                    <p className="text-xs text-gray-400">Data Scientist</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                      SK
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a1628] rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Sarah Kim</p>
                    <p className="text-xs text-gray-400">Systems Engineer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">API Status</span>
                  <span className="flex items-center gap-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Database</span>
                  <span className="flex items-center gap-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Compute Cluster</span>
                  <span className="flex items-center gap-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Storage</span>
                  <span className="text-sm text-white">68% Used</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

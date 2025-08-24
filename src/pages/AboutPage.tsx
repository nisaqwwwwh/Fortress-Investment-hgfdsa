import React from 'react';
import nisaLogo from '../assets/nisa-logo.png';
import { ArrowLeft, Building2, Users, Globe, TrendingUp, Award, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Building2, label: 'Active Clients', value: '2,847', color: 'text-blue-400' },
    { icon: TrendingUp, label: 'Successful Trades', value: '45,329', color: 'text-green-400' },
    { icon: Award, label: 'Trading Pairs', value: '127', color: 'text-yellow-400' },
    { icon: Users, label: 'Team Members', value: '94', color: 'text-purple-400' },
  ];

  const focusAreas = [
    'Cryptocurrency Trading',
    'Digital Asset Management',
    'Portfolio Optimization',
    'Risk Management Solutions',
    'Financial Technology Innovation',
  ];

  const keyMarkets = [
    { country: 'United States', flag: '🇺🇸' },
    { country: 'Brazil', flag: '🇧🇷' },
    { country: 'Europe', flag: '🇪🇺' },
    { country: 'Asia', flag: '🇸🇬' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 text-white btn-hover touch-target focus-ring"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">About NISA investment advisor</h1>
            <p className="text-gray-400">Our story and mission</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-2xl mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <img 
               src={nisaLogo}
               alt="NISA investment advisor logo" 
               className="w-16 h-16 rounded-xl object-cover" 
             />
            <div>
              <h2 className="text-3xl font-bold text-white">NISA investment advisor</h2>
                             <div className="flex items-center space-x-4 text-gray-300 mt-2">
                 <div className="flex items-center space-x-1">
                   <MapPin size={16} />
                   <span>United States</span>
                 </div>
                 <div className="flex items-center space-x-1">
                   <Calendar size={16} />
                   <span>Founded 2010 in New York</span>
                 </div>
               </div>
            </div>
          </div>

                     <p className="text-lg text-gray-300 leading-relaxed">
             At NISA Investment Advisors, we leverage our deep expertise in digital asset management and cutting-edge financial technology to provide sophisticated investment solutions. Founded in 2010, we are a trusted financial advisor specializing in cryptocurrency trading, portfolio management, and strategic digital asset allocation. Our teams support individual and institutional clients with advanced trading platforms, risk management tools, and comprehensive financial advisory services across global markets.
           </p>
        </div>

        {/* Key Statistics */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <TrendingUp className="text-yellow-400" size={24} />
            <span>Key Statistics</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl text-center">
                <stat.icon size={32} className={`${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">$2.8B+</div>
              <div className="text-sm text-gray-400">Assets Under Management</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">$1.4B+</div>
              <div className="text-sm text-gray-400">Total Trading Volume</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-sm text-gray-400">Market Coverage</div>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-6">Company Overview</h3>
                     <div className="bg-gray-800 p-6 rounded-xl">
             <p className="text-gray-300 leading-relaxed mb-4">
               NISA Investment Advisors is a leading digital asset management firm with over 14 years of experience in financial markets and cryptocurrency trading. Since our founding in New York in 2010, we have specialized in providing sophisticated trading platforms, portfolio management solutions, and comprehensive financial advisory services to both individual and institutional clients worldwide.
             </p>
             <p className="text-gray-300 leading-relaxed mb-4">
               As of 2025, NISA Investment Advisors manages over $2.8 billion in client assets, serving 2,847 active clients with our advanced trading platforms. Our platform has facilitated over 45,329 successful trades across 127 different cryptocurrency trading pairs, maintaining a consistent track record of performance and reliability.
             </p>
             <p className="text-gray-300 leading-relaxed">
               Our firm maintains a global presence with operations across major financial centers. Our diverse portfolio spans digital assets, traditional securities, and alternative investments, leveraging cutting-edge technology and deep market expertise to deliver superior investment outcomes. NISA Investment Advisors has a dedicated team of 94 professionals, including portfolio managers, quantitative analysts, and technology specialists.
             </p>
           </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="text-gray-900 text-xl" />
                </div>
                <h4 className="text-lg font-semibold">Platform Expansion</h4>
              </div>
              <p className="text-gray-300 mb-4">
                NISA Investment Advisors recently launched our advanced AI-powered trading algorithms and expanded our platform to support 127 cryptocurrency trading pairs, providing clients with enhanced market access and improved execution capabilities.
              </p>
              <a href="#" className="text-yellow-400 hover:underline flex items-center">
                Read the full announcement <ArrowLeft className="ml-2" />
              </a>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <Users className="text-gray-900 text-xl" />
                </div>
                <h4 className="text-lg font-semibold">Regulatory Compliance</h4>
              </div>
              <p className="text-gray-300 mb-4">
                NISA Investment Advisors has successfully completed comprehensive regulatory compliance updates, ensuring full adherence to evolving cryptocurrency regulations and maintaining our commitment to client protection and market integrity.
              </p>
              <a href="#" className="text-yellow-400 hover:underline flex items-center">
                Learn more <ArrowLeft className="ml-2" />
              </a>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <Award className="text-gray-900 text-xl" />
                </div>
                <h4 className="text-lg font-semibold">Industry Recognition</h4>
              </div>
              <p className="text-gray-300 mb-4">
                NISA Investment Advisors has been recognized as a leading digital asset management firm by FinTech Awards 2024, highlighting our innovative approach to cryptocurrency trading and client service excellence.
              </p>
              <a href="#" className="text-yellow-400 hover:underline flex items-center">
                View accolades <ArrowLeft className="ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-6">Investment Focus Areas</h3>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {focusAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Markets */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Globe className="text-blue-400" size={24} />
            <span>Key Markets</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyMarkets.map((market, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl flex items-center space-x-4">
                <div className="text-3xl">{market.flag}</div>
                <div>
                  <div className="text-lg font-semibold text-white">{market.country}</div>
                  <div className="text-sm text-gray-400">Primary investment market</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategic Partnerships */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Users className="text-green-400" size={24} />
            <span>Strategic Partnerships</span>
          </h3>
          <div className="text-center mb-6">
            <p className="text-gray-300">Trusted by leading institutional investors across 40+ countries</p>
            <p className="text-gray-300 mt-2">NISA Investment Advisors emphasizes a client-first approach, working closely with individual and institutional investors to provide transparent, secure, and profitable trading solutions. Our technology partnerships and strategic alliances enable us to deliver cutting-edge financial services across the global digital asset ecosystem.</p>
          </div>

                                <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
             <div className="grid grid-cols-4 gap-6 items-center">
               {/* Row 1 */}
               {/* Accel Partners */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/accel_90x90_1x.png"
                     alt="Accel Partners"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Accel</span>
               </div>

               {/* Partech */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/partech-wbg_90x90_1x.png"
                     alt="Partech"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Partech</span>
               </div>

               {/* IN-Q-TEL */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/iqt_90x90_1x.png"
                     alt="IN-Q-TEL"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">IN-Q-TEL</span>
               </div>

               {/* Palo Alto Networks */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/paloalto_90x90_1x.png"
                     alt="Palo Alto Networks"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Palo Alto</span>
               </div>

               {/* Row 2 */}
               {/* Maersk Growth */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/maersk_90x90_1x.png"
                     alt="Maersk Growth"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Maersk</span>
               </div>

               {/* Fujitsu */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/fujitsu_90x90_1x.png"
                     alt="Fujitsu"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Fujitsu</span>
               </div>

               {/* Tenity */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/tenity-wbg_90x90_1x.png"
                     alt="Tenity"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Tenity</span>
               </div>

               {/* Stanford */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/stanford-university_90x90_1x.png"
                     alt="Stanford University"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Stanford</span>
               </div>

               {/* Row 3 */}
               {/* Microsoft */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/microsoft_90x90_1x.png"
                     alt="Microsoft"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Microsoft</span>
               </div>

               {/* Google */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/google_90x90_1x.png"
                     alt="Google"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Google</span>
               </div>

               {/* Amazon */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/amazon_90x90_1x.png"
                     alt="Amazon"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Amazon</span>
               </div>

               {/* Apple */}
               <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                   <img
                     src="https://cdn.tracxn.com/images/static/homepage/clients/apple_90x90_1x.png"
                     alt="Apple"
                     className="w-full h-full object-contain rounded-lg"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement?.parentElement?.remove();
                     }}
                   />
                 </div>
                 <span className="text-xs text-gray-400 mt-3 text-center">Apple</span>
               </div>
             </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300 font-medium">Trusted by 1,000+ customers worldwide</span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-6">Our Mission</h3>
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 p-6 rounded-xl">
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              At NISA Investment Advisors, we are committed to partnering with exceptional companies and management teams
              to create sustainable value through strategic guidance, operational expertise, and long-term investment
              perspective. Our global network and deep industry knowledge enable us to identify unique opportunities
              and drive transformational growth.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              We emphasize working closely with management teams, fostering transparency, and building strong relationships to achieve sustained growth. 
              As a responsible investor, we are committed to promoting appropriate governance and awareness of impact on society and the environment within our portfolio companies.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
          <div className="bg-gray-800 p-6 rounded-xl">
            <p className="text-gray-300 mb-4">
              Interested in learning more about NISA Investment Advisors or exploring partnership opportunities?
              Our team is here to help. With offices across North America, Europe, Latin America, and Asia, we have local experts ready to assist you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">Global Headquarters</h4>
                <p className="text-gray-300">New York, New York</p>
                <p className="text-gray-400 text-sm">Serving clients since 2010</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">International Presence</h4>
                <p className="text-gray-300">12 countries across 4 continents</p>
                <p className="text-gray-400 text-sm">Local expertise with global resources</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/support')}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;

import React from 'react';
import nisaLogo from '../assets/nisa-logo.png';
import { ArrowLeft, MessageCircle, Phone, Mail, Clock, ExternalLink, Headphones, Shield, HelpCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupportPage = () => {
  const navigate = useNavigate();

  const supportChannels = [
    {
      icon: <MessageCircle size={24} className="text-blue-400" />,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      available: '24/7',
      onClick: () => window.open('https://t.me/your-support-link', '_blank', 'noopener,noreferrer')
    },
    {
      icon: <Mail size={24} className="text-green-400" />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      action: 'Send Email',
      available: 'Response within 24h',
      onClick: () => window.location.href = 'mailto:support@nisainvestmentadvisors.com'
    },
    {
      icon: <Phone size={24} className="text-yellow-400" />,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      action: 'Call Now',
      available: 'Mon-Fri 9AM-6PM EST',
      onClick: () => window.location.href = 'tel:+1-800-NISA-INV'
    }
  ];

  const faqItems = [
    {
      question: 'How do I deposit funds?',
      answer: 'Go to Profile > Deposit, select your preferred network (TRC20, ERC20, or BTC), and follow the instructions to send funds to the provided address.'
    },
    {
      question: 'How long do withdrawals take?',
      answer: 'Withdrawals are manually reviewed for security and typically processed within 24 hours during business days.'
    },
    {
      question: 'What is KYC verification?',
      answer: 'KYC (Know Your Customer) is identity verification required for withdrawals. Upload your government ID and personal information to get verified.'
    },
    {
      question: 'How do I become a VIP member?',
      answer: 'VIP membership is available through our subscription plans. Visit the VIP page to see available tiers and benefits.'
    },
    {
      question: 'Is my money safe?',
      answer: 'Yes, we use bank-grade security measures including cold storage for funds and multi-factor authentication for accounts.'
    }
  ];

  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <Headphones size={24} className="text-yellow-400" />
            <h1 className="text-xl font-bold">Customer Support</h1>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-lg mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={nisaLogo} 
              alt="NISA investment advisor logo" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">How can we help you?</h2>
              <p className="text-gray-300">Our support team is here to assist you 24/7</p>
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <MessageCircle size={20} className="text-yellow-400" />
            <span>Contact Us</span>
          </h3>
          <div className="grid gap-4">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {channel.icon}
                    <div>
                      <h4 className="font-semibold text-white">{channel.title}</h4>
                      <p className="text-sm text-gray-400">{channel.description}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-500">{channel.available}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={channel.onClick}
                    className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center space-x-2"
                  >
                    <span>{channel.action}</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <HelpCircle size={20} className="text-yellow-400" />
            <span>Quick Help</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/profile', { state: { view: 'kyc' } })}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <Shield size={20} className="text-blue-400 mb-2" />
              <h4 className="font-semibold text-white">Identity Verification</h4>
              <p className="text-sm text-gray-400">Complete your KYC</p>
            </button>
            <button
              onClick={() => navigate('/profile', { state: { view: 'deposit' } })}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <FileText size={20} className="text-green-400 mb-2" />
              <h4 className="font-semibold text-white">Deposit Guide</h4>
              <p className="text-sm text-gray-400">Learn how to deposit</p>
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <HelpCircle size={20} className="text-yellow-400" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 text-left hover:bg-gray-700 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-white">{item.question}</span>
                  <div className={`transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-400">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contact */}
        <div className="mt-8 p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield size={20} className="text-red-400" />
            <h4 className="font-semibold text-red-400">Security Emergency</h4>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            If you suspect unauthorized access to your account, contact us immediately.
          </p>
          <button
            onClick={() => window.open('https://t.me/your-emergency-support', '_blank', 'noopener,noreferrer')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Emergency Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

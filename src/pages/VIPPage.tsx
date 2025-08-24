import React from 'react';
import { ArrowLeft, Crown, Star, Zap, Shield, CheckCircle2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VIPLevel } from '../types';

const VIPPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getFullUser, isAuthenticated ? {} : "skip");

  // All bonus-related VIP level fields and features removed.
  const vipLevels: VIPLevel[] = [];

  const currentLevel = user?.profile?.vipLevel || 0;
  const isVIPActive = user?.profile?.vipExpiry && user.profile.vipExpiry > Date.now();

  // CurrentVIPStatus removed (bonus-related UI).

  // VIPTable removed (bonus-related UI).

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 text-white btn-hover touch-target focus-ring"
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">VIP Membership</h1>
            <p className="text-gray-400">Exclusive benefits and premium features</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
  {/* Bonus-related VIP status and table removed */}

        <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-2">VIP Benefits</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Reduced trading fees based on your VIP level</li>
                <li>• Priority customer support and dedicated assistance</li>
                <li>• Access to advanced analytics and market insights</li>
                <li>• Exclusive trading signals and market updates</li>
                <li>• Higher withdrawal limits and faster processing</li>
                <li>• Personal account manager for VIP 4+ levels</li>
                <li>• Early access to new features and products</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">How do I achieve VIP status?</h4>
              <p className="text-gray-400 text-sm">
                VIP levels are assigned based on your trading activity, deposit history, and account standing. Our system automatically evaluates your eligibility.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Are VIP benefits permanent?</h4>
              <p className="text-gray-400 text-sm">
                VIP benefits are maintained as long as you meet the requirements for your level. Regular trading activity helps maintain your status.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">How are VIP levels determined?</h4>
              <p className="text-gray-400 text-sm">
                VIP levels are based on multiple factors including trading volume, account balance, deposit history, and overall platform engagement.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Can I lose my VIP status?</h4>
              <p className="text-gray-400 text-sm">
                VIP status is reviewed periodically. Maintaining regular trading activity and meeting minimum requirements helps preserve your level.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPPage;

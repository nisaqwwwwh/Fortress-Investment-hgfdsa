import React, { useState } from 'react';
import nisaLogo from '../assets/nisa-logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader, CheckCircle2, AlertCircle, Sparkles, Shield, Key, Gift } from 'lucide-react';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    fundPassword: '',
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showFundPassword, setShowFundPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (formData.fundPassword.length < 6) {
      toast.error('Fund password must be at least 6 characters long');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      await signIn("password", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        flow: "signUp"
      });
      
      // Show success message and redirect to home
  toast.success('🎉 Welcome to NISA investment advisor! Your account has been created successfully.');
      
      // Small delay to show the success message before redirect
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        toast.error('An account with this email already exists. Please sign in instead.');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="full-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 w-48 h-48 sm:top-20 sm:left-10 sm:w-72 sm:h-72 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-5 w-64 h-64 sm:bottom-20 sm:right-10 sm:w-96 sm:h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-80 sm:h-80 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 safe-area-pt p-3 sm:p-4 md:p-6">
        {/* Empty header for spacing */}
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-60px)] px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md container-responsive">
          {/* Logo and Title */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <img 
                    src={nisaLogo} 
                    alt="NISA investment advisor logo" 
                    className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={12} className="sm:w-4 sm:h-4 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Join NISA investment advisor
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-medium px-2">
              Start your professional trading journey today
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl relative">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-blue-400/5 rounded-2xl sm:rounded-3xl"></div>
            
            <form onSubmit={handleSubmit} className="relative space-y-4 sm:space-y-5 md:space-y-6">
              {/* Name Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-gray-300">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <User size={16} className="sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-200" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    autoComplete="name"
                    className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base md:text-lg hover:bg-gray-700/70 touch-target"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-gray-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Mail size={16} className="sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-200" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                    className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base md:text-lg hover:bg-gray-700/70 touch-target"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="password" className="block text-sm sm:text-base font-semibold text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Lock size={16} className="sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-200" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    autoComplete="new-password"
                    className="w-full pl-9 sm:pl-12 pr-10 sm:pr-14 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base md:text-lg hover:bg-gray-700/70 touch-target"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200 touch-target"
                  >
                    {showPassword ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength(formData.password))} password-strength-bar`}
                        data-strength={passwordStrength(formData.password)}
                      ></div>
                      <span className="text-xs sm:text-sm text-gray-400 font-semibold min-w-[50px] sm:min-w-[60px]">
                        {getPasswordStrengthText(passwordStrength(formData.password))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-semibold text-gray-300">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Shield size={16} className="sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-200" />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    autoComplete="new-password"
                    className="w-full pl-9 sm:pl-12 pr-10 sm:pr-14 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base md:text-lg hover:bg-gray-700/70 touch-target"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200 touch-target"
                  >
                    {showConfirmPassword ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-2 sm:mt-3 flex items-center space-x-1 sm:space-x-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-green-400" />
                        <span className="text-xs sm:text-sm md:text-base text-green-400 font-medium">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} className="sm:w-4 sm:h-4 text-red-400" />
                        <span className="text-xs sm:text-sm md:text-base text-red-400 font-medium">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Fund Password Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="fundPassword" className="block text-sm sm:text-base font-semibold text-gray-300">
                  Fund Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Key size={16} className="sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-200" />
                  </div>
                  <input
                    name="fundPassword"
                    type={showFundPassword ? 'text' : 'password'}
                    id="fundPassword"
                    value={formData.fundPassword}
                    onChange={handleInputChange}
                    required
                    autoComplete="new-password"
                    className="w-full pl-9 sm:pl-12 pr-10 sm:pr-14 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base md:text-lg hover:bg-gray-700/70 touch-target"
                    placeholder="Create fund password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFundPassword(!showFundPassword)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200 touch-target"
                  >
                    {showFundPassword ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Fund password is used for withdrawals and sensitive operations
                </p>
              </div>

              {/* Referral Code Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="referralCode" className="block text-sm sm:text-base font-semibold text-gray-300">
                  Referral Code <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Gift size={16} className="sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-200" />
                  </div>
                  <input
                    name="referralCode"
                    type="text"
                    id="referralCode"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base md:text-lg hover:bg-gray-700/70 touch-target"
                    placeholder="Enter referral code (if any)"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Get bonus rewards with a valid referral code
                </p>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/50">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2 touch-target"
                />
                <label htmlFor="terms" className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => toast.info('Terms of Service will be available soon')}
                    className="text-yellow-400 hover:text-yellow-300 underline font-medium touch-target"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => toast.info('Privacy Policy will be available soon')}
                    className="text-yellow-400 hover:text-yellow-300 underline font-medium touch-target"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg md:text-xl hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] touch-target shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <Loader className="animate-spin" size={18} />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Start Trading Now'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="relative mt-6 sm:mt-8 text-center">
              <span className="text-sm sm:text-base text-gray-400">Already have an account? </span>
              <Link 
                to="/signin" 
                className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-200 touch-target hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 sm:mt-8 md:mt-10">
            <p className="text-xs sm:text-sm md:text-base text-gray-500 px-2 sm:px-4 font-medium">
              © 2024 NISA investment advisor, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

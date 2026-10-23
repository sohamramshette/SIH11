import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  HelpCircle,
  X,
  Lock,
  User,
  Info,
} from 'lucide-react';
import DemoRoleSelector from '../components/auth/DemoRoleSelector';
import LoginSupportingPanel from '../components/auth/LoginSupportingPanel';
import { DEMO_ROLES, validateLoginForm, mockLogin } from '../services/mockAuth';

/**
 * LoginPage Component (Phase 2)
 * Formal Indian Government Portal Login Interface.
 * Implements clean form validation, password visibility toggle,
 * isolated mock authentication service, and development demo-role routing.
 */
const LoginPage = () => {
  const navigate = useNavigate();

  // Selected demo role (defaults to System Admin for convenient testing)
  const [selectedRole, setSelectedRole] = useState(DEMO_ROLES[0].id);

  // Form inputs (prefilled with default demo credentials for immediate testing)
  const [identifier, setIdentifier] = useState(DEMO_ROLES[0].email);
  const [password, setPassword] = useState('demo@aicte2026');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Handle demo role selection
  const handleSelectRole = (role) => {
    setSelectedRole(role.id);
    setIdentifier(role.email);
    setPassword('demo@aicte2026');
    setErrors({});
  };

  // Handle input changes with real-time error clearing
  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    if (errors.identifier) {
      setErrors((prev) => ({ ...prev, identifier: undefined, general: undefined }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
    }
  };

  // Form submission & mock authentication
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Frontend validation
    const { isValid, errors: validationErrors } = validateLoginForm(identifier, password);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // 2. Isolated mock authentication service call
      const result = await mockLogin({
        identifier,
        password,
        roleId: selectedRole,
      });

      // 3. Navigate to role-specific dashboard placeholder
      navigate(result.targetRoute);
    } catch (err) {
      setErrors({
        general: err.message || 'Authentication failed. Please check your credentials.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header / Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg border border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2 text-xs">
            <Link
              to="/"
              className="inline-flex items-center space-x-1 font-bold text-[#102D52] hover:text-[#1D4ED8] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium">Portal Authentication</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">AICTE Verification Gateway</span>
            <span>·</span>
            <span>SIH 26261 Prototype</span>
          </div>
        </div>
      </div>

      {/* Main Login View Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Login Card */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
              {/* Institutional Card Header */}
              <div className="flex items-start justify-between pb-5 mb-5 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-lg bg-[#102D52] text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      All India Council for Technical Education
                    </div>
                    <div className="text-sm font-extrabold text-[#102D52] leading-tight">
                      Application Validation &amp; Compliance System
                    </div>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                  OFFICIAL ACCESS
                </span>
              </div>

              {/* Title & Supporting Text */}
              <div className="mb-6">
                <h1 className="text-2xl font-black text-[#102D52] tracking-tight mb-1">
                  Sign In to Your Account
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Access the application validation and regulatory compliance portal.
                </p>
              </div>

              {/* General Error Banner */}
              {errors.general && (
                <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Authentication Notice: </span>
                    <span>{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Development-Only Demo Role Selector */}
              <DemoRoleSelector
                selectedRole={selectedRole}
                onSelectRole={handleSelectRole}
              />

              {/* Visible Demo Mode Notice */}
              <div className="mb-5 p-3 rounded-md bg-blue-50/80 border border-blue-200 text-[11px] text-blue-950 flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-bold">Demo mode — no real authentication is performed. </span>
                  <span>
                    Selecting a role automatically populates simulated credentials. Submitting will navigate to the role's dashboard.
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Field 1: Email or User ID */}
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-xs font-bold text-slate-800 mb-1.5"
                  >
                    Email Address or User ID <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="identifier"
                      name="identifier"
                      type="text"
                      autoComplete="username"
                      value={identifier}
                      onChange={handleIdentifierChange}
                      disabled={isLoading}
                      aria-invalid={errors.identifier ? 'true' : 'false'}
                      aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                      placeholder="e.g. officer@aicte.gov.in or AICTE-ADM-001"
                      className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.identifier
                          ? 'border-red-500 focus:ring-red-400 text-red-900 bg-red-50/30'
                          : 'border-slate-300 focus:ring-[#102D52] focus:border-[#102D52] text-slate-900'
                      }`}
                    />
                  </div>
                  {errors.identifier && (
                    <p id="identifier-error" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.identifier}</span>
                    </p>
                  )}
                </div>

                {/* Field 2: Password with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold text-slate-800"
                    >
                      Password <span className="text-red-600">*</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs font-bold text-[#1D4ED8] hover:text-[#102D52] transition-colors focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                      aria-invalid={errors.password ? 'true' : 'false'}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      placeholder="Enter your security password"
                      className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.password
                          ? 'border-red-500 focus:ring-red-400 text-red-900 bg-red-50/30'
                          : 'border-slate-300 focus:ring-[#102D52] focus:border-[#102D52] text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-2.5 p-0.5 text-slate-500 hover:text-slate-800 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p id="password-error" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="w-4 h-4 rounded border-slate-300 text-[#102D52] focus:ring-[#102D52]"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Remember me on this institutional device
                    </span>
                  </label>
                </div>

                {/* Submit Primary Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 text-sm font-bold text-white rounded-lg bg-[#102D52] hover:bg-[#1D4ED8] shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#102D52] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Credentials &amp; Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Portal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Small Prototype Notice */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <strong>Notice:</strong> This is a Smart India Hackathon student prototype (Problem Statement ID: 26261). Authentication is currently simulated for user interface and navigation evaluation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Supporting Information Panel */}
          <div className="lg:col-span-5">
            <LoginSupportingPanel />
          </div>
        </div>
      </div>

      {/* Forgot Password Informational Modal */}
      {forgotPasswordOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#102D52]">
                <HelpCircle className="w-5 h-5 text-blue-700" />
                <h2 id="forgot-password-title" className="text-base font-bold">
                  Password Recovery Information
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              <p>
                In the production environment, password recovery will be managed through institutional OTP verification sent to the authorized nodal officer's registered government email address.
              </p>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 font-medium">
                <strong>Prototype Notice:</strong> Password recovery will be connected when backend authentication services and official SMS/Email gateways are integrated in Phase 3.
              </div>
              <p className="text-xs text-slate-500">
                For this prototype session, please use the development role selector on the login card to test any of the four role-based dashboard routes without needing a password reset.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#102D52] text-white hover:bg-[#1D4ED8] transition-colors"
              >
                Acknowledge &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

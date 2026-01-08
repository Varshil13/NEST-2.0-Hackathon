import { Shield, Zap, FileCheck, Lock, Brain, Clock } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (screen: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SafetyLink PV</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                PV Dashboard
              </button>
              <button
                onClick={() => onNavigate('demo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transforming Pharmacovigilance<br />Follow-Up Data Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            AI-powered platform that reduces follow-up burden, accelerates risk identification,
            and ensures regulatory compliance in adverse event reporting.
          </p>
          <button
            onClick={() => onNavigate('demo')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Start Interactive Demo
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">The Problem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Slow Follow-Ups</h3>
              <p className="text-gray-600 text-sm">
                Average 12-15 days to gather complete follow-up data, missing regulatory deadlines
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Incomplete Data</h3>
              <p className="text-gray-600 text-sm">
                Only 47% of cases reach 80% completeness, delaying safety signal detection
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Manual Overload</h3>
              <p className="text-gray-600 text-sm">
                PV teams spend 60% of time on repetitive follow-up tasks instead of risk analysis
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Risk Scoring</h3>
            <p className="text-gray-600">
              Automatically identifies high-risk cases requiring immediate attention based on event severity,
              patient factors, and data completeness.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Questioning</h3>
            <p className="text-gray-600">
              Intelligent system removes irrelevant questions, reducing patient burden by up to 40%
              while maintaining data quality.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Ready</h3>
            <p className="text-gray-600">
              Built-in compliance with ICH E2B, FDA MedWatch, and EMA requirements.
              Complete audit trails for inspections.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Encrypted</h3>
            <p className="text-gray-600">
              End-to-end encryption, HIPAA compliance, and role-based access control
              protect sensitive patient data.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Dashboard</h3>
            <p className="text-gray-600">
              Monitor all cases, track follow-up progress, and identify bottlenecks
              with comprehensive analytics.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Faster Time to Insight</h3>
            <p className="text-gray-600">
              Reduce follow-up cycle time by 65%, enabling faster safety signal detection
              and regulatory reporting.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Trusted by Global Pharmaceutical Companies</h2>
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">ICH GCP Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-6 h-6" />
              <span className="font-semibold">HIPAA Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileCheck className="w-6 h-6" />
              <span className="font-semibold">21 CFR Part 11</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('demo')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Experience the Platform
          </button>
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>SafetyLink PV - Demo Platform for Hackathon Evaluation</p>
          <p className="text-sm mt-2">Prototype demonstrating AI-assisted pharmacovigilance workflow</p>
        </div>
      </footer>
    </div>
  );
}

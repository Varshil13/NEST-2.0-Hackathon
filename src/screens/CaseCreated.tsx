import { CheckCircle, Brain, Clock, ArrowRight } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { ProgressBar } from '../components/ProgressBar';

interface CaseCreatedProps {
  caseData: {
    case_number: string;
    patient_name: string;
    risk_level: string;
    risk_confidence: number;
    risk_reason: string;
    completeness_score: number;
    follow_up_due_date: string;
  };
  onNavigate: (screen: string, data?: unknown) => void;
}

export function CaseCreated({ caseData, onNavigate }: CaseCreatedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Successfully Created</h1>
            <p className="text-gray-600">
              Case <span className="font-mono font-semibold text-blue-600">{caseData.case_number}</span> has been submitted
              for {caseData.patient_name}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">AI Risk Assessment Complete</h3>
                    <RiskBadge level={caseData.risk_level} size="sm" />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Confidence:</strong> {caseData.risk_confidence}%
                  </p>
                  <p className="text-sm text-gray-600">
                    {caseData.risk_reason}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <ProgressBar
                value={caseData.completeness_score || 0}
                label="Case Completeness"
              />
              <p className="text-sm text-gray-600 mt-2">
                Additional information needed to reach 100% completeness. Follow-up request will be sent automatically.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Regulatory Deadline</h3>
                  <p className="text-sm text-gray-600">
                    Follow-up data required by:{' '}
                    <span className="font-semibold text-yellow-700">
                      {new Date(caseData.follow_up_due_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <span>AI system will send secure follow-up link to patient</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <span>Adaptive questionnaire will reduce unnecessary questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <span>PV team will review completed data for regulatory submission</span>
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => onNavigate('patient-followup', caseData)}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>Simulate Patient Follow-Up</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}

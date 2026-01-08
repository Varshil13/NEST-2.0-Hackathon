import { useState } from 'react';
import { Shield, CheckCircle, Brain, X } from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';

interface PatientFollowUpProps {
  caseData: {
    case_number: string;
    patient_name: string;
  };
  onNavigate: (screen: string) => void;
}

const allQuestions = [
  { id: 'q1', text: 'How long did the symptoms last?', type: 'text', required: true, removed: false },
  { id: 'q2', text: 'Did the symptoms resolve completely?', type: 'radio', options: ['Yes', 'No', 'Partially'], required: true, removed: false },
  { id: 'q3', text: 'Did you seek medical attention?', type: 'radio', options: ['Yes', 'No'], required: true, removed: false },
  { id: 'q4', text: 'Were you hospitalized?', type: 'radio', options: ['Yes', 'No'], required: true, removed: true },
  { id: 'q5', text: 'Did you take any other medications at the time?', type: 'textarea', required: false, removed: false },
  { id: 'q6', text: 'Have you experienced similar reactions before?', type: 'radio', options: ['Yes', 'No'], required: true, removed: false },
  { id: 'q7', text: 'Current health status', type: 'radio', options: ['Fully recovered', 'Improving', 'No change', 'Worsening'], required: true, removed: false },
  { id: 'q8', text: 'Did you restart the medication?', type: 'radio', options: ['Yes', 'No'], required: true, removed: false },
  { id: 'q9', text: 'Were any lab tests performed?', type: 'radio', options: ['Yes', 'No', 'Unknown'], required: false, removed: true },
  { id: 'q10', text: 'Did symptoms recur after restarting?', type: 'radio', options: ['Yes', 'No', 'Did not restart'], required: false, removed: true },
  { id: 'q11', text: 'Are you taking the medication as prescribed?', type: 'radio', options: ['Yes', 'No'], required: true, removed: true },
  { id: 'q12', text: 'Any other information you would like to share?', type: 'textarea', required: false, removed: true },
];

export function PatientFollowUp({ caseData, onNavigate }: PatientFollowUpProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAIReduction, setShowAIReduction] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const activeQuestions = allQuestions.filter(q => !q.removed);
  const removedCount = allQuestions.filter(q => q.removed).length;
  const progress = ((currentQuestion) / activeQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [activeQuestions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < activeQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
              <p className="text-gray-600 mb-6">
                Your follow-up responses for case <span className="font-mono font-semibold text-blue-600">{caseData.case_number}</span> have been received.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Your responses will be reviewed by our pharmacovigilance team</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>This information helps ensure medication safety for everyone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>You may be contacted if additional information is needed</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = activeQuestions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SafetyLink PV</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">Case:</span>
              <span className="font-mono font-semibold text-blue-600">{caseData.case_number}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {showAIReduction && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">AI Reduced Question Load</h3>
                  <p className="text-sm text-gray-600">
                    Based on your initial report, we removed <strong>{removedCount} unnecessary questions</strong>.
                    You'll only answer what's relevant to your case.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIReduction(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <ProgressBar value={progress} label="Follow-Up Progress" />
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestion + 1} of {activeQuestions.length}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQ.text}</h2>

            {currentQ.type === 'text' && (
              <input
                type="text"
                value={currentAnswer || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Enter your answer..."
              />
            )}

            {currentQ.type === 'textarea' && (
              <textarea
                value={currentAnswer || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Enter your answer..."
              />
            )}

            {currentQ.type === 'radio' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      currentAnswer === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQ.id}
                      value={option}
                      checked={currentAnswer === option}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-lg text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentQ.required && !currentAnswer}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion < activeQuestions.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Your responses are encrypted and securely stored. Protected health information is handled per HIPAA regulations.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

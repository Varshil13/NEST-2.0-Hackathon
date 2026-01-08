import { useState } from 'react';
import { Shield, Stethoscope, CheckCircle } from 'lucide-react';

interface HCPFollowUpProps {
  onNavigate: (screen: string) => void;
}

export function HCPFollowUp({ onNavigate }: HCPFollowUpProps) {
  const [formData, setFormData] = useState({
    clinicalAssessment: '',
    diagnosis: '',
    treatment: '',
    labResults: '',
    outcome: 'Recovering',
    causality: '',
    followUpNeeded: 'No',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinical Follow-Up Submitted</h1>
              <p className="text-gray-600 mb-6">
                Thank you for providing detailed clinical information. This data will be reviewed by the pharmacovigilance team.
              </p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SafetyLink PV</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Healthcare Professional Portal</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clinical Follow-Up Form</h1>
              <p className="text-gray-600">Case PV-2024-002 - James Chen, Age 67</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Initial Report Summary</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Drug:</span>
                <span className="ml-2 font-medium">Metformin 1000mg</span>
              </div>
              <div>
                <span className="text-gray-600">Event:</span>
                <span className="ml-2 font-medium">Dizziness and fall with hip fracture</span>
              </div>
              <div>
                <span className="text-gray-600">Severity:</span>
                <span className="ml-2 font-medium text-red-600">Severe</span>
              </div>
              <div>
                <span className="text-gray-600">Event Date:</span>
                <span className="ml-2 font-medium">2024-01-04</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Assessment
              </label>
              <textarea
                required
                value={formData.clinicalAssessment}
                onChange={(e) => setFormData({ ...formData, clinicalAssessment: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed clinical assessment of the adverse event..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MedDRA Diagnosis Code
                </label>
                <select
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select diagnosis</option>
                  <option>10013573 - Fall</option>
                  <option>10019428 - Hip fracture</option>
                  <option>10013887 - Dizziness</option>
                  <option>10042772 - Hypoglycaemia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Outcome
                </label>
                <select
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Recovering</option>
                  <option>Recovered</option>
                  <option>Not Recovered</option>
                  <option>Recovered with Sequelae</option>
                  <option>Fatal</option>
                  <option>Unknown</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Provided
              </label>
              <textarea
                required
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe treatment and interventions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Laboratory Test Results
              </label>
              <textarea
                value={formData.labResults}
                onChange={(e) => setFormData({ ...formData, labResults: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Include relevant lab values, dates, and reference ranges..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Causality Assessment
                </label>
                <select
                  value={formData.causality}
                  onChange={(e) => setFormData({ ...formData, causality: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select assessment</option>
                  <option>Definite</option>
                  <option>Probable</option>
                  <option>Possible</option>
                  <option>Unlikely</option>
                  <option>Conditional</option>
                  <option>Unassessable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Further Follow-Up Required?
                </label>
                <select
                  value={formData.followUpNeeded}
                  onChange={(e) => setFormData({ ...formData, followUpNeeded: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This clinical information will be included in regulatory safety reports.
                Ensure all details are accurate and complete.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit Clinical Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

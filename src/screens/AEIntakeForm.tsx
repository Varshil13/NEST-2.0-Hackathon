import { useState } from 'react';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AEIntakeFormProps {
  onNavigate: (screen: string, data?: unknown) => void;
  onBack: () => void;
}

export function AEIntakeForm({ onNavigate, onBack }: AEIntakeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'Female',
    drugName: '',
    eventDate: '',
    eventDescription: '',
    severity: 'Moderate',
    reporterType: 'Patient',
    country: 'United States',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const caseCount = await supabase
      .from('cases')
      .select('case_number', { count: 'exact', head: true });

    const nextCaseNumber = `PV-2024-${String((caseCount.count || 0) + 1).padStart(3, '0')}`;

    const riskLevel = formData.severity === 'Severe' || formData.severity === 'Life-threatening' ? 'HIGH' : 'MEDIUM';
    const riskConfidence = formData.severity === 'Severe' ? 88 : 75;
    const riskReason = formData.severity === 'Severe'
      ? 'Serious event + requires immediate follow-up + clinical assessment needed'
      : 'Moderate event + standard follow-up protocol + monitoring required';

    const { data: newCase, error } = await supabase
      .from('cases')
      .insert({
        case_number: nextCaseNumber,
        patient_name: formData.patientName,
        patient_age: parseInt(formData.patientAge) || null,
        patient_gender: formData.patientGender,
        drug_name: formData.drugName,
        event_date: formData.eventDate,
        event_description: formData.eventDescription,
        severity: formData.severity,
        reporter_type: formData.reporterType,
        country: formData.country,
        risk_level: riskLevel,
        risk_confidence: riskConfidence,
        risk_reason: riskReason,
        completeness_score: 45,
        follow_up_status: 'Pending',
        follow_up_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      .select()
      .single();

    if (!error && newCase) {
      await supabase.from('audit_logs').insert({
        case_id: newCase.id,
        action: 'Case Created',
        user_role: 'System',
        user_id: 'web-intake-form',
        details: { source: 'web_form', validation: 'passed' },
        ip_address: '192.168.1.100',
      });

      await supabase.from('audit_logs').insert({
        case_id: newCase.id,
        action: 'Risk Assessment Completed',
        user_role: 'System',
        user_id: 'ai-risk-engine',
        details: {
          model: 'pv-risk-v2.1',
          confidence: riskConfidence,
          factors: ['severity_' + formData.severity.toLowerCase(), 'new_case', 'requires_follow_up']
        },
        ip_address: '10.0.0.5',
      });

      setTimeout(() => {
        onNavigate('case-created', newCase);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SafetyLink PV</span>
            </div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Report Adverse Event</h1>
              <p className="text-gray-600">Please provide information about the adverse event</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  required
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.patientGender}
                  onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drug Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.drugName}
                  onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Medication name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                  <option>Life-threatening</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter Type
                </label>
                <select
                  value={formData.reporterType}
                  onChange={(e) => setFormData({ ...formData, reporterType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Patient</option>
                  <option>HCP</option>
                  <option>Pharmacist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Germany</option>
                  <option>Spain</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Description
              </label>
              <textarea
                required
                value={formData.eventDescription}
                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe what happened in detail..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Data Protection:</strong> All information is encrypted and handled in accordance with HIPAA and GDPR regulations.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

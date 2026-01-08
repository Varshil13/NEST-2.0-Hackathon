import { useState, useEffect } from 'react';
import { Shield, Filter, AlertTriangle, Clock, FileText, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { Database } from '../lib/database.types';

type Case = Database['public']['Tables']['cases']['Row'];
type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

interface PVDashboardProps {
  onNavigate: (screen: string) => void;
}

export function PVDashboard({ onNavigate }: PVDashboardProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCases(data);
    }
    setLoading(false);
  };

  const loadAuditLogs = async (caseId: string) => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (data) {
      setAuditLogs(data);
    }
  };

  const handleViewCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    loadAuditLogs(caseItem.id);
  };

  const filteredCases = cases.filter(c => {
    if (filter === 'high-risk') return c.risk_level === 'HIGH' || c.risk_level === 'CRITICAL';
    if (filter === 'incomplete') return (c.completeness_score || 0) < 80;
    if (filter === 'overdue') {
      const dueDate = new Date(c.follow_up_due_date || '');
      return dueDate < new Date() && c.follow_up_status !== 'Complete';
    }
    return true;
  });

  const stats = {
    total: cases.length,
    highRisk: cases.filter(c => c.risk_level === 'HIGH' || c.risk_level === 'CRITICAL').length,
    pending: cases.filter(c => c.follow_up_status === 'Pending' || c.follow_up_status === 'Sent').length,
    complete: cases.filter(c => c.follow_up_status === 'Complete').length,
  };

  if (selectedCase) {
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
                onClick={() => setSelectedCase(null)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Case {selectedCase.case_number}
                    </h1>
                    <p className="text-gray-600">{selectedCase.patient_name}</p>
                  </div>
                  <RiskBadge level={selectedCase.risk_level} size="lg" />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Patient Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Age:</span> {selectedCase.patient_age}</p>
                      <p><span className="font-medium">Gender:</span> {selectedCase.patient_gender}</p>
                      <p><span className="font-medium">Country:</span> {selectedCase.country}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Event Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Drug:</span> {selectedCase.drug_name}</p>
                      <p><span className="font-medium">Date:</span> {new Date(selectedCase.event_date).toLocaleDateString()}</p>
                      <p><span className="font-medium">Severity:</span> {selectedCase.severity}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Event Description</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedCase.event_description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">AI Risk Assessment</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">Risk Level:</span>
                      <RiskBadge level={selectedCase.risk_level} size="sm" />
                      <span className="text-sm text-gray-600">
                        ({selectedCase.risk_confidence}% confidence)
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedCase.risk_reason}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Case Completeness</h3>
                  <ProgressBar value={selectedCase.completeness_score || 0} />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Follow-Up Status</h3>
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={selectedCase.follow_up_status} />
                      {selectedCase.follow_up_due_date && (
                        <span className="text-sm text-gray-600">
                          Due: {new Date(selectedCase.follow_up_due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">Audit Trail</h2>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border-l-2 border-blue-200 pl-4 pb-4">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{log.action}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{log.user_role}</span>
                        {log.user_id && ` • ${log.user_id}`}
                      </div>
                      {log.ip_address && (
                        <div className="text-xs text-gray-500 mt-1">
                          IP: {log.ip_address}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Complete audit trail maintained for regulatory compliance
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Human Review Required</h3>
                <p className="text-sm text-gray-700">
                  High-risk cases require manual review by qualified PV personnel before regulatory submission.
                  AI assists with prioritization and data quality checks only.
                </p>
              </div>
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
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('landing')}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('demo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Report AE
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Cases</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">High Risk</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.highRisk}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Pending Follow-Up</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Complete</span>
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.complete}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Case Management</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Cases</option>
                  <option value="high-risk">High Risk Only</option>
                  <option value="incomplete">Incomplete (&lt;80%)</option>
                  <option value="overdue">Overdue Follow-Up</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completeness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow-Up Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Loading cases...
                    </td>
                  </tr>
                ) : filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No cases found matching the selected filter
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-semibold text-blue-600">
                          {caseItem.case_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{caseItem.patient_name}</div>
                        <div className="text-xs text-gray-500">
                          {caseItem.patient_age} • {caseItem.patient_gender}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RiskBadge level={caseItem.risk_level} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24">
                          <ProgressBar value={caseItem.completeness_score || 0} showPercentage={false} />
                        </div>
                        <span className="text-xs text-gray-600">{caseItem.completeness_score}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={caseItem.follow_up_status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {caseItem.follow_up_due_date
                          ? new Date(caseItem.follow_up_due_date).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewCase(caseItem)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

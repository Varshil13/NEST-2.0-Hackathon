export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string;
          case_number: string;
          patient_name: string;
          patient_age: number | null;
          patient_gender: string | null;
          event_description: string;
          drug_name: string;
          event_date: string;
          severity: string;
          outcome: string | null;
          risk_level: string;
          risk_confidence: number | null;
          risk_reason: string | null;
          completeness_score: number | null;
          follow_up_status: string;
          follow_up_due_date: string | null;
          reporter_type: string;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_number: string;
          patient_name: string;
          patient_age?: number | null;
          patient_gender?: string | null;
          event_description: string;
          drug_name: string;
          event_date: string;
          severity?: string;
          outcome?: string | null;
          risk_level?: string;
          risk_confidence?: number | null;
          risk_reason?: string | null;
          completeness_score?: number | null;
          follow_up_status?: string;
          follow_up_due_date?: string | null;
          reporter_type?: string;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          case_number?: string;
          patient_name?: string;
          patient_age?: number | null;
          patient_gender?: string | null;
          event_description?: string;
          drug_name?: string;
          event_date?: string;
          severity?: string;
          outcome?: string | null;
          risk_level?: string;
          risk_confidence?: number | null;
          risk_reason?: string | null;
          completeness_score?: number | null;
          follow_up_status?: string;
          follow_up_due_date?: string | null;
          reporter_type?: string;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      follow_ups: {
        Row: {
          id: string;
          case_id: string;
          recipient_type: string;
          status: string;
          sent_at: string | null;
          responded_at: string | null;
          questions_sent: unknown;
          questions_removed_by_ai: number | null;
          access_token: string;
          created_at: string;
        };
      };
      follow_up_responses: {
        Row: {
          id: string;
          follow_up_id: string;
          question_id: string;
          question_text: string;
          response: string | null;
          created_at: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          case_id: string | null;
          action: string;
          user_role: string;
          user_id: string | null;
          details: unknown;
          ip_address: string | null;
          created_at: string;
        };
      };
    };
  };
}

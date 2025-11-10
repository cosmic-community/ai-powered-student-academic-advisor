// Type definitions for Cosmic objects

interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

export interface Student extends CosmicObject {
  type: 'students';
  metadata: {
    email?: string;
    grade_level?: string;
    phone?: string;
    parent_contact?: string;
    current_gpa?: number;
    enrollment_date?: string;
    status?: 'Active' | 'Inactive' | 'Graduated';
    subjects?: string[];
    // AI Prediction fields
    dropout_risk?: 'Low' | 'Moderate' | 'High' | 'Very High';
    risk_score?: number;
    prediction_date?: string;
    // Counselor assignment
    assigned_counselor?: string;
    counselor_notes?: string;
    // Academic performance data for prediction
    attendance_rate?: number;
    assignment_completion_rate?: number;
    test_scores?: number[];
    behavioral_incidents?: number;
    extracurricular_participation?: boolean;
    family_income_level?: 'Low' | 'Medium' | 'High';
    parental_education?: string;
    profile_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface Assignment extends CosmicObject {
  type: 'assignments';
  metadata: {
    student?: Student;
    subject?: string;
    description?: string;
    due_date?: string;
    status?: 'Pending' | 'Completed' | 'Overdue';
    grade?: number;
    notes?: string;
  };
}

export interface Report extends CosmicObject {
  type: 'reports';
  metadata: {
    student?: Student;
    report_file?: {
      url: string;
      imgix_url: string;
    };
    upload_date?: string;
    quarter?: string;
    year?: string;
    overall_grade?: number;
    notes?: string;
    // Counselor report data
    counselor_keywords?: string[];
    report_type?: 'Academic' | 'Behavioral' | 'Financial' | 'Psychological' | 'General';
    counselor_name?: string;
  };
}

export interface Recommendation extends CosmicObject {
  type: 'recommendations';
  metadata: {
    student?: Student;
    subject?: string;
    recommendations?: string;
    generated_date?: string;
    status?: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
    priority?: 'High' | 'Medium' | 'Low';
    implemented?: boolean;
    // AI-generated recommendation fields
    category?: 'Academic' | 'Financial' | 'Emotional' | 'Social' | 'Time Management';
    recommendation_text?: string;
    rationale?: string;
    approved_by_teacher?: boolean;
    teacher_notes?: string;
  };
}

export interface Teacher extends CosmicObject {
  type: 'teachers';
  metadata: {
    email?: string;
    phone?: string;
    subjects?: string[];
    username?: string;
    password_hash?: string;
    profile_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface Counselor extends CosmicObject {
  type: 'counselors';
  metadata: {
    email?: string;
    phone?: string;
    specialization?: string[];
    username?: string;
    password_hash?: string;
    assigned_students?: string[];
    profile_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface Intervention extends CosmicObject {
  type: 'interventions';
  metadata: {
    student?: Student;
    recommendation?: Recommendation;
    status?: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    start_date?: string;
    completion_date?: string;
    effectiveness_rating?: number;
    notes?: string;
  };
}

export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// AI Prediction input data structure
export interface PredictionInput {
  student_id: string;
  attendance_rate: number;
  current_gpa: number;
  assignment_completion_rate: number;
  test_scores_avg: number;
  behavioral_incidents: number;
  extracurricular_participation: number; // 0 or 1
  family_income_level: number; // 1=Low, 2=Medium, 3=High
  parental_education_level: number; // Years of education
}

// AI Prediction output
export interface PredictionResult {
  student_id: string;
  dropout_risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  risk_score: number;
  confidence: number;
  prediction_date: string;
}

// Type guards
export function isStudent(obj: CosmicObject): obj is Student {
  return obj.type === 'students';
}

export function isAssignment(obj: CosmicObject): obj is Assignment {
  return obj.type === 'assignments';
}

export function isReport(obj: CosmicObject): obj is Report {
  return obj.type === 'reports';
}

export function isRecommendation(obj: CosmicObject): obj is Recommendation {
  return obj.type === 'recommendations';
}

export function isTeacher(obj: CosmicObject): obj is Teacher {
  return obj.type === 'teachers';
}

export function isCounselor(obj: CosmicObject): obj is Counselor {
  return obj.type === 'counselors';
}
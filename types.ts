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
  };
}

export interface Recommendation extends CosmicObject {
  type: 'recommendations';
  metadata: {
    student?: Student;
    subject?: string;
    recommendations?: string;
    generated_date?: string;
    status?: 'Active' | 'Reviewed' | 'Archived';
    priority?: 'High' | 'Medium' | 'Low';
    implemented?: boolean;
  };
}

export interface Teacher extends CosmicObject {
  type: 'teachers';
  metadata: {
    email?: string;
    phone?: string;
    subjects?: string[];
    profile_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guard for Student objects
export function isStudent(obj: CosmicObject): obj is Student {
  return obj.type === 'students';
}

// Type guard for Assignment objects
export function isAssignment(obj: CosmicObject): obj is Assignment {
  return obj.type === 'assignments';
}

// Type guard for Report objects
export function isReport(obj: CosmicObject): obj is Report {
  return obj.type === 'reports';
}

// Type guard for Recommendation objects
export function isRecommendation(obj: CosmicObject): obj is Recommendation {
  return obj.type === 'recommendations';
}
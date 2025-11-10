import { createBucketClient } from '@cosmicjs/sdk'
import type { Student, Assignment, Report, Recommendation } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all students
export async function getStudents(): Promise<Student[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'students' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Student[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch students');
  }
}

// Get a single student by slug
export async function getStudentBySlug(slug: string): Promise<Student | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'students', slug })
      .depth(1);
    
    return response.object as Student;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch student');
  }
}

// Get all assignments
export async function getAssignments(): Promise<Assignment[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'assignments' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Assignment[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch assignments');
  }
}

// Get assignments for a specific student
export async function getStudentAssignments(studentId: string): Promise<Assignment[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'assignments',
        'metadata.student': studentId 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Assignment[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch student assignments');
  }
}

// Get all reports
export async function getReports(): Promise<Report[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'reports' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Report[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch reports');
  }
}

// Get reports for a specific student
export async function getStudentReports(studentId: string): Promise<Report[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'reports',
        'metadata.student': studentId 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Report[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch student reports');
  }
}

// Get all recommendations
export async function getRecommendations(): Promise<Recommendation[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'recommendations' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Recommendation[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch recommendations');
  }
}

// Get recommendations for a specific student
export async function getStudentRecommendations(studentId: string): Promise<Recommendation[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'recommendations',
        'metadata.student': studentId 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Recommendation[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch student recommendations');
  }
}

// Create a new student
export async function createStudent(data: {
  title: string;
  email: string;
  grade_level: string;
  phone?: string;
  parent_contact?: string;
}) {
  return await cosmic.objects.insertOne({
    type: 'students',
    title: data.title,
    metadata: {
      email: data.email,
      grade_level: data.grade_level,
      phone: data.phone || '',
      parent_contact: data.parent_contact || '',
      current_gpa: 0,
      enrollment_date: new Date().toISOString(),
      status: 'Active',
      subjects: []
    }
  });
}

// Create a new assignment
export async function createAssignment(data: {
  title: string;
  studentId: string;
  subject: string;
  description: string;
  due_date: string;
}) {
  return await cosmic.objects.insertOne({
    type: 'assignments',
    title: data.title,
    metadata: {
      student: data.studentId,
      subject: data.subject,
      description: data.description,
      due_date: data.due_date,
      status: 'Pending',
      notes: ''
    }
  });
}

// Update assignment status
export async function updateAssignmentStatus(
  assignmentId: string, 
  status: 'Pending' | 'Completed' | 'Overdue'
) {
  return await cosmic.objects.updateOne(assignmentId, {
    metadata: {
      status
    }
  });
}

// Create a new recommendation
export async function createRecommendation(data: {
  title: string;
  studentId: string;
  subject: string;
  recommendations: string;
}) {
  return await cosmic.objects.insertOne({
    type: 'recommendations',
    title: data.title,
    metadata: {
      student: data.studentId,
      subject: data.subject,
      recommendations: data.recommendations,
      generated_date: new Date().toISOString(),
      status: 'Active',
      priority: 'Medium',
      implemented: false
    }
  });
}
import { NextResponse } from 'next/server'
import { createRecommendation, getStudentById } from '@/lib/cosmic'
import type { PredictionResult } from '@/types'

// AI recommendation generation based on risk factors
function generateRecommendations(student: any, prediction: PredictionResult) {
  const recommendations: Array<{
    category: 'Academic' | 'Financial' | 'Emotional' | 'Social' | 'Time Management'
    recommendation_text: string
    rationale: string
    priority: 'High' | 'Medium' | 'Low'
  }> = []

  const riskLevel = prediction.dropout_risk
  const metadata = student.metadata || {}

  // Academic recommendations
  if (metadata.current_gpa < 2.5 || metadata.assignment_completion_rate < 75) {
    recommendations.push({
      category: 'Academic',
      recommendation_text: 'Enroll in remedial tutoring program for core subjects',
      rationale: `Low GPA (${metadata.current_gpa}) and assignment completion rate (${metadata.assignment_completion_rate}%) indicate academic struggles`,
      priority: riskLevel === 'Very High' || riskLevel === 'High' ? 'High' : 'Medium'
    })
    
    recommendations.push({
      category: 'Academic',
      recommendation_text: 'Watch curated YouTube lectures and Khan Academy videos',
      rationale: 'Self-paced online learning can supplement classroom instruction',
      priority: 'Medium'
    })
  }

  // Financial recommendations
  if (metadata.family_income_level === 1) {
    recommendations.push({
      category: 'Financial',
      recommendation_text: 'Apply for Merit-cum-Means Scholarship',
      rationale: 'Low family income level indicates potential financial stress',
      priority: 'High'
    })
    
    recommendations.push({
      category: 'Financial',
      recommendation_text: 'Contact financial aid office for emergency assistance',
      rationale: 'Financial support can reduce dropout risk significantly',
      priority: riskLevel === 'Very High' ? 'High' : 'Medium'
    })
  }

  // Emotional/Psychological recommendations
  if (metadata.behavioral_incidents > 2 || riskLevel === 'Very High') {
    recommendations.push({
      category: 'Emotional',
      recommendation_text: 'Book counseling session for stress and anxiety management',
      rationale: `Behavioral incidents (${metadata.behavioral_incidents}) suggest emotional challenges`,
      priority: 'High'
    })
    
    recommendations.push({
      category: 'Emotional',
      recommendation_text: 'Join mindfulness and meditation club',
      rationale: 'Mental wellness activities can improve academic performance and retention',
      priority: 'Medium'
    })
  }

  // Social/Peer recommendations
  if (!metadata.extracurricular_participation) {
    recommendations.push({
      category: 'Social',
      recommendation_text: 'Join peer study group in your grade level',
      rationale: 'No extracurricular participation indicates lack of social connection',
      priority: 'Medium'
    })
    
    recommendations.push({
      category: 'Social',
      recommendation_text: 'Mentorship program with successful senior student',
      rationale: 'Peer mentoring improves engagement and belonging',
      priority: 'Medium'
    })
  }

  // Time Management recommendations
  if (metadata.attendance_rate < 85 || metadata.assignment_completion_rate < 70) {
    recommendations.push({
      category: 'Time Management',
      recommendation_text: 'Use Pomodoro technique study planner app',
      rationale: `Low attendance (${metadata.attendance_rate}%) and completion rates suggest time management issues`,
      priority: 'High'
    })
    
    recommendations.push({
      category: 'Time Management',
      recommendation_text: 'Attend productivity and study skills workshop',
      rationale: 'Structured time management training can improve academic outcomes',
      priority: 'Medium'
    })
  }

  return recommendations
}

export async function POST(request: Request) {
  try {
    const { student_id, prediction }: { student_id: string, prediction: PredictionResult } = await request.json()
    
    // Fetch student data
    const student = await getStudentById(student_id)
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    // Generate AI recommendations
    const recommendations = generateRecommendations(student, prediction)
    
    // Save recommendations to Cosmic
    const savedRecommendations = []
    for (const rec of recommendations) {
      const result = await createRecommendation({
        title: `${rec.category} - ${student.title}`,
        studentId: student_id,
        category: rec.category,
        recommendation_text: rec.recommendation_text,
        rationale: rec.rationale,
        priority: rec.priority
      })
      savedRecommendations.push(result)
    }

    return NextResponse.json({
      success: true,
      recommendations: savedRecommendations,
      count: savedRecommendations.length
    })
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
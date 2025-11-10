import { NextResponse } from 'next/server'
import { updateStudentPrediction } from '@/lib/cosmic'
import type { PredictionInput, PredictionResult } from '@/types'

// Simple AI prediction logic (replace with your actual ML model)
function calculateDropoutRisk(input: PredictionInput): PredictionResult {
  // Risk factors scoring
  let riskScore = 0
  
  // Attendance (0-30 points)
  if (input.attendance_rate < 70) riskScore += 30
  else if (input.attendance_rate < 80) riskScore += 20
  else if (input.attendance_rate < 90) riskScore += 10
  
  // GPA (0-25 points)
  if (input.current_gpa < 2.0) riskScore += 25
  else if (input.current_gpa < 2.5) riskScore += 15
  else if (input.current_gpa < 3.0) riskScore += 8
  
  // Assignment completion (0-20 points)
  if (input.assignment_completion_rate < 60) riskScore += 20
  else if (input.assignment_completion_rate < 75) riskScore += 12
  else if (input.assignment_completion_rate < 85) riskScore += 6
  
  // Test scores (0-15 points)
  if (input.test_scores_avg < 60) riskScore += 15
  else if (input.test_scores_avg < 70) riskScore += 10
  else if (input.test_scores_avg < 80) riskScore += 5
  
  // Behavioral incidents (0-5 points per incident, max 20)
  riskScore += Math.min(input.behavioral_incidents * 5, 20)
  
  // Extracurricular participation (-10 if yes, 0 if no)
  if (input.extracurricular_participation === 0) riskScore += 10
  
  // Family income (0-10 points)
  if (input.family_income_level === 1) riskScore += 10
  else if (input.family_income_level === 2) riskScore += 5
  
  // Parental education (0-10 points)
  if (input.parental_education_level < 12) riskScore += 10
  else if (input.parental_education_level < 16) riskScore += 5
  
  // Normalize to 0-1
  const normalizedScore = Math.min(riskScore / 100, 1)
  
  // Determine risk level
  let dropoutRisk: 'Low' | 'Moderate' | 'High' | 'Very High'
  if (normalizedScore < 0.25) dropoutRisk = 'Low'
  else if (normalizedScore < 0.5) dropoutRisk = 'Moderate'
  else if (normalizedScore < 0.75) dropoutRisk = 'High'
  else dropoutRisk = 'Very High'
  
  return {
    student_id: input.student_id,
    dropout_risk: dropoutRisk,
    risk_score: normalizedScore,
    confidence: 0.85, // Mock confidence score
    prediction_date: new Date().toISOString()
  }
}

export async function POST(request: Request) {
  try {
    const data: PredictionInput & { counselor_id: string } = await request.json()
    
    // Calculate prediction
    const prediction = calculateDropoutRisk(data)
    
    // Update student record with prediction
    await updateStudentPrediction(data.student_id, prediction, data.counselor_id)
    
    return NextResponse.json({
      success: true,
      prediction
    })
  } catch (error) {
    console.error('Error predicting dropout risk:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to predict dropout risk' },
      { status: 500 }
    )
  }
}
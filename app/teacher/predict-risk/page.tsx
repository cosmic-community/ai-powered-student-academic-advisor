'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PredictionFormData {
  student_id: string
  attendance_rate: number
  current_gpa: number
  assignment_completion_rate: number
  test_scores_avg: number
  behavioral_incidents: number
  extracurricular_participation: number
  family_income_level: number
  parental_education_level: number
  counselor_id: string
}

interface Student {
  id: string
  title: string
  metadata: {
    grade_level?: string
    email?: string
  }
}

interface Counselor {
  id: string
  title: string
}

export default function PredictRiskPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [predictionResult, setPredictionResult] = useState<any>(null)
  const [formData, setFormData] = useState<PredictionFormData>({
    student_id: '',
    attendance_rate: 85,
    current_gpa: 3.0,
    assignment_completion_rate: 80,
    test_scores_avg: 75,
    behavioral_incidents: 0,
    extracurricular_participation: 1,
    family_income_level: 2,
    parental_education_level: 12,
    counselor_id: ''
  })

  useEffect(() => {
    // Check teacher session
    const session = localStorage.getItem('teacher_session')
    if (!session) {
      router.push('/teacher/login')
      return
    }

    fetchStudents()
    fetchCounselors()
  }, [router])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      if (data.success) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  const fetchCounselors = async () => {
    try {
      const response = await fetch('/api/counselors')
      const data = await response.json()
      if (data.success) {
        setCounselors(data.counselors)
      }
    } catch (error) {
      console.error('Failed to fetch counselors:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPredictionResult(null)

    try {
      const response = await fetch('/api/teacher/predict-dropout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setPredictionResult(result.prediction)
      } else {
        alert('Prediction failed: ' + result.error)
      }
    } catch (error) {
      alert('An error occurred during prediction')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateRecommendations = async () => {
    if (!predictionResult) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/teacher/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: formData.student_id,
          prediction: predictionResult
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('AI recommendations generated successfully!')
        router.push(`/teacher/recommendations?student=${formData.student_id}`)
      } else {
        alert('Failed to generate recommendations')
      }
    } catch (error) {
      alert('An error occurred while generating recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600'
      case 'Moderate': return 'text-yellow-600'
      case 'High': return 'text-orange-600'
      case 'Very High': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100'
      case 'Moderate': return 'bg-yellow-100'
      case 'High': return 'bg-orange-100'
      case 'Very High': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">🎯 AI Dropout Risk Prediction</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <button onClick={() => router.back()} className="text-primary hover:underline">
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Data Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Select Student *</label>
                <select
                  className="input"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  required
                >
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.title} - {student.metadata?.grade_level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Attendance Rate (%) *</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  max="100"
                  value={formData.attendance_rate}
                  onChange={(e) => setFormData({ ...formData, attendance_rate: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="label">Current GPA *</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  max="4"
                  step="0.1"
                  value={formData.current_gpa}
                  onChange={(e) => setFormData({ ...formData, current_gpa: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="label">Assignment Completion Rate (%) *</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  max="100"
                  value={formData.assignment_completion_rate}
                  onChange={(e) => setFormData({ ...formData, assignment_completion_rate: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="label">Average Test Score *</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  max="100"
                  value={formData.test_scores_avg}
                  onChange={(e) => setFormData({ ...formData, test_scores_avg: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="label">Behavioral Incidents *</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={formData.behavioral_incidents}
                  onChange={(e) => setFormData({ ...formData, behavioral_incidents: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="label">Extracurricular Participation *</label>
                <select
                  className="input"
                  value={formData.extracurricular_participation}
                  onChange={(e) => setFormData({ ...formData, extracurricular_participation: Number(e.target.value) })}
                  required
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="label">Family Income Level *</label>
                <select
                  className="input"
                  value={formData.family_income_level}
                  onChange={(e) => setFormData({ ...formData, family_income_level: Number(e.target.value) })}
                  required
                >
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                </select>
              </div>

              <div>
                <label className="label">Parental Education (Years) *</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  max="20"
                  value={formData.parental_education_level}
                  onChange={(e) => setFormData({ ...formData, parental_education_level: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="label">Assign to Counselor *</label>
                <select
                  className="input"
                  value={formData.counselor_id}
                  onChange={(e) => setFormData({ ...formData, counselor_id: e.target.value })}
                  required
                >
                  <option value="">Choose a counselor...</option>
                  {counselors.map(counselor => (
                    <option key={counselor.id} value={counselor.id}>
                      {counselor.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Predicting...' : '🎯 Predict Dropout Risk'}
              </button>
            </form>
          </div>

          {/* Prediction Result */}
          <div className="space-y-6">
            {predictionResult && (
              <>
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Prediction Result</h2>
                  <div className="text-center py-8">
                    <div className={`inline-block px-8 py-4 rounded-lg ${getRiskBgColor(predictionResult.dropout_risk)} mb-4`}>
                      <p className="text-sm text-gray-600 mb-2">Dropout Risk Level</p>
                      <p className={`text-4xl font-bold ${getRiskColor(predictionResult.dropout_risk)}`}>
                        {predictionResult.dropout_risk}
                      </p>
                    </div>
                    <div className="mt-6 space-y-2">
                      <p className="text-gray-700">
                        <strong>Risk Score:</strong> {(predictionResult.risk_score * 100).toFixed(1)}%
                      </p>
                      <p className="text-gray-700">
                        <strong>Confidence:</strong> {(predictionResult.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Prediction Date: {new Date(predictionResult.prediction_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleGenerateRecommendations}
                      disabled={isLoading}
                      className="btn btn-success w-full"
                    >
                      🤖 Generate AI Recommendations
                    </button>
                    <button
                      onClick={() => router.push('/teacher/upload-report')}
                      className="btn btn-secondary w-full"
                    >
                      📄 Upload Counselor Report
                    </button>
                  </div>
                </div>
              </>
            )}

            {!predictionResult && (
              <div className="card">
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg mb-2">🎯</p>
                  <p>Enter student data and click predict to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
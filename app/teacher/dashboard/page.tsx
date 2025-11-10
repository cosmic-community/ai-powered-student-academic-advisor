'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Teacher {
  id: string
  title: string
  metadata: {
    email?: string
    subjects?: string[]
  }
}

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [stats, setStats] = useState({
    totalStudents: 0,
    highRiskStudents: 0,
    pendingRecommendations: 0,
    activeInterventions: 0
  })

  useEffect(() => {
    // Check teacher session
    const session = localStorage.getItem('teacher_session')
    if (!session) {
      router.push('/teacher/login')
      return
    }

    try {
      const teacherData = JSON.parse(session)
      setTeacher(teacherData)
      fetchDashboardStats()
    } catch (error) {
      router.push('/teacher/login')
    }
  }, [router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/teacher/dashboard-stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('teacher_session')
    router.push('/teacher/login')
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">👨‍🏫 Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {teacher.title}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
            <p className="text-4xl font-bold text-primary">{stats.totalStudents}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">High Risk Students</h3>
            <p className="text-4xl font-bold text-red-600">{stats.highRiskStudents}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Recommendations</h3>
            <p className="text-4xl font-bold text-warning">{stats.pendingRecommendations}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Interventions</h3>
            <p className="text-4xl font-bold text-success">{stats.activeInterventions}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/teacher/predict-risk" className="btn btn-primary text-center">
              🎯 Predict Dropout Risk
            </Link>
            <Link href="/teacher/recommendations" className="btn btn-secondary text-center">
              📋 Review Recommendations
            </Link>
            <Link href="/teacher/students" className="btn btn-secondary text-center">
              👥 View All Students
            </Link>
            <Link href="/teacher/upload-report" className="btn btn-secondary text-center">
              📄 Upload Counselor Report
            </Link>
            <Link href="/teacher/interventions" className="btn btn-secondary text-center">
              🔧 Track Interventions
            </Link>
            <Link href="/teacher/analytics" className="btn btn-secondary text-center">
              📊 View Analytics
            </Link>
          </div>
        </div>

        {/* System Features Overview */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">🤖 AI Dropout Prediction</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Machine learning-based risk assessment</li>
                <li>Four risk levels: Low, Moderate, High, Very High</li>
                <li>Real-time prediction based on student data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">📝 AI Recommendations</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Academic support suggestions</li>
                <li>Financial aid opportunities</li>
                <li>Emotional & psychological resources</li>
                <li>Social & peer support programs</li>
                <li>Time management strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
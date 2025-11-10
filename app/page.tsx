import Link from 'next/link'
import { getStudents, getAssignments, getRecommendations } from '@/lib/cosmic'

export default async function HomePage() {
  const [students, assignments, recommendations] = await Promise.all([
    getStudents(),
    getAssignments(),
    getRecommendations()
  ])

  const pendingAssignments = assignments.filter(a => a.metadata?.status === 'Pending')
  // Changed: Filter for 'Approved' status instead of 'Active' (which doesn't exist for recommendations)
  const activeRecommendations = recommendations.filter(r => r.metadata?.status === 'Approved')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🎓 AI-Powered Student Academic Advisor
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
            <p className="text-4xl font-bold text-primary">{students.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Assignments</h3>
            <p className="text-4xl font-bold text-warning">{pendingAssignments.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Recommendations</h3>
            <p className="text-4xl font-bold text-success">{activeRecommendations.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/students" className="btn btn-primary text-center">
              View All Students
            </Link>
            <Link href="/students/new" className="btn btn-success text-center">
              Add New Student
            </Link>
            <Link href="/assignments" className="btn btn-secondary text-center">
              View Assignments
            </Link>
            <Link href="/recommendations" className="btn btn-secondary text-center">
              View Recommendations
            </Link>
          </div>
        </div>

        {/* Recent Students */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Students</h2>
            <Link href="/students" className="text-primary hover:underline">
              View All →
            </Link>
          </div>
          {students.length === 0 ? (
            <p className="text-gray-500">No students found. Add your first student to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">GPA</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{student.title}</td>
                      <td className="py-3 px-4">{student.metadata?.grade_level || 'N/A'}</td>
                      <td className="py-3 px-4">{student.metadata?.current_gpa?.toFixed(2) || '0.00'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.metadata?.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.metadata?.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link 
                          href={`/students/${student.slug}`}
                          className="text-primary hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
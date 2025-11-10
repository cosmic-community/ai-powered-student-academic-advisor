// app/students/[slug]/page.tsx
import Link from 'next/link'
import { getStudentBySlug, getStudentAssignments, getStudentRecommendations } from '@/lib/cosmic'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { slug } = await params
  const student = await getStudentBySlug(slug)

  if (!student) {
    notFound()
  }

  const [assignments, recommendations] = await Promise.all([
    getStudentAssignments(student.id),
    getStudentRecommendations(student.id)
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{student.title}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/students" className="text-primary hover:underline">
            ← Back to Students
          </Link>
        </div>

        {/* Student Info */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {student.metadata?.profile_image && (
              <img 
                src={`${student.metadata.profile_image.imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
                alt={student.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-gray-900">{student.metadata?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Phone</p>
                <p className="text-gray-900">{student.metadata?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Grade Level</p>
                <p className="text-gray-900">{student.metadata?.grade_level || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Current GPA</p>
                <p className="text-gray-900 text-2xl font-bold">{student.metadata?.current_gpa?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  student.metadata?.status === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.metadata?.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assignments</h2>
          {assignments.length === 0 ? (
            <p className="text-gray-500">No assignments found for this student.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">{assignment.title}</td>
                      <td className="py-3 px-4">{assignment.metadata?.subject || 'N/A'}</td>
                      <td className="py-3 px-4">
                        {assignment.metadata?.due_date 
                          ? new Date(assignment.metadata.due_date).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.metadata?.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : assignment.metadata?.status === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assignment.metadata?.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Recommendations</h2>
          {recommendations.length === 0 ? (
            <p className="text-gray-500">No recommendations found for this student.</p>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.metadata?.status === 'Active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rec.metadata?.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> {rec.metadata?.subject || 'N/A'}
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap">{rec.metadata?.recommendations || 'No recommendations available.'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
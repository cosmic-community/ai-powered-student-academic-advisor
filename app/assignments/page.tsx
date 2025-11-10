import Link from 'next/link'
import { getAssignments } from '@/lib/cosmic'

export default async function AssignmentsPage() {
  const assignments = await getAssignments()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">All Assignments</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {assignments.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No assignments found.</p>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{assignment.title}</td>
                      <td className="py-3 px-4">
                        {assignment.metadata?.student ? (
                          <Link 
                            href={`/students/${assignment.metadata.student.slug}`}
                            className="text-primary hover:underline"
                          >
                            {assignment.metadata.student.title}
                          </Link>
                        ) : 'N/A'}
                      </td>
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
          </div>
        )}
      </main>
    </div>
  )
}
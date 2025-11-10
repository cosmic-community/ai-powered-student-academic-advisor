import Link from 'next/link'
import { getStudents } from '@/lib/cosmic'

export default async function StudentsPage() {
  const students = await getStudents()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">All Students</h1>
            <Link href="/students/new" className="btn btn-primary">
              Add New Student
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No students found. Add your first student to get started.</p>
            <Link href="/students/new" className="btn btn-primary">
              Add New Student
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.id} className="card hover:shadow-lg transition-shadow">
                {student.metadata?.profile_image && (
                  <img 
                    src={`${student.metadata.profile_image.imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
                    alt={student.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{student.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Grade:</strong> {student.metadata?.grade_level || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>GPA:</strong> {student.metadata?.current_gpa?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {student.metadata?.email || 'N/A'}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    student.metadata?.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.metadata?.status || 'Active'}
                  </span>
                </div>
                <Link 
                  href={`/students/${student.slug}`}
                  className="btn btn-primary w-full text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
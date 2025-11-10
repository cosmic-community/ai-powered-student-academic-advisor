import Link from 'next/link'
import StudentForm from '@/components/StudentForm'

export default function NewStudentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/students" className="text-primary hover:underline">
            ← Back to Students
          </Link>
        </div>

        <div className="card">
          <StudentForm />
        </div>
      </main>
    </div>
  )
}
import Link from 'next/link'
import { getRecommendations } from '@/lib/cosmic'

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No recommendations found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{rec.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.metadata?.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rec.metadata?.status || 'Active'}
                  </span>
                </div>
                {rec.metadata?.student && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Student:</strong>{' '}
                    <Link 
                      href={`/students/${rec.metadata.student.slug}`}
                      className="text-primary hover:underline"
                    >
                      {rec.metadata.student.title}
                    </Link>
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Subject:</strong> {rec.metadata?.subject || 'N/A'}
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {rec.metadata?.recommendations || 'No recommendations available.'}
                </p>
                {rec.metadata?.generated_date && (
                  <p className="text-xs text-gray-500 mt-4">
                    Generated: {new Date(rec.metadata.generated_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StudentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    email: '',
    grade_level: '',
    phone: '',
    parent_contact: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        router.push('/students')
        router.refresh()
      } else {
        alert('Failed to create student')
      }
    } catch (error) {
      console.error('Error creating student:', error)
      alert('Failed to create student')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="label">
          Student Name *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="input"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="input"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="grade_level" className="label">
          Grade Level *
        </label>
        <select
          id="grade_level"
          name="grade_level"
          required
          className="input"
          value={formData.grade_level}
          onChange={handleChange}
        >
          <option value="">Select Grade Level</option>
          <option value="6th Grade">6th Grade</option>
          <option value="7th Grade">7th Grade</option>
          <option value="8th Grade">8th Grade</option>
          <option value="9th Grade">9th Grade</option>
          <option value="10th Grade">10th Grade</option>
          <option value="11th Grade">11th Grade</option>
          <option value="12th Grade">12th Grade</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="label">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="input"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="parent_contact" className="label">
          Parent/Guardian Contact
        </label>
        <input
          type="text"
          id="parent_contact"
          name="parent_contact"
          className="input"
          value={formData.parent_contact}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex-1"
        >
          {isSubmitting ? 'Creating...' : 'Create Student'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
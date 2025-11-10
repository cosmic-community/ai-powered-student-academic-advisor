import { NextResponse } from 'next/server'
import { createStudent } from '@/lib/cosmic'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const result = await createStudent({
      title: data.title,
      email: data.email,
      grade_level: data.grade_level,
      phone: data.phone,
      parent_contact: data.parent_contact
    })
    
    return NextResponse.json({ 
      success: true, 
      student: result.object 
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
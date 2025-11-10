# 🎓 AI-Powered Student Academic Advisor

![App Preview](https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=300&fit=crop&auto=format)

A modern academic management platform that leverages AI to provide personalized learning recommendations for students. Teachers can manage student profiles, track assignments, upload academic reports, and receive AI-generated insights to help improve student performance.

## ✨ Features

- **Student Management Dashboard** - Comprehensive student profile management with academic tracking
- **AI-Powered Recommendations** - Generate personalized learning suggestions using advanced AI
- **Assignment Tracking** - Monitor homework assignments and completion status across subjects
- **Report Upload & Analysis** - Upload and analyze student academic reports
- **Performance Monitoring** - Track student grades and progress across multiple subjects
- **Teacher Portal** - Dedicated interface for teachers to manage their students
- **Subject-Specific Tracking** - Monitor performance in Math, Science, English, History, and more
- **Real-time Updates** - Dynamic content updates powered by Cosmic CMS

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=6912108bfb7423bbdde503f9&clone_repository=69121181fb7423bbdde5040c)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a student academic advisor system with AI-powered recommendations. Include student profiles, academic reports, assignments, and AI-generated learning suggestions."

### Code Generation Prompt

> "Build a teacher dashboard application where teachers can manage students, upload academic reports, assign homework, and review AI-generated recommendations for improving student performance. The app should track students across multiple subjects (Math, Science, English, History) with grade monitoring and assignment tracking."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠 Technologies

- **Next.js 16** - React framework with App Router architecture
- **TypeScript** - Type-safe development with strict mode
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Cosmic CMS** - Headless CMS for content management
- **@cosmicjs/sdk** - Official Cosmic JavaScript SDK
- **React Server Components** - Optimized server-side rendering
- **Bun** - Fast JavaScript runtime and package manager

## 📋 Prerequisites

- Node.js 18+ or Bun runtime
- A Cosmic account and bucket
- Basic knowledge of React and Next.js

## 🚀 Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

**Important:** Never commit `.env.local` to version control. It's already included in `.gitignore`.

### 3. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

```bash
bun run build
bun run start
```

## 📚 Cosmic SDK Examples

### Fetching Students

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all students with their academic data
const { objects: students } = await cosmic.objects
  .find({ type: 'students' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Get a single student by slug
const { object: student } = await cosmic.objects
  .findOne({ type: 'students', slug: 'john-doe' })
  .depth(1)
```

### Creating Assignments

```typescript
// Create a new assignment for a student
await cosmic.objects.insertOne({
  type: 'assignments',
  title: 'Math Homework - Chapter 5',
  metadata: {
    student: studentId, // Reference to student object
    subject: 'Math',
    due_date: '2024-02-15',
    status: 'Pending',
    description: 'Complete exercises 1-20 on page 45'
  }
})
```

### Uploading Reports

```typescript
// Upload a report document
const media = await cosmic.media.insertOne({
  media: file, // File object from form upload
  folder: 'academic-reports'
})

// Create report record with uploaded file
await cosmic.objects.insertOne({
  type: 'reports',
  title: `${studentName} - Q1 Report Card`,
  metadata: {
    student: studentId,
    report_file: media.media.name, // Reference uploaded file
    upload_date: new Date().toISOString(),
    quarter: 'Q1'
  }
})
```

### Generating AI Recommendations

```typescript
// Store AI-generated recommendations
await cosmic.objects.insertOne({
  type: 'recommendations',
  title: `Learning Plan for ${studentName}`,
  metadata: {
    student: studentId,
    subject: 'Math',
    recommendations: aiGeneratedText,
    generated_date: new Date().toISOString(),
    status: 'Active'
  }
})
```

## 🔧 Cosmic CMS Integration

This application uses Cosmic CMS to manage all academic data:

### Object Types

1. **Students** - Student profiles with academic information
   - Name, contact details, grade level
   - Current GPA and performance metrics
   - Enrollment date and status

2. **Assignments** - Homework and task tracking
   - Assignment title and description
   - Due dates and completion status
   - Subject categorization
   - Student references

3. **Reports** - Academic reports and documents
   - Uploaded report files
   - Quarter/semester information
   - Upload dates and student references

4. **Recommendations** - AI-generated learning suggestions
   - Personalized study plans
   - Subject-specific recommendations
   - Generation date and status
   - Student references

5. **Teachers** - Teacher account management
   - Teacher profiles and credentials
   - Assigned students
   - Dashboard preferences

### Content Structure

The application leverages Cosmic's object metafields for relationships:
- **Object metafields** - Connect students to assignments, reports, and recommendations
- **File metafields** - Store uploaded academic reports and documents
- **Select-dropdown metafields** - Track status values (Pending, Completed, Active)
- **Date metafields** - Manage due dates and upload timestamps

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables:
   - `COSMIC_BUCKET_SLUG`
   - `COSMIC_READ_KEY`
   - `COSMIC_WRITE_KEY`
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository in Netlify
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Configure environment variables in Netlify dashboard
6. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key
- `COSMIC_WRITE_KEY` - Your Cosmic write key

## 📖 Additional Resources

- [Cosmic Documentation](https://www.cosmicjs.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Support

Need help? Check out the [Cosmic Community](https://www.cosmicjs.com/community) or [open an issue](https://github.com/cosmicjs/cosmic-sdk/issues).

<!-- README_END -->
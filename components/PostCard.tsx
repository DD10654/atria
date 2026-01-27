
import Link from 'next/link'
import { Calendar, User, BookOpen, GraduationCap } from 'lucide-react'

interface PostProps {
    post: {
        id: string
        post_type: 'tutor_request' | 'tutor_offer' | 'extracurricular'
        description: string
        subjects?: string[]
        date?: string
        user: {
            username: string
            year?: string
            account_type: string
        }
        created_at: string
    }
}

export default function PostCard({ post }: PostProps) {
    const isExtracurricular = post.post_type === 'extracurricular'

    const typeLabel = {
        'tutor_request': 'Requesting Help',
        'tutor_offer': 'Offering Help',
        'extracurricular': 'Activity'
    }[post.post_type]

    const typeColor = {
        'tutor_request': 'bg-blue-100 text-blue-800',
        'tutor_offer': 'bg-green-100 text-green-800',
        'extracurricular': 'bg-purple-100 text-purple-800'
    }[post.post_type]

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                        <Link href={`/account/${post.user?.username}`} className="font-semibold text-gray-900 hover:text-indigo-600">
                            {post.user?.username || 'Unknown User'}
                        </Link>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            {post.user?.account_type === 'student' && (
                                <span className="capitalize">{post.user.year}</span>
                            )}
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}>
                    {typeLabel}
                </span>
            </div>

            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.description}</p>

            {!isExtracurricular && post.subjects && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.subjects.map((subject, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {subject}
                        </span>
                    ))}
                </div>
            )}

            {isExtracurricular && post.date && (
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md inline-flex">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                    Event Date: {new Date(post.date).toLocaleDateString()}
                </div>
            )}
        </div>
    )
}


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/context/auth-context'
import Navbar from '@/components/Navbar'

export default function PostPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Form fields
    const [description, setDescription] = useState('')
    const [subjects, setSubjects] = useState<string[]>([])
    const [subjectInput, setSubjectInput] = useState('')
    const [date, setDate] = useState('')

    useEffect(() => {
        if (user) {
            fetchProfile()
        }
    }, [user])

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user!.id)
            .single()

        if (error) {
            console.error('Error fetching profile:', error)
        } else {
            setProfile(data)
        }
        setLoading(false)
    }

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile) return

        let postType = ''
        if (profile.account_type === 'extracurricular_host') {
            postType = 'extracurricular'
        } else {
            // Student
            if (['freshman', 'sophomore'].includes(profile.year)) {
                postType = 'tutor_request'
            } else {
                postType = 'tutor_offer'
            }
        }

        const { error } = await supabase
            .from('posts')
            .insert({
                user_id: user!.id,
                post_type: postType,
                description,
                subjects: postType === 'extracurricular' ? null : subjects,
                date: postType === 'extracurricular' ? date : null,
            })

        if (error) {
            alert('Error creating post: ' + error.message)
        } else {
            router.push('/home')
        }
    }

    const addSubject = () => {
        if (subjectInput.trim() && subjects.length < 5) { // Limit to 5 subjects for UI sanity
            if (subjectInput.length > 20) {
                alert("Subject name too long (max 20 chars)")
                return
            }
            setSubjects([...subjects, subjectInput.trim()])
            setSubjectInput('')
        }
    }

    const removeSubject = (index: number) => {
        setSubjects(subjects.filter((_, i) => i !== index))
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>

    if (!profile) return <div className="p-8 text-center">Profile not found.</div>

    const isStudent = profile.account_type === 'student'
    const isHost = profile.account_type === 'extracurricular_host'
    const isLowerClassman = isStudent && ['freshman', 'sophomore'].includes(profile.year)
    const isUpperClassman = isStudent && ['junior', 'senior'].includes(profile.year)

    const formTitle = isHost ? 'Post an Activity' : (isLowerClassman ? 'Request a Tutor' : 'Offer Tutoring')

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">{formTitle}</h1>

                    <form onSubmit={handleCreatePost} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-gray-400 font-normal">(500 chars max)</span>
                            </label>
                            <textarea
                                required
                                maxLength={500}
                                rows={4}
                                className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what you need help with, what you can teach, or details about the activity..."
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {description.length}/500
                            </div>
                        </div>

                        {isStudent && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        maxLength={20}
                                        className="flex-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        value={subjectInput}
                                        onChange={(e) => setSubjectInput(e.target.value)}
                                        placeholder="e.g. Math, History"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addSubject}
                                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {subjects.map((sub, idx) => (
                                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                            {sub}
                                            <button
                                                type="button"
                                                onClick={() => removeSubject(idx)}
                                                className="ml-2 text-gray-500 hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isHost && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                            >
                                Create Post
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

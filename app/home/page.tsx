
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
    const [posts, setPosts] = useState<any[]>([])
    const [filter, setFilter] = useState<'all' | 'tutor_request' | 'tutor_offer' | 'extracurricular'>('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [filter])

    const fetchPosts = async () => {
        setLoading(true)
        let query = supabase
            .from('posts')
            .select(`
        *,
        user:users (
          username,
          year,
          account_type
        )
      `)
            .order('created_at', { ascending: false })

        if (filter !== 'all') {
            query = query.eq('post_type', filter)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching posts:', error)
        } else {
            setPosts(data || [])
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Community Feed</h1>
                    <Link
                        href="/post"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-1" />
                        New Post
                    </Link>
                </div>

                <div className="mb-6">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white shadow-sm"
                    >
                        <option value="all">All Posts</option>
                        <option value="tutor_request">Tutor Requests</option>
                        <option value="tutor_offer">Tutor Offers</option>
                        <option value="extracurricular">Extracurriculars</option>
                    </select>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-48 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">No posts found. Be the first to post!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

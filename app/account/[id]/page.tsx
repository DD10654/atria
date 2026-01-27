
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/context/auth-context'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import { User as UserIcon, Phone, GraduationCap, Trash2 } from 'lucide-react'

export default function AccountPage() {
    const params = useParams()
    // ID can be UUID or username now based on requirements, but requirement said [id]. 
    // Wait, requirement said "Username on each post is clickable and links here".
    // So likely we should route by username if we want that pretty URL, OR we just link to /account/USER_ID.
    // The PostCard links to `/account/${post.user?.username}` which implies using username.
    // But the file path is `/account/[id]`. I should handle querying by Username OR ID.
    // Or I can just standardise on ID in links to avoid complexity of unique usernames in URL (though usernames are unique).
    // Let's assume the [id] is actually the unique username for friendlier URLs, as implied by PostCard implementation.
    // If params.id is a UUID, I treat it as ID. If not, username.
    // Actually, let's just use username as the identifier in the URL since it's cleaner.

    const idOrUsername = params.id as string

    const { user: currentUser } = useAuth()
    const router = useRouter()

    const [profile, setProfile] = useState<any>(null)
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [idOrUsername])

    const fetchData = async () => {
        setLoading(true)

        // First find the user
        // We'll check if it looks like a UUID or search by username
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUsername)

        let query = supabase.from('users').select('*')
        if (isUuid) {
            query = query.eq('id', idOrUsername)
        } else {
            query = query.eq('username', idOrUsername)
        }

        const { data: userData, error: userError } = await query.single()

        if (userError || !userData) {
            console.error('Error fetching user:', userError)
            setLoading(false)
            return
        }

        setProfile(userData)

        // Then fetch their posts
        const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select(`
        *,
        user:users (
          username,
          year,
          account_type
        )
      `)
            .eq('user_id', userData.id)
            .order('created_at', { ascending: false })

        if (postsError) {
            console.error('Error fetching posts:', postsError)
        } else {
            setPosts(postsData || [])
        }
        setLoading(false)
    }

    const handleDeletePost = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)

        if (error) {
            alert('Error deleting post')
        } else {
            setPosts(posts.filter(p => p.id !== postId))
        }
    }

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen pt-24">Loading...</div>

    if (!profile) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-8 text-center pt-24 text-gray-500">User not found.</div>
        </div>
    )

    const isOwnProfile = currentUser?.id === profile.id

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="h-24 w-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                        <span className="text-3xl font-bold text-indigo-600">{profile.username[0].toUpperCase()}</span>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
                        <div className="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center sm:items-start text-gray-600">
                            {profile.account_type === 'student' && (
                                <span className="flex items-center gap-1.5 capitalize bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    <GraduationCap className="w-4 h-4" />
                                    {profile.year} Student
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                <Phone className="w-4 h-4" />
                                {profile.phone_number}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Posts */}
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                    {isOwnProfile ? 'My Posts' : `${profile.username}'s Posts`}
                </h2>

                {posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
                        No posts yet.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div key={post.id} className="relative group">
                                <PostCard post={post} />
                                {isOwnProfile && (
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-200 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete Post"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

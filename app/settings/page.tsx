
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/context/auth-context'
import Navbar from '@/components/Navbar'

export default function SettingsPage() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (user) {
            fetchProfile()
        }
    }, [user])

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('id', user!.id)
            .single()

        if (error) {
            console.error('Error fetching profile:', error)
        } else {
            setUsername(data?.username || '')
        }
        setLoading(false)
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')
        const { error } = await supabase
            .from('users')
            .update({ username })
            .eq('id', user!.id)

        if (error) {
            setMessage('Error updating profile: ' + error.message)
        } else {
            setMessage('Profile updated successfully!')
        }
    }

    const handleDeleteAccount = async () => {
        // No confirmation dialog needed per requirements.
        // Call the service-level deletion function
        const { error } = await supabase.rpc('delete_own_user')

        if (error) {
            setMessage('Error deleting account: ' + error.message)
            return
        }

        // Sign out locally
        await signOut()
        router.push('/')
    }

    if (loading) return <div className="p-8 text-center pt-24 bg-gray-50 min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">Account Settings</h1>

                    {message && (
                        <div className={`p-4 rounded-md mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Password</div>
                            <button
                                type="button"
                                onClick={() => alert("Password reset functionality would typically involve sending a reset email via Supabase Auth.")}
                                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                            >
                                Reset Password via Email
                            </button>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Once you delete your account, there is no going back. All your posts will be permanently deleted.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm font-medium"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

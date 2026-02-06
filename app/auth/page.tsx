
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // Signup specific fields
    const [accountType, setAccountType] = useState<'student' | 'extracurricular_host'>('student')
    const [year, setYear] = useState<'freshman' | 'sophomore' | 'junior' | 'senior'>('freshman')
    const [username, setUsername] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/home')
            } else {
                // Signup Flow
                // 1. Check if username is already taken
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('id')
                    .eq('username', username)
                    .single()

                if (existingUser) {
                    throw new Error('Username is already taken. Please choose another one.')
                }

                // 2. Sign up with Supabase Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username,
                            phone_number: phoneNumber,
                            account_type: accountType,
                            year: accountType === 'student' ? year : null,
                        }
                    }
                })

                if (authError) throw authError

                if (authData.session) {
                    router.push('/home')
                } else {
                    setSuccessMessage('Registration successful! Please check your email for a confirmation link.')
                    setEmail('')
                    setPassword('')
                    setUsername('')
                    setPhoneNumber('')
                }
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg-alt p-4">
            <div className="max-w-md w-full bg-brand-bg rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-brand-text">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm border border-green-200">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-text">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-brand-text">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-text">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-text">Account Type</label>
                                <select
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                                    value={accountType}
                                    onChange={(e) => setAccountType(e.target.value as any)}
                                >
                                    <option value="student">Student</option>
                                    <option value="extracurricular_host">Extracurricular Host</option>
                                </select>
                            </div>

                            {accountType === 'student' && (
                                <div>
                                    <label className="block text-sm font-medium text-brand-text">Year</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value as any)}
                                    >
                                        <option value="freshman">Freshman</option>
                                        <option value="sophomore">Sophomore</option>
                                        <option value="junior">Junior</option>
                                        <option value="senior">Senior</option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-text bg-brand-accent hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-medium text-brand-text hover:text-brand-text/80"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

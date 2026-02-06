
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

    return (
        <nav className="bg-brand-bg border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href={user ? "/home" : "/"} className="flex-shrink-0 flex items-center">
                            <Image
                                src="/text-logo.png"
                                alt="Atria"
                                width={80}
                                height={32}
                                className="h-16 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        {user ? (
                            <>
                                <Link href="/home" className="text-brand-text hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Home
                                </Link>
                                <Link href={`/account/${user.id}`} className="text-brand-text hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Profile
                                </Link>
                                <Link href="/settings" className="p-2 text-brand-text hover:text-brand-accent transition-colors">
                                    <Settings className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-brand-text bg-brand-accent hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth"
                                className="flex items-center gap-2 px-6 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-brand-text bg-brand-accent hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-brand-text hover:text-brand-text/80 hover:bg-brand-bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-accent"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden absolute top-16 left-0 right-0 bg-brand-bg border-b border-gray-100 shadow-lg">
                    <div className="pt-2 pb-3 space-y-1">
                        {user ? (
                            <>
                                <Link
                                    href="/home"
                                    className="bg-brand-accent/20 border-l-4 border-brand-accent text-brand-text block pl-3 pr-4 py-2 text-base font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href={`/account/${user.id}`}
                                    className="border-transparent text-gray-500 hover:bg-brand-bg-alt hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="border-transparent text-gray-500 hover:bg-brand-bg-alt hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        handleSignOut()
                                        setMobileMenuOpen(false)
                                    }}
                                    className="w-full text-left border-transparent text-gray-500 hover:bg-brand-bg-alt hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth"
                                className="w-full text-left border-transparent text-gray-500 hover:bg-brand-bg-alt hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

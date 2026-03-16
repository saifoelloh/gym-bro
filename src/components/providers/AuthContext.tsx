'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    nickname: string | null
    signIn: (email: string, password: string) => Promise<{ error: any }>
    signUp: (email: string, password: string, nickname: string) => Promise<{ error: any }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [nickname, setNickname] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const token = session?.access_token
            if (token) {
                document.cookie = `sb-access-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`
            }
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                setNickname(session.user.user_metadata?.nickname || null)
            }
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event, session?.user?.email)
            setSession(session)
            setUser(session?.user ?? null)
            
            // Sync to cookie for BFF
            if (session?.access_token) {
                document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`
            } else {
                document.cookie = `sb-access-token=; path=/; max-age=0; SameSite=Lax;`
            }

            if (session?.user) {
                setNickname(session.user.user_metadata?.nickname || null)
            } else {
                setNickname(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        console.log('Attempting signIn for:', email)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) console.error('SignIn error:', error)
        return { error }
    }

    const signUp = async (email: string, password: string, nickname: string) => {
        console.log('Attempting signUp for:', email, nickname)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nickname: nickname
                }
            }
        })
        if (error) console.error('SignUp error:', error)
        return { error }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, nickname, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

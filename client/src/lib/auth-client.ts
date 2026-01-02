import { createAuthClient } from "better-auth/react"

// Use imported environment variables
const baseURL = import.meta.env.VITE_BASEURL || 'http://localhost:3000';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:3000';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const authClient = createAuthClient({
    baseURL: baseURL,
    fetchOptions: {
        credentials: 'include',
        headers: {
            'Origin': window.location.origin
        }
    },
})

export const { signIn, signUp, useSession } = authClient;
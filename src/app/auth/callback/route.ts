
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) { 
  const { searchParams } = request.nextUrl 
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const origin = request.nextUrl.origin 

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
    
          get(name: string): string | undefined {
            const cookie = cookieStore.get(name)
            return cookie?.value
          },
     
          set(name: string, value: string, options: CookieOptions): void {
            try {
    
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.error(`Failed to set cookie '${name}':`, error)
     
            }
          },
      
          remove(name: string, options: CookieOptions): void {
            try {
   
              cookieStore.set({ name, value: '', ...options })

            } catch (error) {
              console.error(`Failed to remove cookie '${name}':`, error)
        
            }
          },
        },
      }
    )


    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
 
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('Supabase code exchange error:', error.message)
  } else {

    console.error('Auth callback error: No code parameter found in URL')
  }


  console.warn('Redirecting user to auth error page.')
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
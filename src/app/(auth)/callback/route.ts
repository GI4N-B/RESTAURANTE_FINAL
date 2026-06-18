import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, nextUrl } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, nextUrl.origin));
    }
  }

  // Retornar al login en caso de error de intercambio de código
  return NextResponse.redirect(new URL('/login?error=auth-callback-failed', nextUrl.origin));
}
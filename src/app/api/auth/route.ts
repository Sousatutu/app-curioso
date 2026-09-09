import { NextResponse } from 'next/server';
import { verifyCredentials, createSessionToken, verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuário e senha são obrigatórios' }, { status: 400 });
    }

    const isValid = verifyCredentials(username.trim(), password);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = createSessionToken(username.trim());
    const cookieStore = await cookies();

    cookieStore.set('curioso_session', token, {
      httpOnly: true,
      secure: false, // http em rede local
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return NextResponse.json({ success: true, username: username.trim() });
  } catch {
    return NextResponse.json({ error: 'Erro interno ao autenticar' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('curioso_session');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao deslogar' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('curioso_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const session = verifySessionToken(sessionCookie.value);
    if (!session.valid) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, username: session.username });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

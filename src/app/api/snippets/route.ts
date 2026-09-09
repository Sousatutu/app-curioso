import { NextResponse } from 'next/server';
import { getDbData, saveDbData } from '@/lib/db';

export async function GET() {
  const data = await getDbData();
  return NextResponse.json(data.snippets || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await getDbData();

  if (!data.snippets) data.snippets = [];

  const newSnippet = {
    id: Date.now().toString(),
    title: body.title,
    code: body.code,
    language: body.language || 'bash',
    createdAt: new Date().toISOString()
  };

  data.snippets.push(newSnippet);
  await saveDbData(data);
  return NextResponse.json(newSnippet, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await getDbData();

  if (!data.snippets) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  const index = data.snippets.findIndex((s: any) => s.id === body.id);
  if (index === -1) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  data.snippets[index] = { ...data.snippets[index], ...body };
  await saveDbData(data);

  return NextResponse.json(data.snippets[index], { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = await getDbData();

  if (data.snippets) {
    data.snippets = data.snippets.filter((s: any) => s.id !== id);
    await saveDbData(data);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

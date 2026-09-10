import { NextResponse } from 'next/server';
import { getDbData, saveDbData } from '@/lib/db';

export async function GET() {
  const data = await getDbData();
  return NextResponse.json(data.routines || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await getDbData();
  
  if (!data.routines) data.routines = [];

  const newRoutine = {
    id: Date.now().toString(),
    title: body.title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  data.routines.push(newRoutine);
  await saveDbData(data);
  return NextResponse.json(newRoutine, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await getDbData();
  
  if (!data.routines) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  if (body.action === 'RESET_ALL') {
    data.routines = data.routines.map((r: any) => ({ ...r, completed: false }));
    await saveDbData(data);
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const index = data.routines.findIndex((r: any) => r.id === body.id);
  if (index === -1) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  data.routines[index] = { ...data.routines[index], ...body };
  await saveDbData(data);
  
  return NextResponse.json(data.routines[index], { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = await getDbData();
  
  if (data.routines) {
    data.routines = data.routines.filter((r: any) => r.id !== id);
    await saveDbData(data);
  }
  
  return NextResponse.json({ success: true }, { status: 200 });
}

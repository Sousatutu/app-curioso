import { NextResponse } from 'next/server';
import { getDbData, saveDbData } from '@/lib/db';

export async function GET() {
  const data = await getDbData();
  // Normalizar tarefas antigas que tinham apenas status PENDING/DONE
  const tasks = (data.tasks || []).map((t: any) => {
    let status = t.status;
    if (status === 'PENDING') status = 'TODO';
    return {
      ...t,
      status: status || 'TODO',
      priority: t.priority || 'MEDIUM',
      category: t.category || 'Geral',
    };
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await getDbData();
  
  if (!data.tasks) data.tasks = [];

  const newTask = {
    id: Date.now().toString(),
    title: body.title,
    status: body.status || 'TODO', // 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
    priority: body.priority || 'MEDIUM', // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    category: body.category || 'Geral',
    createdAt: new Date().toISOString()
  };

  data.tasks.push(newTask);
  await saveDbData(data);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await getDbData();
  
  if (!data.tasks) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  const index = data.tasks.findIndex((t: any) => t.id === body.id);
  if (index === -1) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });

  data.tasks[index] = { ...data.tasks[index], ...body };
  await saveDbData(data);
  
  return NextResponse.json(data.tasks[index], { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = await getDbData();
  
  if (data.tasks) {
    data.tasks = data.tasks.filter((t: any) => t.id !== id);
    await saveDbData(data);
  }
  
  return NextResponse.json({ success: true }, { status: 200 });
}

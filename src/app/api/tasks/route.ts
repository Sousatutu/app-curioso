import { NextResponse } from 'next/server';
import { getDbData, saveDbData } from '@/lib/db';

export async function GET() {
  const data = await getDbData();
  return NextResponse.json(data.tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await getDbData();
  
  const newTask = {
    id: Date.now().toString(),
    title: body.title,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  data.tasks.push(newTask);
  await saveDbData(data);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await getDbData();
  
  // Encontra a tarefa e atualiza os dados mesclando o que veio na requisição
  const index = data.tasks.findIndex((t: any) => t.id === body.id);
  if (index === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

  data.tasks[index] = { ...data.tasks[index], ...body };
  await saveDbData(data);
  
  return NextResponse.json(data.tasks[index], { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = await getDbData();
  
  // Filtra removendo a tarefa com o ID passado
  data.tasks = data.tasks.filter((t: any) => t.id !== id);
  await saveDbData(data);
  
  return NextResponse.json({ success: true }, { status: 200 });
}

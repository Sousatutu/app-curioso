'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TasksNavIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const SnippetsNavIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');
  const router = useRouter();

  const fetchTasks = () => {
    fetch('/api/tasks')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return [];
        }
        return res.json();
      })
      .then(setTasks)
      .catch(() => {});
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setTitle('');
      fetchTasks();
    }
  };

  const toggleStatus = async (task: any) => {
    const newStatus = task.status === 'PENDING' ? 'DONE' : 'PENDING';
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, status: newStatus }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const startEditing = (task: any) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: editTitle }),
    });
    setEditingId(null);
    fetchTasks();
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'PENDING') return task.status === 'PENDING';
    if (filter === 'DONE') return task.status === 'DONE';
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Elegante */}
      <aside className="w-72 bg-slate-900/95 border-r border-slate-800/80 p-6 flex flex-col justify-between backdrop-blur-md">
        <div className="flex flex-col">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950/60 rounded-[14px] flex items-center justify-center text-white font-black text-xl">
                C
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">
                Curi<span className="text-indigo-400">oso</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">v2.0 • arthur01</p>
            </div>
          </div>

          {/* Navegacao */}
          <nav className="space-y-1.5">
            <Link
              href="/"
              className="flex items-center gap-3.5 bg-indigo-500/15 text-indigo-300 px-4 py-3 rounded-xl border border-indigo-500/25 transition-all font-medium text-sm shadow-sm"
            >
              <TasksNavIcon />
              <span className="flex-1">Tarefas</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full font-mono">
                {pendingTasks}
              </span>
            </Link>
            <Link
              href="/snippets"
              className="flex items-center gap-3.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 px-4 py-3 rounded-xl transition-all font-medium text-sm group"
            >
              <span className="group-hover:text-indigo-400 transition-colors">
                <SnippetsNavIcon />
              </span>
              <span>Snippets</span>
            </Link>
          </nav>
        </div>

        {/* Rodape da Sidebar - Usuario & Logout */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">arthur</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                online
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sair do sistema"
            className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/20"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-10 flex flex-col gap-8 max-w-7xl overflow-y-auto">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Painel de Tarefas</h2>
            <p className="text-slate-400 text-sm mt-1">
              Organize suas demandas diarias, deploys e rotinas de infraestrutura.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl self-start">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas ({totalTasks})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'PENDING'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pendentes ({pendingTasks})
            </button>
            <button
              onClick={() => setFilter('DONE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'DONE'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Concluidas ({completedTasks})
            </button>
          </div>
        </header>

        {/* Dashboard Stats com Progresso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Registrado</p>
              <span className="p-2 rounded-xl bg-slate-800/60 text-indigo-400">
                <TasksNavIcon />
              </span>
            </div>
            <p className="text-4xl font-extrabold text-white tracking-tight">{totalTasks}</p>
            <p className="text-xs text-slate-500 mt-2">Tarefas no banco local data.json</p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Pendentes</p>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="text-4xl font-extrabold text-amber-400 tracking-tight">{pendingTasks}</p>
            <p className="text-xs text-slate-500 mt-2">Demandas aguardando conclusao</p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Concluidas ({progressPercent}%)</p>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckIcon />
              </span>
            </div>
            <p className="text-4xl font-extrabold text-emerald-400 tracking-tight">{completedTasks}</p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card Principal de Gerenciamento */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
          {/* Form Adicionar */}
          <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Adicionar nova tarefa no Curioso..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-2xl px-5 py-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer flex items-center justify-center gap-2 text-sm flex-shrink-0 active:scale-[0.99]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Criar Tarefa</span>
            </button>
          </form>

          {/* Lista de Tarefas */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/60 text-slate-500 mx-auto mb-3 flex items-center justify-center">
                  <TasksNavIcon />
                </div>
                <p className="text-slate-400 font-medium text-sm">Nenhuma tarefa encontrada neste filtro.</p>
                <p className="text-slate-600 text-xs mt-1">Adicione uma nova tarefa no campo acima.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                    task.status === 'DONE'
                      ? 'bg-slate-950/40 border-slate-800/40 opacity-75'
                      : 'bg-slate-800/30 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  {editingId === task.id ? (
                    <div className="flex-1 flex gap-3 items-center w-full">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(task.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 bg-slate-950 border border-indigo-500 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-slate-300 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 min-w-0 pr-4">
                        <button
                          onClick={() => toggleStatus(task)}
                          className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                            task.status === 'DONE'
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                              : 'border-slate-600 hover:border-indigo-400 text-transparent bg-slate-900/60'
                          }`}
                        >
                          <CheckIcon />
                        </button>
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-sm sm:text-base font-medium transition-all truncate ${
                              task.status === 'DONE'
                                ? 'text-slate-500 line-through decoration-slate-600'
                                : 'text-slate-200'
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.createdAt && (
                            <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Criado em {new Date(task.createdAt).toLocaleDateString('pt-BR')} as{' '}
                              {new Date(task.createdAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => startEditing(task)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all cursor-pointer"
                          title="Editar tarefa"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all cursor-pointer"
                          title="Apagar tarefa"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

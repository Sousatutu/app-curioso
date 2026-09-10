'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  createdAt: string;
}

const COLUMNS: { id: TaskStatus; label: string; color: string; badge: string; border: string }[] = [
  { id: 'TODO', label: 'A Fazer', color: 'text-slate-300', badge: 'bg-slate-800 text-slate-300 border-slate-700', border: 'border-t-slate-500' },
  { id: 'IN_PROGRESS', label: 'Em Andamento', color: 'text-sky-400', badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30', border: 'border-t-sky-500' },
  { id: 'REVIEW', label: 'Em Revisão', color: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', border: 'border-t-amber-500' },
  { id: 'DONE', label: 'Concluído', color: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', border: 'border-t-emerald-500' },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [category, setCategory] = useState('Infra');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>('MEDIUM');
  const [editCategory, setEditCategory] = useState('Infra');
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
      body: JSON.stringify({ title, priority, category, status: 'TODO' }),
    });
    if (res.ok) {
      setTitle('');
      fetchTasks();
    }
  };

  const updateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority || 'MEDIUM');
    setEditCategory(task.category || 'Geral');
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
      body: JSON.stringify({
        id,
        title: editTitle,
        priority: editPriority,
        category: editCategory,
      }),
    });
    setEditingId(null);
    fetchTasks();
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  const getPriorityBadge = (p?: TaskPriority) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'LOW':
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
      default:
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    }
  };

  const getPriorityLabel = (p?: TaskPriority) => {
    switch (p) {
      case 'CRITICAL': return 'Crítica';
      case 'HIGH': return 'Alta';
      case 'LOW': return 'Baixa';
      default: return 'Média';
    }
  };

  // Filtragem de busca
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/95 border-r border-slate-800/80 p-6 flex flex-col justify-between backdrop-blur-md flex-shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.jpg" alt="Curioso Logo" className="w-16 h-16 rounded-2xl shadow-lg shadow-indigo-600/30 object-cover" />
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">
                Curi<span className="text-indigo-400">oso</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">v2.5 • Kanban</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <Link
              href="/"
              className="flex items-center gap-3.5 bg-indigo-500/15 text-indigo-300 px-4 py-3 rounded-xl border border-indigo-500/25 transition-all font-medium text-sm shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span className="flex-1">Quadro Kanban</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full font-mono">
                {totalTasks}
              </span>
            </Link>
            <Link
              href="/snippets"
              className="flex items-center gap-3.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 px-4 py-3 rounded-xl transition-all font-medium text-sm group"
            >
              <svg className="w-5 h-5 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Snippets</span>
            </Link>
            <Link
              href="/routines"
              className="flex items-center gap-3.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 px-4 py-3 rounded-xl transition-all font-medium text-sm group"
            >
              <svg className="w-5 h-5 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Checklist Diário</span>
            </Link>
          </nav>
        </div>

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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-10 flex flex-col gap-6 overflow-y-auto">
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Quadro de Demandas
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-mono font-medium">
                {progressPercent}% Concluído
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Visualize fluxos de trabalho, altere status e organize rotinas de infraestrutura.
            </p>
          </div>

          {/* Controles de Visualização e Busca */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar demandas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'KANBAN'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Kanban
              </button>
              <button
                onClick={() => setViewMode('LIST')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'LIST'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Lista
              </button>
            </div>
          </div>
        </header>

        {/* Form para Adicionar Rápido */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 backdrop-blur-md">
          <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Descreva uma nova tarefa ou demanda..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Infra">Infraestrutura</option>
                <option value="Segurança">Segurança</option>
                <option value="Deploy">Deploy</option>
                <option value="Bug">Correção</option>
                <option value="Rotina">Rotina</option>
                <option value="Geral">Geral</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Adicionar</span>
              </button>
            </div>
          </form>
        </div>

        {/* VISÃO KANBAN */}
        {viewMode === 'KANBAN' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
            {COLUMNS.map((col) => {
              const columnTasks = filteredTasks.filter((t) => t.status === col.id);

              return (
                <div
                  key={col.id}
                  className={`bg-slate-900/60 border border-slate-800/80 border-t-4 ${col.border} rounded-2xl p-4 flex flex-col gap-3 min-h-[450px]`}
                >
                  {/* Cabeçalho da Coluna */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${col.color}`}>{col.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-mono font-semibold ${col.badge}`}>
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards da Coluna */}
                  <div className="flex flex-col gap-3 flex-1">
                    {columnTasks.length === 0 ? (
                      <div className="h-32 flex items-center justify-center border border-dashed border-slate-800/80 rounded-xl text-slate-600 text-xs">
                        Nenhuma demanda
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 p-4 rounded-xl shadow-md transition-all group flex flex-col gap-3"
                        >
                          {editingId === task.id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="bg-slate-900 border border-indigo-500 rounded-lg p-2 text-xs text-slate-100"
                              />
                              <div className="flex gap-2">
                                <select
                                  value={editPriority}
                                  onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                                  className="bg-slate-900 border border-slate-700 rounded-lg p-1 text-[11px] flex-1"
                                >
                                  <option value="LOW">Baixa</option>
                                  <option value="MEDIUM">Média</option>
                                  <option value="HIGH">Alta</option>
                                  <option value="CRITICAL">Crítica</option>
                                </select>
                                <select
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                  className="bg-slate-900 border border-slate-700 rounded-lg p-1 text-[11px] flex-1"
                                >
                                  <option value="Infra">Infra</option>
                                  <option value="Segurança">Segurança</option>
                                  <option value="Deploy">Deploy</option>
                                  <option value="Bug">Bug</option>
                                  <option value="Rotina">Rotina</option>
                                  <option value="Geral">Geral</option>
                                </select>
                              </div>
                              <div className="flex justify-end gap-1.5 mt-1">
                                <button
                                  onClick={cancelEdit}
                                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px]"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => saveEdit(task.id)}
                                  className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[11px] font-semibold"
                                >
                                  Salvar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Topo do Card: Tags */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                                  {task.category || 'Geral'}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${getPriorityBadge(task.priority)}`}>
                                  {getPriorityLabel(task.priority)}
                                </span>
                              </div>

                              {/* Título */}
                              <p className="text-sm font-medium text-slate-200 leading-snug break-words">
                                {task.title}
                              </p>

                              {/* Controles de Estágio do Kanban */}
                              <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                                {/* Botões para mover estágio */}
                                <div className="flex items-center gap-1">
                                  {col.id !== 'TODO' && (
                                    <button
                                      onClick={() => {
                                        const prev = col.id === 'DONE' ? 'REVIEW' : col.id === 'REVIEW' ? 'IN_PROGRESS' : 'TODO';
                                        updateTaskStatus(task.id, prev);
                                      }}
                                      title="Voltar estágio"
                                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                                    >
                                      ◀
                                    </button>
                                  )}

                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {new Date(task.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                  </span>

                                  {col.id !== 'DONE' && (
                                    <button
                                      onClick={() => {
                                        const next = col.id === 'TODO' ? 'IN_PROGRESS' : col.id === 'IN_PROGRESS' ? 'REVIEW' : 'DONE';
                                        updateTaskStatus(task.id, next);
                                      }}
                                      title="Avançar estágio"
                                      className="p-1 rounded hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 text-xs cursor-pointer font-bold"
                                    >
                                      ▶
                                    </button>
                                  )}
                                </div>

                                {/* Ações de Edição e Delete */}
                                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => startEditing(task)}
                                    title="Editar"
                                    className="p-1 text-slate-400 hover:text-indigo-400 rounded cursor-pointer"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    title="Apagar"
                                    className="p-1 text-slate-400 hover:text-rose-400 rounded cursor-pointer"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VISÃO EM LISTA */}
        {viewMode === 'LIST' && (
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">Nenhuma demanda encontrada.</div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <option value="TODO">A Fazer</option>
                      <option value="IN_PROGRESS">Em Andamento</option>
                      <option value="REVIEW">Revisão</option>
                      <option value="DONE">Concluído</option>
                    </select>

                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm font-medium ${task.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{task.category || 'Geral'}</span>
                        <span className="text-slate-600">•</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

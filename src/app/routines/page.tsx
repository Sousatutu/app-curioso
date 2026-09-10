'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Routine {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    const res = await fetch('/api/routines');
    if (res.ok) {
      const data = await res.json();
      setRoutines(data);
    }
  };

  const addRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await fetch('/api/routines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    setNewTitle('');
    fetchRoutines();
  };

  const toggleRoutine = async (routine: Routine) => {
    await fetch('/api/routines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: routine.id, completed: !routine.completed }),
    });
    fetchRoutines();
  };

  const deleteRoutine = async (id: string) => {
    await fetch('/api/routines?id=' + id, { method: 'DELETE' });
    fetchRoutines();
  };

  const resetAll = async () => {
    if (!confirm('Deseja realmente desmarcar todas as tarefas do dia?')) return;
    await fetch('/api/routines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'RESET_ALL' }),
    });
    fetchRoutines();
  };

  const completedCount = routines.filter(r => r.completed).length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/95 border-r border-slate-800/80 p-6 flex flex-col justify-between backdrop-blur-md flex-shrink-0">
        <div className="flex flex-col">
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
              <p className="text-xs text-slate-400 font-mono mt-1">v2.6 &bull; Rotinas</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <Link
              href="/"
              className="flex items-center gap-3.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 px-4 py-3 rounded-xl transition-all font-medium text-sm group"
            >
              <svg className="w-5 h-5 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span>Quadro Kanban</span>
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
              className="flex items-center gap-3.5 bg-indigo-500/15 text-indigo-300 px-4 py-3 rounded-xl border border-indigo-500/25 transition-all font-medium text-sm shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="flex-1">Checklist Diário</span>
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
          <form action="/api/auth/logout" method="POST">
            <button className="text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-x-auto">
        <div className="min-w-max md:min-w-0 p-8 lg:p-12 max-w-4xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Checklist do Dia
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white mb-2">
                Rotinas <span className="text-indigo-400">Diárias</span>
              </h2>
              <p className="text-slate-400 text-sm">
                Gerencie suas tarefas recorrentes. Zere o progresso a cada novo dia.
              </p>
            </div>
            
            <button 
              onClick={resetAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm border border-slate-700/50"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Zerar Dia
            </button>
          </header>

          {/* Form */}
          <form onSubmit={addRoutine} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-2 flex items-center gap-2 mb-8 shadow-inner">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Adicionar nova tarefa de rotina..."
              className="flex-1 bg-transparent border-none text-slate-200 text-sm px-4 py-2 focus:ring-0 placeholder:text-slate-600 outline-none"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/25">
              Adicionar
            </button>
          </form>

          {/* List */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden">
            {routines.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                Nenhuma rotina configurada. Adicione uma acima.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {routines.map((routine) => (
                  <div key={routine.id} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors group">
                    <label className="flex items-center gap-4 cursor-pointer flex-1">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={routine.completed}
                          onChange={() => toggleRoutine(routine)}
                          className="peer appearance-none w-6 h-6 border-2 border-slate-600 rounded bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                        />
                        <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={routine.completed ? 'text-sm font-medium transition-colors text-slate-500 line-through' : 'text-sm font-medium transition-colors text-slate-200'}>
                        {routine.title}
                      </span>
                    </label>
                    <button 
                      onClick={() => deleteRoutine(routine.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-400 transition-all rounded-lg hover:bg-slate-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {routines.length > 0 && (
            <div className="mt-4 flex items-center justify-between px-4 text-xs font-mono font-semibold">
              <span className="text-slate-500">Total: {routines.length}</span>
              <span className={completedCount === routines.length ? 'text-emerald-400' : 'text-indigo-400'}>
                {completedCount} concluídas
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

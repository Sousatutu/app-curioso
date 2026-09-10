'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
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

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('bash');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editLanguage, setEditLanguage] = useState('bash');
  const router = useRouter();

  const fetchSnippets = () => {
    fetch('/api/snippets')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return [];
        }
        return res.json();
      })
      .then(setSnippets)
      .catch(() => {});
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const addSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const res = await fetch('/api/snippets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, code, language }),
    });

    if (res.ok) {
      setTitle('');
      setCode('');
      setLanguage('bash');
      fetchSnippets();
    }
  };

  const deleteSnippet = async (id: string) => {
    await fetch(`/api/snippets?id=${id}`, { method: 'DELETE' });
    fetchSnippets();
  };

  const startEditing = (snippet: any) => {
    setEditingId(snippet.id);
    setEditTitle(snippet.title);
    setEditCode(snippet.code);
    setEditLanguage(snippet.language || 'bash');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditCode('');
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim() || !editCode.trim()) return;

    await fetch('/api/snippets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: editTitle, code: editCode, language: editLanguage }),
    });

    setEditingId(null);
    fetchSnippets();
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'bash':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'powershell':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'sql':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'csharp':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'javascript':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-700';
    }
  };

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
              className="flex items-center gap-3.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 px-4 py-3 rounded-xl transition-all font-medium text-sm group"
            >
              <span className="group-hover:text-indigo-400 transition-colors">
                <TasksNavIcon />
              </span>
              <span>Tarefas</span>
            </Link>
            <Link
              href="/snippets"
              className="flex items-center gap-3.5 bg-indigo-500/15 text-indigo-300 px-4 py-3 rounded-xl border border-indigo-500/25 transition-all font-medium text-sm shadow-sm"
            >
              <SnippetsNavIcon />
              <span className="flex-1">Snippets</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full font-mono">
                {snippets.length}
              </span>
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

        {/* Rodape da Sidebar */}
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
        <header>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Cofre de Snippets</h2>
          <p className="text-slate-400 text-sm mt-1">
            Armazene e consulte scripts, queries e comandos com copia rapida em um clique.
          </p>
        </header>

        {/* Form Snippet */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Novo Snippet
          </h3>
          <form onSubmit={addSnippet} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Titulo (ex: Instalacao Wazuh Agent)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-slate-950/70 border border-slate-700/80 rounded-2xl px-5 py-3.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950/70 border border-slate-700/80 rounded-2xl px-5 py-3.5 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium cursor-pointer"
              >
                <option value="bash">Bash / Shell</option>
                <option value="powershell">PowerShell</option>
                <option value="sql">SQL</option>
                <option value="csharp">C#</option>
                <option value="javascript">Node.js / JS</option>
                <option value="text">Texto Puro</option>
              </select>
            </div>

            <textarea
              placeholder="Cole o seu script, query ou comando aqui..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={4}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl p-5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm leading-relaxed"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/25 self-end cursor-pointer text-sm active:scale-[0.99]"
            >
              Salvar Snippet
            </button>
          </form>
        </div>

        {/* Grid de Snippets */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {snippets.length === 0 ? (
            <div className="col-span-full text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-slate-950/20">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 text-slate-500 mx-auto mb-3 flex items-center justify-center">
                <SnippetsNavIcon />
              </div>
              <p className="text-slate-400 font-medium text-sm">Nenhum snippet salvo ainda.</p>
              <p className="text-slate-600 text-xs mt-1">Cadastre seus scripts favoritos acima.</p>
            </div>
          ) : (
            snippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-3xl overflow-hidden flex flex-col shadow-xl shadow-black/30 hover:border-slate-700 transition-all"
              >
                {editingId === snippet.id ? (
                  <div className="p-6 flex flex-col gap-4 bg-slate-950/40">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-slate-950 border border-indigo-500 rounded-xl px-4 py-2 text-slate-100 text-sm focus:outline-none"
                      />
                      <select
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
                        className="bg-slate-950 border border-indigo-500 rounded-xl px-3 py-2 text-slate-100 text-sm"
                      >
                        <option value="bash">Bash</option>
                        <option value="powershell">PowerShell</option>
                        <option value="sql">SQL</option>
                        <option value="csharp">C#</option>
                        <option value="javascript">Node.js</option>
                        <option value="text">Texto</option>
                      </select>
                    </div>
                    <textarea
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      rows={5}
                      className="w-full bg-slate-950 border border-indigo-500 rounded-xl p-3 text-slate-100 font-mono text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => saveEdit(snippet.id)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
                      >
                        Salvar Alteracoes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-950/80 border-b border-slate-800/80 px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-mono uppercase font-bold border tracking-wider ${getLanguageColor(
                            snippet.language
                          )}`}
                        >
                          {snippet.language}
                        </span>
                        <h4 className="font-bold text-slate-200 text-sm truncate">{snippet.title}</h4>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(snippet.id, snippet.code)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            copiedId === snippet.id
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 border-transparent'
                          }`}
                          title="Copiar codigo"
                        >
                          {copiedId === snippet.id ? <CheckIcon /> : <CopyIcon />}
                        </button>
                        <button
                          onClick={() => startEditing(snippet)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all cursor-pointer border border-transparent"
                          title="Editar snippet"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => deleteSnippet(snippet.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all cursor-pointer border border-transparent"
                          title="Apagar snippet"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 overflow-x-auto bg-[#0b0f17] flex-1">
                      <pre className="text-xs font-mono text-slate-300 leading-relaxed">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

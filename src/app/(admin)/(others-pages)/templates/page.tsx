'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree, FilePlus, Trash2, Edit3, Loader2, X } from 'lucide-react';
import { getTemplates, createTemplate, deleteTemplate } from './actions';

const DEFAULT_CONTENT: Record<string, string> = {
  html: `<!DOCTYPE html>\n<html>\n<head><style>body { font-family: sans-serif; padding: 20px; }</style></head>\n<body>\n  <h1>Hello, {{name}}!</h1>\n  <p>Your role is: {{role}}</p>\n</body>\n</html>`,
  markdown: `# Hello {{name}}!\n\nYour role is: **{{role}}**`,
  latex: `\\documentclass{article}\n\\begin{document}\nHello \\VAR{name}!\n\nYour role is: \\VAR{role}\n\\end{document}`
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('New Template');
  const [newProjectFormat, setNewProjectFormat] = useState('html');
  const [newProjectVars, setNewProjectVars] = useState('name, role');
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await getTemplates();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    setIsCreating(true);
    try {
      const varsArray = newProjectVars.split(',').map(v => v.trim()).filter(Boolean);
      const newProj = await createTemplate(newProjectName, DEFAULT_CONTENT[newProjectFormat] || "", newProjectFormat, varsArray);
      router.push(`/templates/editor?templateId=${newProj.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to create template");
      setIsCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Delete project "${name}" forever?`)) return;
    try {
      await deleteTemplate(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">All Templates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your templates and documents.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          <FilePlus className="size-5" /> New Template
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-brand-500" size={48} />
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center flex flex-col items-center dark:border-gray-800 dark:bg-white/3">
          <FolderTree className="size-16 text-gray-300 mb-4 dark:text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2 dark:text-white/90">No Templates Yet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create your first template to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => (
            <div 
              key={proj.id}
              onClick={() => router.push(`/templates/editor?templateId=${proj.id}`)}
              className="rounded-2xl border border-gray-200 bg-white p-5 cursor-pointer group hover:border-brand-300 transition-all dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-500/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                  <Edit3 className="size-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-400 uppercase">
                    {proj.format || "html"}
                  </span>
                  <button 
                    onClick={(e) => handleDelete(e, proj.id, proj.name)}
                    className="text-gray-400 hover:text-error-500 transition-colors p-1"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate dark:text-white/90">{proj.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last modified: {new Date(proj.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Create New Template</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-300"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Template Name</label>
                <input 
                  type="text" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Offer_Letter"
                  autoFocus
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Format</label>
                <select 
                  value={newProjectFormat}
                  onChange={(e) => setNewProjectFormat(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
                >
                  <option value="html">HTML</option>
                  <option value="markdown">Markdown</option>
                  <option value="latex">LaTeX</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">CSV Variables</label>
                  <span className="text-xs text-brand-500">email is always included</span>
                </div>
                <input 
                  type="text" 
                  value={newProjectVars}
                  onChange={(e) => setNewProjectVars(e.target.value)}
                  placeholder="name, role, date..."
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500 font-mono text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">These variables form the headers for your batch generation CSV.</p>
              </div>
              
              <div className="mt-2 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreating || !newProjectName.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
                >
                  {isCreating && <Loader2 className="animate-spin size-4" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { Loader2, FileDown, Play, Save, Settings2, Trash2, Upload, Image as ImageIcon, FileText, ChevronLeft, X } from 'lucide-react';
import { getTemplate, updateTemplate } from '../actions';
import { marked } from 'marked';
import { Suspense } from 'react';

function TemplateEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('templateId') || searchParams.get('projectId');

  const [template, setTemplate] = useState<any>(null);
  const [code, setCode] = useState('');
  const [format, setFormat] = useState<'html' | 'markdown' | 'latex'>('html');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Variables Panel State
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);
  const [vars, setVars] = useState<any[]>([]);

  // Preview State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Assets
  const [assets, setAssets] = useState<string[]>([]);
  const [uploadingAsset, setUploadingAsset] = useState(false);

  useEffect(() => {
    if (!templateId) {
      router.push('/dashboard/templates');
      return;
    }
    
    const fetchTemplate = async () => {
      try {
        const [tmpl, resAssets] = await Promise.all([
          getTemplate(templateId),
          fetch(`/api/latex-assets?projectId=${templateId}`).then(res => res.json())
        ]);
        if (tmpl) {
          setTemplate(tmpl);
          setCode(tmpl.content);
          setFormat((tmpl.format as "html" | "latex" | "markdown") || 'html');
        }
        if (resAssets.files) setAssets(resAssets.files);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId, router]);

  // Parse variables
  useEffect(() => {
    const matches = Array.from(code.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}|\\VAR\{([a-zA-Z0-9_]+)\}/g));
    const foundKeys = [...new Set(matches.map(m => m[1] || m[2]).filter(Boolean))];
    
    setVars(current => {
      const newVars = [...current];
      foundKeys.forEach(key => {
        if (!newVars.find(v => v.key === key)) newVars.push({ key, value: `Sample ${key}` });
      });
      return newVars;
    });
  }, [code]);

  const updateVar = (index: number, val: string) => {
    const newVars = [...vars];
    newVars[index].value = val;
    setVars(newVars);
  };

  const handleSave = async () => {
    if (!template) return;
    setIsSaving(true);
    try {
      const keys = vars.map(v => v.key);
      await updateTemplate(template.id, code, template.name, format, keys);
      setTemplate({ ...template, content: code, format, variables: JSON.stringify(keys) });
    } catch (e) {
      console.error(e);
      alert("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async () => {
    if (format !== 'latex') return; // HTML and Markdown are live-previewed
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const variablesMap = vars.reduce((acc, v) => ({ ...acc, [v.key]: v.value }), {});
      const res = await fetch('/api/latex-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexTemplate: code, variables: variablesMap, projectId: templateId }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to generate preview');
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob) + '#toolbar=0&navpanes=0&scrollbar=0';
      setPreviewUrl(url);
    } catch (err: any) {
      setPreviewError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAsset(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', templateId || '');
    try {
      await fetch('/api/latex-assets', { method: 'POST', body: formData });
      const resAssets = await fetch(`/api/latex-assets?projectId=${templateId}`).then(res => res.json());
      if (resAssets.files) setAssets(resAssets.files);
    } finally {
      setUploadingAsset(false);
    }
  };

  const deleteAsset = async (filename: string) => {
    if (!confirm(`Delete asset ${filename}?`)) return;
    try {
      await fetch(`/api/latex-assets?filename=${encodeURIComponent(filename)}&projectId=${templateId}`, { method: 'DELETE' });
      const resAssets = await fetch(`/api/latex-assets?projectId=${templateId}`).then(res => res.json());
      if (resAssets.files) setAssets(resAssets.files);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-[#b04090]" size={48} /></div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white/90">
      {/* Editor Action Bar */}
      <div className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-200 flex-shrink-0 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard/templates')}
            className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1 text-sm font-medium dark:text-gray-400 dark:hover:text-white/90"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="font-mono text-brand-500 text-sm font-medium">{template?.name}</span>
          {code !== template?.content && <span className="text-xs text-warning-500 font-medium italic">Unsaved</span>}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Format Selector */}
          <select 
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="html">HTML</option>
            <option value="markdown">Markdown</option>
            <option value="latex">LaTeX</option>
          </select>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
          <button 
            onClick={() => setIsVariablesOpen(!isVariablesOpen)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 rounded-lg border ${isVariablesOpen ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/10 dark:border-brand-500/30 dark:text-brand-400' : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5'}`}
          >
            <Settings2 size={16} /> Variables ({vars.length})
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="text-gray-600 hover:text-gray-900 px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 dark:text-gray-300 dark:hover:text-white"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} Save
          </button>

          {format === 'latex' && (
            <button 
              onClick={handlePreview}
              disabled={previewLoading}
              className="bg-brand-500 text-white px-4 py-1.5 text-sm font-medium hover:bg-brand-600 transition-colors flex items-center gap-2 rounded-lg disabled:opacity-50 shadow-sm"
            >
              {previewLoading ? <Loader2 className="animate-spin" size={16}/> : <Play size={16} fill="currentColor" />}
              Compile
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar (Assets) */}
        <div className="w-56 bg-white border-r border-gray-200 flex flex-col shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="p-3 border-b border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project Files</span>
          </div>
          <div className="p-2">
            <div className="flex items-center gap-2 p-2 rounded-lg text-gray-700 bg-brand-50 border border-brand-100 cursor-default dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-white/90">
              <FileText size={16} className="text-brand-500" />
              <span className="text-sm font-mono truncate">{template?.name}</span>
            </div>
          </div>

          <div className="p-3 border-b border-gray-100 border-t flex justify-between items-center bg-gray-50/50 mt-2 dark:border-gray-700 dark:bg-gray-800/50">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Images / Assets</span>
            <label className="cursor-pointer text-brand-500 hover:text-brand-600 transition-colors" title="Upload">
              {uploadingAsset ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {assets.map(asset => (
              <div key={asset} className="flex items-center justify-between p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 group cursor-pointer transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5">
                <div className="flex items-center gap-2 overflow-hidden">
                  <ImageIcon size={16} className="flex-shrink-0 text-brand-500" />
                  <span className="text-sm font-mono truncate">{asset}</span>
                </div>
                <button onClick={() => deleteAsset(asset)} className="opacity-0 group-hover:opacity-100 text-error-500 hover:text-error-600 transition-all p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Center Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 dark:border-gray-700">
          <Editor
            height="100%"
            language={format === 'latex' ? 'latex' : format === 'markdown' ? 'markdown' : 'html'}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', padding: { top: 16 } }}
          />
        </div>

        {/* Dynamic Variables Overaly Panel */}
        {isVariablesOpen && (
          <div className="absolute top-0 bottom-0 left-[224px] w-80 bg-white border-r border-gray-200 shadow-xl z-10 animate-in slide-in-from-left flex flex-col dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
              <span className="text-sm font-semibold text-gray-800 dark:text-white/90">Template Variables</span>
              <button onClick={() => setIsVariablesOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">These variables were extracted from your LaTeX code. Provide preview values here.</p>
              {vars.map((v, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono font-medium text-brand-500">{v.key}</span>
                  <input 
                    type="text" 
                    value={v.value} 
                    onChange={(e) => updateVar(i, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:text-white/90"
                  />
                </div>
              ))}
              {vars.length === 0 && (
                <div className="text-center text-sm font-mono text-gray-500 mt-8">No variables found.</div>
              )}
            </div>
          </div>
        )}

        {/* Right Preview */}
        <div className="flex-1 bg-gray-100 flex flex-col relative min-w-0 dark:bg-gray-900/50">
          <div className="flex-1 relative p-4">
            {format === 'html' ? (
              <iframe srcDoc={code} className="w-full h-full border-none rounded-xl bg-white shadow-sm" title="HTML Preview" />
            ) : format === 'markdown' ? (
              <div 
                className="w-full h-full p-4 bg-white rounded-xl shadow-sm overflow-auto prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: marked.parse(code) }} 
              />
            ) : (
              previewError ? (
                <div className="h-full w-full rounded-xl p-4 bg-error-50 text-error-600 font-mono text-sm overflow-auto whitespace-pre-wrap dark:bg-error-500/10 dark:text-error-500">
                  {previewError}
                </div>
              ) : previewUrl ? (
                <iframe src={previewUrl} className="w-full h-full border-none rounded-xl bg-white shadow-sm" title="PDF Preview" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500">
                  <FileDown size={48} className="mb-4 opacity-50" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No Preview Generated</p>
                  <p className="text-xs mt-1">Click 'Compile' to render PDF</p>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function TemplateEditorPage() { 
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 text-gray-500 animate-pulse">
          <div className="h-10 w-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading Editor...</p>
        </div>
      </div>
    }>
      <TemplateEditorContent />
    </Suspense>
  ); 
}

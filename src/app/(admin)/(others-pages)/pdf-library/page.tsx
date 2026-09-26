'use client';

import { useState, useEffect } from 'react';
import { Library, FolderOpen, FileDown, ChevronDown, ChevronRight, Search, Files, Download } from 'lucide-react';

type PdfFile = { name: string; size: number; createdAt: string; relativePath: string };
type Batch = { batchName: string; createdAt: string; fileCount: number; files: PdfFile[] };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatBatchName(name: string) {
  // Strip trailing timestamp like _2026-09-24T12-16-03-643Z
  return name.replace(/_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d+Z$/, '').replace(/_/g, ' ');
}

export default function PdfLibraryPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBatches, setOpenBatches] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/latex-library')
      .then(r => r.json())
      .then(data => {
        setBatches(data.batches || []);
        // Open the first batch by default
        if (data.batches?.length > 0) {
          setOpenBatches({ [data.batches[0].batchName]: true });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleBatch = (name: string) =>
    setOpenBatches(prev => ({ ...prev, [name]: !prev[name] }));

  const filteredBatches = batches.map(b => ({
    ...b,
    files: b.files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
  })).filter(b => !search || b.files.length > 0);

  const totalFiles = batches.reduce((a, b) => a + b.fileCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
            <Library className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">PDF Library</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {batches.length} batch{batches.length !== 1 ? 'es' : ''} · {totalFiles} total PDFs generated
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-white/3 dark:text-white/90 dark:focus:border-brand-500"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/5 h-[160px]">
              <div className="flex items-start justify-between mb-auto">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              </div>
              <div className="mt-4">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-3 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
          <Files className="size-12 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {search ? 'No files match your search' : 'No PDFs generated yet'}
          </p>
          {!search && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Run a batch generation to see files here</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBatches.map(batch => {
            const isOpen = openBatches[batch.batchName];
            const displayName = formatBatchName(batch.batchName);
            const batchDate = new Date(batch.createdAt).toLocaleString();

            return (
              <div key={batch.batchName} className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/3">
                {/* Batch Header */}
                <button
                  onClick={() => toggleBatch(batch.batchName)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors group dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    {isOpen
                      ? <ChevronDown className="size-5 text-brand-500 flex-shrink-0" />
                      : <ChevronRight className="size-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 flex-shrink-0" />
                    }
                    <FolderOpen className={`size-5 flex-shrink-0 ${isOpen ? "text-brand-500" : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"}`} />
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-800 dark:text-white/90">{displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{batchDate}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-white/10 dark:text-gray-300">
                    {batch.files.length} PDFs
                  </span>
                </button>

                {/* File List */}
                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent">
                    {batch.files.length === 0 ? (
                      <p className="p-6 text-center text-gray-500 text-sm dark:text-gray-400">No PDFs in this batch.</p>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {batch.files.map(file => (
                          <div
                            key={file.relativePath}
                            className="flex items-center justify-between px-5 py-4 hover:bg-gray-100/50 transition-colors dark:hover:bg-white/5"
                          >
                            <div className="flex items-center gap-3">
                              <FileDown className="size-5 text-brand-500 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatBytes(file.size)}</p>
                              </div>
                            </div>
                            <a
                              href={`/api/latex-download?path=${encodeURIComponent(file.relativePath)}&view=true`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-brand-400"
                            >
                              <FileDown className="size-4" />
                              View PDF
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Papa from "papaparse";
import { createAudienceList } from "./actions";
import { UploadCloud, Loader2, FileCheck } from "lucide-react";

export default function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = () => {
    if (!file) return setError("Please select a CSV file.");
    if (!name) return setError("Please give your list a name.");
    
    setLoading(true);
    setError("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          await createAudienceList(name, results.data);
          setFile(null);
          setName("");
        } catch (e: any) {
          setError(e.message || "Failed to upload list.");
        } finally {
          setLoading(false);
        }
      },
      error: (e) => {
        setError("Failed to parse CSV: " + e.message);
        setLoading(false);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Import Audience (CSV)</h3>
      
      {error && (
        <div className="rounded-lg bg-error-50 p-4 mb-4 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">List Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Newsletter" 
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">CSV File</label>
          <div 
            className="relative rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800" 
            onClick={() => document.getElementById('csvInput')?.click()}
          >
            <input 
              id="csvInput"
              type="file" 
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex flex-col items-center text-center">
                <FileCheck className="size-8 text-brand-500 mb-2" />
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <UploadCloud className="size-8 text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to select a .csv file</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 max-w-[250px]">Must include an 'Email' column. Other columns will be saved as merge tags.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button 
            onClick={handleUpload}
            disabled={loading || !file || !name}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="animate-spin size-4" />}
            {loading ? "Importing..." : "Upload & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

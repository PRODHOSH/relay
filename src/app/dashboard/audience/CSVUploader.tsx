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
    <div className="bg-[#111118] border border-white/10 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.05)] rounded-none">
      <h3 className="text-xl font-bold uppercase tracking-widest mb-6">Import Audience (CSV)</h3>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">List Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Newsletter" 
            className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">CSV File</label>
          <div className="relative border-2 border-dashed border-white/20 p-8 flex flex-col items-center justify-center bg-[#0a0a0f] hover:border-[#b04090] transition-colors cursor-pointer" onClick={() => document.getElementById('csvInput')?.click()}>
            <input 
              id="csvInput"
              type="file" 
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <>
                <FileCheck size={40} className="text-[#b04090] mb-4" />
                <p className="font-bold">{file.name}</p>
                <p className="text-sm text-[#8888a8]">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <UploadCloud size={40} className="text-[#8888a8] mb-4" />
                <p className="text-[#8888a8]">Click to select a .csv file</p>
                <p className="text-xs text-[#8888a8] mt-2 text-center max-w-sm">Must include an 'Email' column. Other columns like 'FirstName' will be saved as merge tags.</p>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button 
            onClick={handleUpload}
            disabled={loading || !file || !name}
            className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_rgba(176,48,136,0.8)] hover:shadow-[6px_6px_0px_rgba(176,48,136,0.8)] hover:-translate-y-[2px] border border-black rounded-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Importing..." : "Upload & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

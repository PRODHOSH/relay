"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { updateTemplate } from "../actions";
import { Save } from "lucide-react";

export default function TemplateEditor({ 
  id, 
  initialName, 
  initialContent 
}: { 
  id: string, 
  initialName: string, 
  initialContent: string 
}) {
  const [content, setContent] = useState(initialContent);
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateTemplate(id, content, name);
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex justify-between items-center mb-6">
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="bg-transparent text-2xl font-bold uppercase tracking-tight text-white border-b border-transparent hover:border-white/20 focus:border-[#b04090] focus:outline-none transition-colors px-2 py-1"
        />
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-white text-black px-6 py-2 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2 border border-black shadow-[4px_4px_0px_rgba(176,48,136,0.8)] rounded-none disabled:opacity-50"
        >
          <Save size={18} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Editor */}
        <div className="w-1/2 bg-[#111118] border border-white/10 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] flex flex-col rounded-none">
          <div className="p-3 border-b border-white/10 bg-[#0a0a0f] text-sm font-bold uppercase text-[#8888a8]">
            HTML / Markdown
          </div>
          <div className="flex-1 p-2">
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              value={content}
              onChange={(value) => setContent(value || "")}
              options={{ minimap: { enabled: false }, roundedSelection: false, padding: { top: 16 } }}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="w-1/2 bg-white border border-white/10 shadow-[8px_8px_0px_rgba(176,48,136,0.3)] flex flex-col rounded-none relative">
          <div className="p-3 border-b border-gray-200 bg-gray-100 text-sm font-bold uppercase text-gray-500">
            Live Preview
          </div>
          <div className="flex-1 bg-white overflow-hidden p-4">
            <iframe 
              srcDoc={content} 
              className="w-full h-full border-none"
              title="Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

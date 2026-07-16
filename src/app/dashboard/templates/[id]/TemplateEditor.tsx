"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import EmailEditor, { EditorRef } from "react-email-editor";
import { updateTemplate } from "../actions";
import { Save } from "lucide-react";
import { marked } from "marked";
import { useRouter } from "next/navigation";

export default function TemplateEditor({ 
  id, 
  initialName, 
  initialContent,
  initialFormat,
  initialDesignJson
}: { 
  id: string, 
  initialName: string, 
  initialContent: string,
  initialFormat: string,
  initialDesignJson?: string | null
}) {
  const [content, setContent] = useState(initialContent);
  const [name, setName] = useState(initialName);
  const [format, setFormat] = useState(initialFormat || "html");
  const [previewHtml, setPreviewHtml] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const emailEditorRef = useRef<EditorRef>(null);
  const router = useRouter();

  useEffect(() => {
    const parseContent = async () => {
      if (format === "markdown") {
        const html = await marked.parse(content);
        setPreviewHtml(html);
      } else if (format === "html") {
        setPreviewHtml(content);
      }
    };
    parseContent();
  }, [content, format]);

  const onLoad = () => {
    if (initialDesignJson && emailEditorRef.current?.editor) {
      try {
        const design = JSON.parse(initialDesignJson);
        emailEditorRef.current.editor.loadDesign(design);
      } catch (e) {
        console.error("Failed to load design", e);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    if (format === "visual" && emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.exportHtml(async (data) => {
        const { design, html } = data;
        await updateTemplate(id, html, name, format, JSON.stringify(design));
        setSaving(false);
        router.push("/dashboard/templates");
      });
    } else {
      await updateTemplate(id, content, name, format, null);
      setSaving(false);
      router.push("/dashboard/templates");
    }
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
          className="bg-white text-black px-6 py-2 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2 border border-black shadow-[4px_4px_0px_rgba(176,48,136,0.8)] hover:shadow-[6px_6px_0px_rgba(176,48,136,0.8)] hover:-translate-y-[2px] rounded-none disabled:opacity-50"
        >
          <Save size={18} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {format === "visual" ? (
          <div className="w-full bg-white border border-white/10 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] flex flex-col rounded-none relative">
            <div className="p-3 border-b border-gray-200 bg-[#0a0a0f] flex justify-between items-center">
              <span className="text-sm font-bold uppercase text-[#8888a8]">Visual Editor</span>
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="bg-[#111118] text-white border border-white/20 text-xs p-1 rounded-none outline-none focus:border-[#b04090]"
              >
                <option value="html">HTML</option>
                <option value="markdown">Markdown</option>
                <option value="visual">Visual (Drag & Drop)</option>
              </select>
            </div>
            <div className="flex-1">
              <EmailEditor ref={emailEditorRef} onLoad={onLoad} minHeight="100%" />
            </div>
          </div>
        ) : (
          <>
            {/* Code Editor */}
            <div className="w-1/2 bg-[#111118] border border-white/10 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] flex flex-col rounded-none">
              <div className="p-3 border-b border-white/10 bg-[#0a0a0f] flex justify-between items-center">
                <span className="text-sm font-bold uppercase text-[#8888a8]">Editor</span>
                <select 
                  value={format} 
                  onChange={(e) => setFormat(e.target.value)}
                  className="bg-[#111118] text-white border border-white/20 text-xs p-1 rounded-none outline-none focus:border-[#b04090]"
                >
                  <option value="html">HTML</option>
                  <option value="markdown">Markdown</option>
                  <option value="visual">Visual (Drag & Drop)</option>
                </select>
              </div>
              <div className="flex-1 p-2">
                <Editor
                  height="100%"
                  defaultLanguage={format === 'markdown' ? 'markdown' : 'html'}
                  language={format === 'markdown' ? 'markdown' : 'html'}
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
                  srcDoc={previewHtml} 
                  className="w-full h-full border-none"
                  title="Preview"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

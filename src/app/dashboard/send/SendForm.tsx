"use client";

import { useState } from "react";
import { queueEmails } from "./actions";
import { Send, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Template = { id: string; name: string };

export default function SendForm({ templates }: { templates: Template[] }) {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-[#111118] border border-white/10 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.05)] rounded-none">
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 font-bold uppercase flex items-center gap-3">
          <CheckCircle2 size={20} />
          Successfully queued emails for batch sending!
        </div>
      )}

      <form 
        action={async (formData) => {
          setLoading(true);
          await queueEmails(formData);
          setLoading(false);
        }} 
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">Select Template</label>
          <select 
            name="templateId" 
            required
            className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none"
          >
            <option value="">-- Choose a Template --</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">Subject Line</label>
          <input 
            type="text" 
            name="subject" 
            placeholder="Important update from Relay"
            required
            className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">Recipient Emails (comma or newline separated)</label>
          <textarea 
            name="emails" 
            rows={6}
            placeholder="alice@example.com&#10;bob@example.com"
            required
            className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none resize-none"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={loading || templates.length === 0}
            className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-[4px_4px_0px_rgba(176,48,136,0.8)] border border-black rounded-none disabled:opacity-50"
          >
            <Send size={18} />
            {loading ? "Queueing..." : "Queue Batch Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

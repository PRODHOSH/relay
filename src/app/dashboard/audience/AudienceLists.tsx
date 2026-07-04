"use client";

import { Trash2, Users } from "lucide-react";
import { deleteAudienceList } from "./actions";

export default function AudienceLists({ lists }: { lists: any[] }) {
  if (lists.length === 0) {
    return (
      <div className="bg-[#111118] border border-white/10 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.05)] rounded-none text-center">
        <Users size={40} className="mx-auto text-[#8888a8] mb-4" />
        <p className="text-[#8888a8]">No audience lists created yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {lists.map((list) => (
        <div key={list.id} className="bg-[#111118] border border-white/10 p-6 flex justify-between items-center group shadow-[4px_4px_0px_rgba(255,255,255,0.02)] hover:border-[#b04090]/50 transition-colors">
          <div>
            <h4 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Users size={18} className="text-[#b04090]" />
              {list.name}
            </h4>
            <p className="text-sm text-[#8888a8] mt-1">
              {list._count.contacts} contacts • Created {new Date(list.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button 
            onClick={() => deleteAudienceList(list.id)}
            className="text-[#8888a8] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
            title="Delete List"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

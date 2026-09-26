"use client";

import { Trash2, Users } from "lucide-react";
import { deleteAudienceList } from "./actions";

export default function AudienceLists({ lists }: { lists: any[] }) {
  if (lists.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
        <Users className="mx-auto size-10 text-gray-400 mb-4 dark:text-gray-500" />
        <p className="text-gray-500 dark:text-gray-400">No audience lists created yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {lists.map((list) => (
        <div key={list.id} className="rounded-2xl border border-gray-200 bg-white p-5 flex justify-between items-center group hover:border-brand-300 transition-colors dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-500/50">
          <div>
            <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2 dark:text-white/90">
              <Users className="size-5 text-brand-500" />
              {list.name}
            </h4>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              {list._count.contacts} contacts • Created {new Date(list.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button 
            onClick={() => deleteAudienceList(list.id)}
            className="text-gray-400 hover:text-error-500 transition-colors p-2"
            title="Delete List"
          >
            <Trash2 className="size-5" />
          </button>
        </div>
      ))}
    </div>
  );
}

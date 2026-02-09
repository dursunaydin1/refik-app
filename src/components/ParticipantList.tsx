import React from "react";
import { MOCK_GROUP_MEMBERS } from "@/lib/mockData";

export default function ParticipantList() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h3 className="font-bold text-lg text-white font-display">
          Grup Üyeleri
        </h3>
        <span className="text-sm text-primary font-medium">
          {MOCK_GROUP_MEMBERS.length} Kişi
        </span>
      </div>

      <div className="divide-y divide-border/50">
        {MOCK_GROUP_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="size-10 rounded-full border border-border"
                />
                <div
                  className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface ${
                    member.status === "completed"
                      ? "bg-primary"
                      : member.status === "reading"
                        ? "bg-amber-400"
                        : "bg-zinc-500"
                  }`}
                ></div>
              </div>
              <div>
                <p className="font-bold text-white text-sm font-display">
                  {member.name}
                </p>
                <p className="text-xs text-foreground-muted font-display">
                  {member.lastRead}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-primary text-sm font-display">
                %{member.progress}
              </p>
              <p className="text-[10px] text-foreground-muted uppercase tracking-widest font-bold">
                {member.status === "completed"
                  ? "Tamamlandı"
                  : member.status === "reading"
                    ? "Okuyor"
                    : "Bekliyor"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

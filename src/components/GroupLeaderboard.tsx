"use client";

import { Trophy } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  totalRead: number;
  avatar?: string | null;
}

export default function GroupLeaderboard({
  users,
}: {
  users: LeaderboardUser[];
}) {
  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-3 rounded-xl bg-surface-lighter border border-border/50 hover:bg-surface-hover transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${
                      index === 0
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                        : index === 1
                          ? "bg-slate-400/20 text-slate-300 border border-slate-400/50"
                          : index === 2
                            ? "bg-amber-700/20 text-amber-500 border border-amber-700/50"
                            : "bg-surface text-foreground-muted"
                    }
                `}
            >
              {index + 1}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-none mb-1">
                {user.name}
              </h4>
              <p className="text-xs text-foreground-muted">
                {user.totalRead} sayfa
              </p>
            </div>
          </div>

          {index === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
        </div>
      ))}
    </div>
  );
}

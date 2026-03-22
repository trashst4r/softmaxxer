/**
 * Dev Tools User Simulation v1
 * User selector for switching between simulated profiles
 */

import type { DevUser } from "@/types/dev-user";

interface UserSelectorProps {
  users: DevUser[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}

export function UserSelector({ users, selectedUserId, onSelectUser }: UserSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider font-medium text-muted mb-4">
        Simulated Users
      </h3>
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          className={`w-full text-left p-4 rounded-lg border transition-colors ${
            selectedUserId === user.id
              ? "bg-primary/10 border-primary text-on-surface"
              : "bg-surface-container-low border-outline-variant text-muted hover:bg-surface-container-high hover:text-on-surface"
          }`}
        >
          <div className="font-semibold text-sm mb-1">{user.name}</div>
          <div className="text-xs opacity-80">{user.description}</div>
          <div className="text-[10px] uppercase tracking-wider mt-2 opacity-60">
            {user.checkInHistory.length} check-ins
          </div>
        </button>
      ))}
    </div>
  );
}

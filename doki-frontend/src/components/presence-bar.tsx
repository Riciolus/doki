'use client'

import type { User } from '@/types'

interface PresenceBarProps {
  activeUsers: User[]
  totalUsers: number
}

export function PresenceBar({ activeUsers, totalUsers }: PresenceBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 3).map((user) => (
          <div
            key={user.id}
            className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold flex-shrink-0 hover:z-10 transition-all hover:scale-110 cursor-pointer"
            title={user.name}
          >
            {user.avatar}
          </div>
        ))}
        {totalUsers > 3 && (
          <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground">
            +{totalUsers - 3}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-muted-foreground">
          {activeUsers.length} active
        </span>
      </div>
    </div>
  )
}

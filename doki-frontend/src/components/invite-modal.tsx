'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [role, setRole] = useState<'editor' | 'viewer'>('editor')
  const [copied, setCopied] = useState(false)

  const magicLink = `https://doki.app/invite?code=abc123&role=${role}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(magicLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 bg-background border border-border rounded-lg shadow-lg p-4">
        {/* Header */}
        <h2 className="font-bold text-sm mb-3">Invite to Workspace</h2>

        {/* Role Selector */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-xs font-medium text-muted-foreground">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
            className="w-full px-2 py-1.5 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="editor">Editor - Can edit and invite</option>
            <option value="viewer">Viewer - Read-only access</option>
          </select>
        </div>

        {/* Magic Link */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-xs font-medium text-muted-foreground">Magic Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={magicLink}
              className="flex-1 px-2 py-1.5 text-xs rounded border border-border bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={copyToClipboard}
              className="px-2 py-1.5 rounded border border-border hover:bg-muted transition-colors inline-flex items-center gap-1"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-1.5 text-xs rounded border border-border hover:bg-muted transition-colors"
          >
            Close
          </button>
          <button className="flex-1 px-3 py-1.5 text-xs rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
            Send Invite
          </button>
        </div>
      </div>
    </>
  )
}

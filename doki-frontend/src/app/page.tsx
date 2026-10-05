"use client";

import { useState } from "react";
import {
  Archive,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Copy,
  GripVertical,
  Inbox,
  LayoutGrid,
  Menu,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";

type Role = "OWNER" | "EDITOR" | "VIEWER";
type Card = {
  id: number;
  title: string;
  note?: string;
  tag: string;
  tagTone: string;
  assignee: string;
  comments: number;
  date: string;
};
type Column = { id: string; title: string; tone: string; cards: Card[] };

const avatars = [
  { initials: "MA", color: "bg-[#d8c5ff]" },
  { initials: "JK", color: "bg-[#bde7d3]" },
  { initials: "SL", color: "bg-[#ffd4b8]" },
];

const initialColumns: Column[] = [
  { id: "todo", title: "To Do", tone: "bg-[#c7c7c2]", cards: [
    { id: 1, title: "Audit empty states across product", note: "Document gaps and propose a consistent pattern.", tag: "Design", tagTone: "bg-[#e9ddff] text-[#6d4aa2]", assignee: "MA", comments: 3, date: "Aug 12" },
    { id: 2, title: "Define keyboard shortcuts", tag: "Product", tagTone: "bg-[#d9e8ff] text-[#4a6594]", assignee: "JK", comments: 1, date: "Aug 14" },
    { id: 3, title: "Research export formats", tag: "Research", tagTone: "bg-[#ffe4ad] text-[#8a641e]", assignee: "SL", comments: 0, date: "Aug 16" },
  ] },
  { id: "progress", title: "In Progress", tone: "bg-[#e7b84b]", cards: [
    { id: 4, title: "Build presence indicators", note: "Show who is active without adding visual noise.", tag: "Frontend", tagTone: "bg-[#d9e8ff] text-[#4a6594]", assignee: "JK", comments: 6, date: "Aug 09" },
    { id: 5, title: "Create invite flow", tag: "Core", tagTone: "bg-[#ffdcd5] text-[#a54f42]", assignee: "MA", comments: 4, date: "Aug 11" },
  ] },
  { id: "review", title: "In Review", tone: "bg-[#9e72dc]", cards: [
    { id: 6, title: "Workspace navigation v2", note: "Tighten hierarchy and make board switching faster.", tag: "Design", tagTone: "bg-[#e9ddff] text-[#6d4aa2]", assignee: "SL", comments: 8, date: "Aug 07" },
    { id: 7, title: "Realtime sync error states", tag: "Frontend", tagTone: "bg-[#d9e8ff] text-[#4a6594]", assignee: "JK", comments: 2, date: "Aug 08" },
  ] },
  { id: "done", title: "Done", tone: "bg-[#56ad79]", cards: [
    { id: 8, title: "Set up board permissions", tag: "Core", tagTone: "bg-[#ffdcd5] text-[#a54f42]", assignee: "MA", comments: 5, date: "Aug 02" },
    { id: 9, title: "Define visual language", tag: "Design", tagTone: "bg-[#e9ddff] text-[#6d4aa2]", assignee: "SL", comments: 11, date: "Aug 03" },
  ] },
];

function Avatar({ initials, color = "bg-[#e7e5e4]", small = false }: { initials: string; color?: string; small?: boolean }) {
  return <span className={`${small ? "size-6 text-[9px]" : "size-8 text-[11px]"} inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white font-semibold text-[#37352f] ${color}`}>{initials}</span>;
}

function Sidebar({ dark, setDark }: { dark: boolean; setDark: (value: boolean) => void }) {
  return <aside className="flex w-[250px] shrink-0 flex-col border-r border-[#e9e9e7] bg-[#f7f7f5] p-3 text-[14px] dark:border-[#2f2f2f] dark:bg-[#191919]">
    <div className="flex items-center justify-between px-2 py-2"><div className="flex items-center gap-2.5 font-semibold"><span className="flex size-8 items-center justify-center rounded-lg bg-[#37352f] text-xs text-white dark:bg-[#f1f1ef] dark:text-[#37352f]">同期</span><span className="text-[17px]">Dōki</span></div><button className="rounded p-1.5 text-[#9b9a97] hover:bg-black/5" aria-label="Collapse sidebar"><ChevronLeft className="size-5" /></button></div>
    <div className="my-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-[#6b6a67] shadow-sm dark:bg-[#202020] dark:text-[#aaa]"><Search className="size-4" /><span>Quick find</span><kbd className="ml-auto rounded border border-[#e9e9e7] px-1.5 text-[11px] dark:border-[#3a3a3a]">⌘ K</kbd></div>
    <nav className="flex flex-col gap-1 text-[#6b6a67] dark:text-[#aaa]"><button className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-black/5"><Search className="size-4" />Search</button><button className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-black/5"><Inbox className="size-4" />Inbox<span className="ml-auto rounded bg-[#ffdcd5] px-2 py-0.5 text-xs text-[#a54f42]">4</span></button><button className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-black/5"><Settings className="size-4" />Settings</button></nav>
    <div className="mt-7"><div className="flex items-center justify-between px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#9b9a97]"><span>Boards</span><Plus className="size-4" /></div><div className="flex flex-col gap-1"><button className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2.5 text-left font-medium shadow-sm dark:bg-[#292929]"><LayoutGrid className="size-4" />Sprint Board Q3</button><button className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[#6b6a67] hover:bg-black/5 dark:text-[#aaa]"><ClipboardList className="size-4" />Product Roadmap</button></div></div>
    <div className="mt-auto border-t border-[#e9e9e7] pt-3 dark:border-[#2f2f2f]"><div className="flex items-center gap-2.5 px-2 py-2"><Avatar initials="AR" color="bg-[#c9e1ff]" small /><div className="min-w-0 flex-1"><p className="truncate font-medium">Alex Rivera</p><p className="text-xs text-[#9b9a97]">alex@acme.co</p></div><button onClick={() => setDark(!dark)} className="rounded p-1.5 text-[#9b9a97] hover:bg-black/5" aria-label="Toggle dark mode">{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button></div></div>
  </aside>;
}

function TaskCard({ card, canEdit, onClick }: { card: Card; canEdit: boolean; onClick: () => void }) {
  return <button onClick={onClick} className="group w-full rounded-lg border border-[#e9e9e7] bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:bg-[#f1f1ef] dark:border-[#2f2f2f] dark:bg-[#202020] dark:hover:bg-[#292929]"><div className="flex gap-2"><GripVertical className={`mt-0.5 size-4 shrink-0 text-[#c7c6c2] ${canEdit ? "opacity-0 group-hover:opacity-100" : "invisible"}`} /><div className="min-w-0 flex-1"><p className="text-[14px] font-medium leading-5 text-[#37352f] dark:text-[#e9e9e7]">{card.title}</p>{card.note && <p className="mt-1.5 line-clamp-2 text-xs leading-4 text-[#9b9a97]">{card.note}</p>}<div className="mt-3 flex items-center gap-2"><span className={`rounded px-2 py-1 text-[11px] font-medium ${card.tagTone}`}>{card.tag}</span><Avatar initials={card.assignee} small /><span className="ml-auto flex items-center gap-1 text-xs text-[#9b9a97]"><MessageSquare className="size-3.5" />{card.comments}</span><span className="font-mono text-[11px] text-[#9b9a97]">{card.date}</span></div></div></div></button>;
}

export default function Page() {
  const [dark, setDark] = useState(true);
  const [role, setRole] = useState<Role>("OWNER");
  const [columns, setColumns] = useState(initialColumns);
  const [selected, setSelected] = useState<Card | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canEdit = role !== "VIEWER";
  const addCard = (columnId: string) => { if (!canEdit) return; setColumns((items) => items.map((column) => column.id === columnId ? { ...column, cards: [...column.cards, { id: Date.now(), title: "Untitled task", tag: "New", tagTone: "bg-[#e9e9e7] text-[#6b6a67]", assignee: "AR", comments: 0, date: "Today" }] } : column)); };

  return <div className={dark ? "dark" : ""}><main className="doki-shell flex h-screen min-w-[1100px] overflow-hidden bg-[#fbfbfb] font-sans text-[#37352f] dark:bg-[#191919] dark:text-[#e9e9e7]"><Sidebar dark={dark} setDark={setDark} /><section className="flex min-w-0 flex-1 flex-col"><header className="flex h-16 shrink-0 items-center gap-5 border-b border-[#e9e9e7] bg-white px-6 dark:border-[#2f2f2f] dark:bg-[#191919]"><div className="flex min-w-[300px] items-center gap-2 text-sm text-[#9b9a97]"><span>Acme</span><ChevronRight className="size-4" /><span className="text-[#37352f] dark:text-[#e9e9e7]">Sprint Board Q3</span></div><div className="flex flex-1 items-center justify-center"><div className="flex items-center gap-2"><div className="flex -space-x-2">{avatars.map((avatar) => <Avatar key={avatar.initials} {...avatar} small />)}</div><span className="text-xs text-[#9b9a97]"><i className="mr-1.5 inline-block size-2 rounded-full bg-[#50a878]" />3 active now</span></div></div><div className="flex items-center gap-3"><select value={role} onChange={(e) => setRole(e.target.value as Role)} className="h-8 rounded border border-[#e9e9e7] bg-transparent px-2 text-xs font-semibold tracking-wide outline-none dark:border-[#3a3a3a]"><option>OWNER</option><option>EDITOR</option><option>VIEWER</option></select>{canEdit && <button onClick={() => setInviteOpen(true)} className="flex h-9 items-center gap-1.5 rounded-lg bg-[#37352f] px-3.5 text-xs font-medium text-white hover:opacity-90 dark:bg-[#e9e9e7] dark:text-[#37352f]"><Users className="size-4" />Invite</button>}<button className="rounded p-2 text-[#9b9a97] hover:bg-black/5" aria-label="Help"><CircleHelp className="size-5" /></button></div></header>{role === "VIEWER" && <div className="flex h-9 shrink-0 items-center justify-center gap-2 border-b border-[#e4d6b5] bg-[#fff7e5] text-xs text-[#8a641e] dark:border-[#594d35] dark:bg-[#302a1d] dark:text-[#e7c87c]"><Archive className="size-4" />Viewing in Read-Only mode · Editing is disabled</div>}<div className="flex h-24 shrink-0 items-center justify-between border-b border-[#e9e9e7] px-7 dark:border-[#2f2f2f]"><div><div className="mb-1 flex items-center gap-2 text-xs text-[#9b9a97]"><span className="rounded bg-[#f1f1ef] px-2 py-1 dark:bg-[#292929]">Q3 · 2024</span><span>Last edited 2m ago</span></div><h1 className="text-2xl font-semibold tracking-[-0.02em]">Sprint Board Q3</h1></div><div className="flex items-center gap-3"><button className="flex items-center gap-1.5 rounded-lg border border-[#e9e9e7] px-3 py-2 text-xs text-[#6b6a67] hover:bg-[#f1f1ef] dark:border-[#3a3a3a] dark:text-[#aaa] dark:hover:bg-[#292929]"><Sparkles className="size-4" />Automations</button><button className="rounded p-2 text-[#9b9a97] hover:bg-black/5" aria-label="Board menu"><MoreHorizontal className="size-5" /></button></div></div><div className="flex min-h-0 flex-1 flex-col overflow-hidden"><div className="flex items-center justify-between px-7 py-3"><div className="flex items-center gap-2 text-xs text-[#9b9a97]"><span className="font-medium text-[#6b6a67] dark:text-[#aaa]">{columns.reduce((sum, column) => sum + column.cards.length, 0)} tasks</span><span>·</span><span>Updated live</span><span className="inline-flex size-2 rounded-full bg-[#50a878]" /></div><button className="flex items-center gap-1.5 text-xs text-[#9b9a97] hover:text-[#37352f] dark:hover:text-[#e9e9e7]"><Menu className="size-4" />Filter & sort <ChevronDown className="size-4" /></button></div><div className="flex min-h-0 flex-1 gap-4 overflow-x-auto px-7 pb-7">{columns.map((column) => <section key={column.id} className="flex min-w-[300px] max-w-[350px] flex-1 flex-col rounded-xl bg-[#f7f7f5] p-3 dark:bg-[#202020]"><div className="flex items-center gap-2 px-1 pb-3"><span className={`size-2.5 rounded-full ${column.tone}`} /><h2 className="text-sm font-semibold">{column.title}</h2><span className="rounded bg-[#e9e9e7] px-2 py-0.5 text-xs text-[#6b6a67] dark:bg-[#2f2f2f] dark:text-[#aaa]">{column.cards.length}</span><div className="ml-auto flex items-center gap-1 text-[#9b9a97]"><button className="rounded p-1 hover:bg-black/5" aria-label={`Add card to ${column.title}`} onClick={() => addCard(column.id)}><Plus className="size-4" /></button><MoreHorizontal className="size-4" /></div></div><div className="flex flex-col gap-3 overflow-y-auto">{column.cards.map((card) => <TaskCard key={card.id} card={card} canEdit={canEdit} onClick={() => setSelected(card)} />)}</div>{canEdit && <button onClick={() => addCard(column.id)} className="mt-3 flex items-center gap-1.5 rounded px-1.5 py-1.5 text-xs text-[#9b9a97] hover:bg-black/5"><Plus className="size-4" />Add card</button>}</section>)}</div></div></section></main>{selected && <div className="fixed inset-0 z-20 bg-black/15" onClick={() => setSelected(null)}><aside className="absolute right-0 top-0 flex h-full w-[440px] flex-col border-l border-[#e9e9e7] bg-white shadow-xl dark:border-[#2f2f2f] dark:bg-[#202020]" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between border-b border-[#e9e9e7] px-5 py-4 dark:border-[#2f2f2f]"><span className="text-xs text-[#9b9a97]">TASK-{String(selected.id).padStart(3, "0")}</span><button onClick={() => setSelected(null)} className="rounded p-1 text-[#9b9a97] hover:bg-black/5" aria-label="Close task details"><X className="size-5" /></button></div><div className="flex-1 overflow-y-auto p-6"><h2 className="text-2xl font-semibold leading-7">{selected.title}</h2><p className="mt-3 text-sm leading-6 text-[#6b6a67] dark:text-[#aaa]">{selected.note ?? "A focused task in the Sprint Board Q3 workspace. Keep the scope clear and share updates as the work moves forward."}</p><div className="mt-6 grid grid-cols-2 gap-4 border-y border-[#e9e9e7] py-4 text-sm dark:border-[#2f2f2f]"><div><p className="text-xs text-[#9b9a97]">Status</p><p className="mt-1.5 font-medium">In Progress <ChevronDown className="ml-1 inline size-4" /></p></div><div><p className="text-xs text-[#9b9a97]">Assignee</p><p className="mt-1.5 flex items-center gap-1.5 font-medium"><Avatar initials={selected.assignee} small />{selected.assignee}</p></div><div><p className="text-xs text-[#9b9a97]">Priority</p><p className="mt-1.5 font-medium">High</p></div><div><p className="text-xs text-[#9b9a97]">Due date</p><p className="mt-1.5 flex items-center gap-1.5 font-medium"><CalendarDays className="size-4" />{selected.date}</p></div></div><h3 className="mt-6 text-sm font-semibold">Description</h3><p className="mt-2 text-sm leading-6 text-[#6b6a67] dark:text-[#aaa]">Collaborate with the team to bring this work across the finish line. Keep decisions documented here so everyone has the same context.</p><h3 className="mt-7 flex items-center gap-2 text-sm font-semibold"><MessageSquare className="size-4" />Comments <span className="font-normal text-[#9b9a97]">{selected.comments}</span></h3><div className="mt-4 flex gap-2.5"><Avatar initials="MA" color="bg-[#d8c5ff]" small /><div className="rounded-lg bg-[#f7f7f5] px-3 py-2.5 text-sm leading-5 dark:bg-[#292929]">Looks good from my side. Let&apos;s keep the interaction compact.</div></div></div><div className="border-t border-[#e9e9e7] p-4 dark:border-[#2f2f2f]"><div className="flex items-center gap-2 rounded-lg border border-[#e9e9e7] px-3 py-2 dark:border-[#3a3a3a]"><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Write a comment..." /><button className="text-[#9b9a97] hover:text-[#37352f]" aria-label="Send comment"><Send className="size-4" /></button></div></div></aside></div>}{inviteOpen && <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/25 p-4" onClick={() => setInviteOpen(false)}><div className="w-full max-w-[420px] rounded-xl border border-[#e9e9e7] bg-white p-5 shadow-xl dark:border-[#2f2f2f] dark:bg-[#202020]" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">Invite to Workspace</h2><p className="mt-1.5 text-sm text-[#9b9a97]">Share a magic link with someone on your team.</p></div><button onClick={() => setInviteOpen(false)} className="text-[#9b9a97]" aria-label="Close invite dialog"><X className="size-5" /></button></div><label className="mt-5 block text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">Role<select className="mt-1.5 block h-10 w-full rounded-lg border border-[#e9e9e7] bg-transparent px-3 text-sm dark:border-[#3a3a3a]"><option>EDITOR</option><option>VIEWER</option></select></label><div className="mt-5"><p className="text-xs font-medium text-[#6b6a67] dark:text-[#aaa]">Magic link</p><div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#e9e9e7] p-2 dark:border-[#3a3a3a]"><span className="min-w-0 flex-1 truncate font-mono text-xs text-[#9b9a97]">dok.i/acme/invite/7f2a9c</span><button onClick={() => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); }} className="flex items-center gap-1.5 rounded bg-[#f1f1ef] px-3 py-1.5 text-xs dark:bg-[#292929]">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? "Copied" : "Copy"}</button></div></div><button onClick={() => setInviteOpen(false)} className="mt-5 w-full rounded-lg bg-[#37352f] py-2.5 text-sm font-medium text-white dark:bg-[#e9e9e7] dark:text-[#37352f]">Done</button></div></div>}</div>;
}

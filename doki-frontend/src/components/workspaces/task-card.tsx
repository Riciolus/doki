import { GripVertical, MessageSquare } from "lucide-react";
import Avatar from "./avatar";

export type Card = {
  id: number;
  title: string;
  note?: string;
  tag: string;
  tagTone: string;
  assignee: string;
  comments: number;
  date: string;
};

export default function TaskCard({
  card,
  canEdit,
  onClick,
}: {
  card: Card;
  canEdit: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-lg border border-[#e9e9e7] bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:bg-[#f1f1ef] dark:border-[#2f2f2f] dark:bg-[#202020] dark:hover:bg-[#292929]"
    >
      <div className="flex gap-2">
        <GripVertical
          className={`mt-0.5 size-4 shrink-0 text-[#c7c6c2] ${canEdit ? "opacity-0 group-hover:opacity-100" : "invisible"}`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium leading-5 text-[#37352f] dark:text-[#e9e9e7]">
            {card.title}
          </p>
          {card.note && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-4 text-[#9b9a97]">
              {card.note}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`rounded px-2 py-1 text-[11px] font-medium ${card.tagTone}`}
            >
              {card.tag}
            </span>
            <Avatar initials={card.assignee} small />
            <span className="ml-auto flex items-center gap-1 text-xs text-[#9b9a97]">
              <MessageSquare className="size-3.5" />
              {card.comments}
            </span>
            <span className="font-mono text-[11px] text-[#9b9a97]">
              {card.date}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

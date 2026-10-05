export default function Avatar({
  initials,
  color = "bg-[#e7e5e4]",
  small = false,
}: {
  initials: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <span
      className={`${small ? "size-6 text-[9px]" : "size-8 text-[11px]"} inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white font-semibold text-[#37352f] ${color}`}
    >
      {initials}
    </span>
  );
}

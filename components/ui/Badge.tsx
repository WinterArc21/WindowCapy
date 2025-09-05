export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-text border border-outline">{children}</span>
}

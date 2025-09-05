export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={['rounded-xl border border-outline bg-white p-4 shadow-sm', className].filter(Boolean).join(' ')}>{children}</div>
}

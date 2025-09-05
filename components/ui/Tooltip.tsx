'use client'
export default function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span className="group relative">
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">{text}</span>
    </span>
  )
}

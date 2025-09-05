'use client'
export default function SensitiveContentBlur({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative'>
      <div className='pointer-events-none absolute inset-0 rounded-lg backdrop-blur-sm bg-white/40 border border-outline'></div>
      <div aria-label='Sensitive content' className='relative'>{children}</div>
    </div>
  )
}

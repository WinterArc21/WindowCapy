'use client'
export default function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  if (!open) return null
  return (
    <div role='dialog' aria-modal className='fixed inset-0 z-50 grid place-items-center bg-black/20 p-4' onClick={onClose}>
      <div className='max-w-md w-full rounded-xl border border-outline bg-white p-4' onClick={(e) => e.stopPropagation()}>
        {title ? <h2 className='mb-2 text-lg font-semibold'>{title}</h2> : null}
        {children}
      </div>
    </div>
  )
}

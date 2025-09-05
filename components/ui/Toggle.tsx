'use client'
export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={
        'inline-flex items-center gap-2 rounded-full border border-outline px-3 py-1 text-sm ' +
        (checked ? 'bg-primary' : 'bg-secondary')
      }
    >
      <span className={'h-2 w-2 rounded-full ' + (checked ? 'bg-black' : 'bg-outline')}></span>
      {label || (checked ? 'On' : 'Off')}
    </button>
  )
}

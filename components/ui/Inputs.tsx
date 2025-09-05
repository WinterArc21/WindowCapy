import clsx from 'clsx'
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2',
        props.className
      )}
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx(
        'w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2',
        props.className
      )}
    />
  )
}

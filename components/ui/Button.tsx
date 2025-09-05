import clsx from 'clsx'

export default function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const styles =
    variant === 'primary'
      ? 'bg-primary text-black hover:opacity-90'
      : variant === 'secondary'
      ? 'bg-secondary text-text hover:bg-tertiary/30'
      : 'bg-transparent text-text hover:bg-secondary'

  return (
    <button type={type} className={clsx(base, styles, className)} {...props}>
      {children}
    </button>
  )
}
